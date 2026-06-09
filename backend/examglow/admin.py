from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import (
    QuizSet, QuizQuestion, QuizAttempt,
    FlashcardDeck, StaticFlashcard, UserFlashcardProgress,
    SyllabusProgress, PastPaperAttempt, StudyGoal, UserBookmark,
)


class QuizQuestionInline(TabularInline):
    model = QuizQuestion
    extra = 1
    fields = ('sort_order', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'topic')


@admin.register(QuizSet)
class QuizSetAdmin(ModelAdmin):
    list_display = ('title', 'subject', 'course', 'level', 'created_at')
    list_filter = ('subject', 'course', 'level')
    search_fields = ('title', 'subject')
    inlines = [QuizQuestionInline]


@admin.register(QuizQuestion)
class QuizQuestionAdmin(ModelAdmin):
    list_display = ('quiz_set', 'sort_order', 'question', 'correct_answer', 'topic')
    list_filter = ('quiz_set__subject',)
    search_fields = ('question', 'topic')


@admin.register(QuizAttempt)
class QuizAttemptAdmin(ModelAdmin):
    list_display = ('user', 'quiz_set', 'score', 'total', 'created_at')
    list_filter = ('quiz_set__subject',)
    readonly_fields = ('user', 'quiz_set', 'score', 'total', 'time_taken_seconds', 'answers', 'created_at')


class StaticFlashcardInline(TabularInline):
    model = StaticFlashcard
    extra = 1
    fields = ('front', 'back', 'topic', 'image_url')


@admin.register(FlashcardDeck)
class FlashcardDeckAdmin(ModelAdmin):
    list_display = ('name', 'subject', 'course', 'level', 'card_count')
    list_filter = ('subject', 'course')
    search_fields = ('name', 'subject')
    inlines = [StaticFlashcardInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Auto-update card_count
        obj.card_count = obj.cards.count()
        obj.save(update_fields=['card_count'])


@admin.register(StaticFlashcard)
class StaticFlashcardAdmin(ModelAdmin):
    list_display = ('deck', 'front', 'topic')
    list_filter = ('deck__subject',)
    search_fields = ('front', 'back', 'topic')


@admin.register(SyllabusProgress)
class SyllabusProgressAdmin(ModelAdmin):
    list_display = ('user', 'subject_id', 'objective_id', 'completed')
    list_filter = ('subject_id', 'completed')
    readonly_fields = ('user', 'subject_id', 'objective_id', 'completed', 'completed_at', 'created_at')


@admin.register(PastPaperAttempt)
class PastPaperAttemptAdmin(ModelAdmin):
    list_display = ('user', 'subject', 'paper_code', 'year', 'session', 'attempted_at')
    list_filter = ('subject', 'year')
    readonly_fields = ('user', 'paper_code', 'paper_type', 'subject', 'session', 'year', 'attempted_at')


@admin.register(StudyGoal)
class StudyGoalAdmin(ModelAdmin):
    list_display = ('user', 'title', 'completed', 'created_at')
    list_filter = ('completed',)


@admin.register(UserBookmark)
class UserBookmarkAdmin(ModelAdmin):
    list_display = ('user', 'resource_type', 'title', 'subject', 'created_at')
    list_filter = ('resource_type', 'subject')
