"""
ExamGlow API views — syllabus, quizzes, flashcards, past papers, goals, bookmarks.
These mirror the createServerFn handlers in yuna's src/api/*.ts files.
"""
from django.db.models import Count, Max, Avg, ExpressionWrapper, FloatField, F, Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    SyllabusProgress, QuizSet, QuizQuestion, QuizAttempt,
    FlashcardDeck, StaticFlashcard, UserFlashcardProgress,
    PastPaperAttempt, StudyGoal, UserBookmark,
)
from .serializers import (
    SyllabusProgressSerializer, QuizSetSerializer, QuizQuestionSerializer,
    QuizAttemptSerializer, FlashcardDeckSerializer, StaticFlashcardSerializer,
    PastPaperAttemptSerializer, StudyGoalSerializer, UserBookmarkSerializer,
)


# ─── Syllabus ─────────────────────────────────────────────────────────────────

class SyllabusProgressListView(APIView):
    """
    GET  /api/examglow/syllabus/progress/  → all user's progress rows
    POST /api/examglow/syllabus/progress/  → bulk upsert
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = SyllabusProgress.objects.filter(user=request.user)
        return Response(SyllabusProgressSerializer(qs, many=True).data)

    def post(self, request):
        """Bulk upsert: [{ subjectId, objectiveId, completed }]"""
        items = request.data if isinstance(request.data, list) else request.data.get('progress', [])
        for item in items:
            SyllabusProgress.objects.update_or_create(
                user=request.user,
                subject_id=item['subjectId'],
                objective_id=item['objectiveId'],
                defaults={
                    'completed': item.get('completed', False),
                    'completed_at': timezone.now() if item.get('completed') else None,
                }
            )
        return Response({'updated': len(items)})


class SyllabusProgressToggleView(APIView):
    """
    POST /api/examglow/syllabus/toggle/
    Body: { subjectId, objectiveId, completed }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get('subjectId')
        objective_id = request.data.get('objectiveId')
        completed = bool(request.data.get('completed', False))

        if not subject_id or not objective_id:
            return Response({'error': 'subjectId and objectiveId required'}, status=400)

        obj, _ = SyllabusProgress.objects.update_or_create(
            user=request.user,
            subject_id=subject_id,
            objective_id=objective_id,
            defaults={
                'completed': completed,
                'completed_at': timezone.now() if completed else None,
            }
        )
        return Response(SyllabusProgressSerializer(obj).data)


# ─── Quizzes ──────────────────────────────────────────────────────────────────

class QuizSetListView(generics.ListAPIView):
    """
    GET /api/examglow/quizzes/
    Returns all quiz sets with the current user's attempt_count and best_score annotated.
    """
    serializer_class = QuizSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            QuizSet.objects
            .annotate(
                attempt_count=Count('attempts', filter=Q(attempts__user=user)),
                best_score=Max(
                    ExpressionWrapper(
                        F('attempts__score') * 100.0 / F('attempts__total'),
                        output_field=FloatField()
                    ),
                    filter=Q(attempts__user=user),
                )
            )
            .order_by('subject', 'title')
        )


class QuizDetailView(APIView):
    """
    GET /api/examglow/quizzes/<pk>/
    Returns the quiz set + all questions.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            quiz = QuizSet.objects.get(pk=pk)
        except QuizSet.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        questions = quiz.questions.all().order_by('sort_order')
        return Response({
            'quiz': QuizSetSerializer(quiz).data,
            'questions': QuizQuestionSerializer(questions, many=True).data,
        })


class QuizSubmitView(APIView):
    """
    POST /api/examglow/quizzes/<pk>/submit/
    Body: { answers: { questionId: 'A'|'B'|'C'|'D' }, time_taken_seconds }
    Returns: { score, total, pct, graded: { id: { correct, correctAnswer } } }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            quiz = QuizSet.objects.get(pk=pk)
        except QuizSet.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        answers = request.data.get('answers', {})
        time_taken = request.data.get('time_taken_seconds', 0)

        questions = list(quiz.questions.all())
        score = 0
        graded = {}

        for q in questions:
            user_answer = answers.get(str(q.id), '').upper()
            correct = user_answer == q.correct_answer.upper()
            if correct:
                score += 1
            graded[str(q.id)] = {
                'correct': correct,
                'correctAnswer': q.correct_answer,
            }

        total = len(questions)
        pct = round(score / total * 100) if total else 0

        QuizAttempt.objects.create(
            user=request.user,
            quiz_set=quiz,
            score=score,
            total=total,
            time_taken_seconds=time_taken,
            answers=answers,
        )

        # Log study activity (streak update)
        try:
            request.user.log_study_time(minutes=max(1, time_taken / 60))
        except Exception:
            pass

        return Response({'score': score, 'total': total, 'pct': pct, 'graded': graded})


# ─── Flashcard Decks ──────────────────────────────────────────────────────────

class FlashcardDeckListView(generics.ListAPIView):
    """GET /api/examglow/flashcards/decks/"""
    serializer_class = FlashcardDeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        course = getattr(user, 'course', 'Cambridge IGCSE') or 'Cambridge IGCSE'
        from django.db.models import Case, IntegerField, Value, When
        return FlashcardDeck.objects.annotate(
            priority=Case(
                When(course=course, then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            )
        ).order_by('priority', 'subject', 'name')


class FlashcardDeckDetailView(APIView):
    """GET /api/examglow/flashcards/decks/<pk>/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            deck = FlashcardDeck.objects.get(pk=pk)
        except FlashcardDeck.DoesNotExist:
            return Response({'error': 'Deck not found'}, status=404)

        cards = StaticFlashcard.objects.filter(deck=deck)
        user = request.user

        # Fetch progress for this user in one query
        progress_map = {
            p.flashcard_id: p
            for p in UserFlashcardProgress.objects.filter(user=user, flashcard__deck=deck)
        }

        card_data = []
        for card in cards:
            prog = progress_map.get(card.id)
            card_data.append({
                'id': card.id,
                'deck_id': deck.id,
                'front': card.front,
                'back': card.back,
                'topic': card.topic,
                'image_url': card.image_url,
                'status': prog.status if prog else 'new',
                'times_correct': prog.times_correct if prog else 0,
                'times_seen': prog.times_seen if prog else 0,
            })

        mastered = sum(1 for c in card_data if c['status'] == 'known')
        return Response({
            'deck': FlashcardDeckSerializer(deck).data,
            'cards': card_data,
            'masteredCount': mastered,
            'totalCount': len(card_data),
        })


class FlashcardProgressView(APIView):
    """
    POST /api/examglow/flashcards/progress/
    Body: { flashcard_id, known: bool, quality: 0-5 }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        flashcard_id = request.data.get('flashcard_id')
        known = bool(request.data.get('known', False))
        quality = int(request.data.get('quality', 4 if known else 1))

        try:
            flashcard = StaticFlashcard.objects.get(pk=flashcard_id)
        except StaticFlashcard.DoesNotExist:
            return Response({'error': 'Flashcard not found'}, status=404)

        prog, created = UserFlashcardProgress.objects.get_or_create(
            user=request.user,
            flashcard=flashcard,
        )
        prog.times_seen += 1
        if known:
            prog.times_correct += 1
        prog.status = 'known' if known else 'learning'
        prog.update_sm2(quality)
        prog.save()

        return Response({'success': True})


class DueFlashcardsView(APIView):
    """GET /api/examglow/flashcards/decks/<pk>/due/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            deck = FlashcardDeck.objects.get(pk=pk)
        except FlashcardDeck.DoesNotExist:
            return Response({'error': 'Deck not found'}, status=404)

        today = timezone.now().date()
        cards = StaticFlashcard.objects.filter(deck=deck)
        progress_map = {
            p.flashcard_id: p
            for p in UserFlashcardProgress.objects.filter(user=request.user, flashcard__deck=deck)
        }

        due_cards = []
        for card in cards:
            prog = progress_map.get(card.id)
            if prog is None or prog.due_date <= today:
                due_cards.append({
                    'id': card.id,
                    'deck_id': deck.id,
                    'front': card.front,
                    'back': card.back,
                    'topic': card.topic,
                    'image_url': card.image_url,
                    'status': prog.status if prog else 'new',
                    'times_correct': prog.times_correct if prog else 0,
                    'times_seen': prog.times_seen if prog else 0,
                    'due_date': str(prog.due_date) if prog else str(today),
                    'interval_days': prog.interval_days if prog else 1,
                })

        return Response({'cards': due_cards, 'dueCount': len(due_cards)})


# ─── Past Papers ─────────────────────────────────────────────────────────────

class PastPaperAttemptView(APIView):
    """
    GET  /api/examglow/past-papers/  → list user's attempts
    POST /api/examglow/past-papers/  → record a new attempt
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = PastPaperAttempt.objects.filter(user=request.user)
        return Response(PastPaperAttemptSerializer(qs, many=True).data)

    def post(self, request):
        serializer = PastPaperAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)


# ─── Study Goals ──────────────────────────────────────────────────────────────

class StudyGoalListView(APIView):
    """GET/POST /api/examglow/goals/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        goals = StudyGoal.objects.filter(user=request.user)
        return Response(StudyGoalSerializer(goals, many=True).data)

    def post(self, request):
        title = request.data.get('title', '').strip()
        if not title:
            return Response({'error': 'title required'}, status=400)
        goal = StudyGoal.objects.create(user=request.user, title=title)
        return Response(StudyGoalSerializer(goal).data, status=201)


class StudyGoalDetailView(APIView):
    """PATCH/DELETE /api/examglow/goals/<pk>/"""
    permission_classes = [permissions.IsAuthenticated]

    def _get(self, request, pk):
        try:
            return StudyGoal.objects.get(pk=pk, user=request.user)
        except StudyGoal.DoesNotExist:
            return None

    def patch(self, request, pk):
        goal = self._get(request, pk)
        if not goal:
            return Response({'error': 'Not found'}, status=404)
        goal.completed = bool(request.data.get('completed', goal.completed))
        goal.save(update_fields=['completed'])
        return Response(StudyGoalSerializer(goal).data)

    def delete(self, request, pk):
        goal = self._get(request, pk)
        if not goal:
            return Response({'error': 'Not found'}, status=404)
        goal.delete()
        return Response(status=204)


# ─── Bookmarks ────────────────────────────────────────────────────────────────

class BookmarkView(APIView):
    """
    GET  /api/examglow/bookmarks/  → list
    POST /api/examglow/bookmarks/  → toggle (add if missing, remove if present)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = UserBookmark.objects.filter(user=request.user)
        return Response(UserBookmarkSerializer(qs, many=True).data)

    def post(self, request):
        resource_type = request.data.get('resourceType', '')
        title = request.data.get('title', '')
        if not resource_type or not title:
            return Response({'error': 'resourceType and title required'}, status=400)

        existing = UserBookmark.objects.filter(
            user=request.user, resource_type=resource_type, title=title
        ).first()

        if existing:
            existing.delete()
            return Response({'bookmarked': False})

        UserBookmark.objects.create(
            user=request.user,
            resource_type=resource_type,
            title=title,
            subject=request.data.get('subject', ''),
            url=request.data.get('url', ''),
        )
        return Response({'bookmarked': True}, status=201)


class BookmarkCheckView(APIView):
    """GET /api/examglow/bookmarks/check/?resourceType=&title="""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resource_type = request.query_params.get('resourceType', '')
        title = request.query_params.get('title', '')
        exists = UserBookmark.objects.filter(
            user=request.user, resource_type=resource_type, title=title
        ).exists()
        return Response({'bookmarked': exists})


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DashboardView(APIView):
    """
    GET /api/examglow/dashboard/
    Aggregates all the data yuna's getDashboardDataFn returns.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user.validate_streak()

        goals = StudyGoal.objects.filter(user=user).order_by('created_at')
        bookmarks = UserBookmark.objects.filter(user=user).order_by('-created_at')[:8]
        quiz_stats = QuizAttempt.objects.filter(user=user).aggregate(
            total_attempts=Count('id'),
            avg_score=Avg(
                ExpressionWrapper(
                    F('score') * 100.0 / F('total'),
                    output_field=FloatField()
                )
            )
        )

        from users.serializers import UserSerializer
        avg_score = round(quiz_stats['avg_score']) if quiz_stats['avg_score'] is not None else None

        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'streak': user.study_streak,
            'longest_streak': user.longest_streak,
            'goals': StudyGoalSerializer(goals, many=True).data,
            'bookmarks': UserBookmarkSerializer(bookmarks, many=True).data,
            'avgScore': avg_score,
            'totalAttempts': quiz_stats['total_attempts'] or 0,
        })
