"""Utility to create notifications from anywhere in the app."""
from django.contrib.auth import get_user_model


def create_notification(user, type: str, title: str, body: str, link: str = ''):
    """Create a notification and trigger a Push notification if possible."""
    try:
        from .models import Notification
        import threading

        # 1. Save to Database
        notif = Notification.objects.create(user=user, type=type, title=title, body=body, link=link)

        # 2. Trigger WS Push in a separate thread to avoid blocking the request
        def send_ws():
            try:
                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync
                channel_layer = get_channel_layer()
                if channel_layer:
                    async_to_sync(channel_layer.group_send)(
                        f"user_notifications_{user.id}",
                        {
                            "type": "send_notification",
                            "notification": {
                                "id": notif.id,
                                "type": notif.type,
                                "title": notif.title,
                                "body": notif.body,
                                "link": notif.link,
                                "is_read": notif.is_read,
                                "created_at": notif.created_at.isoformat(),
                            }
                        }
                    )
            except Exception:
                pass

        ws_thread = threading.Thread(target=send_ws)
        ws_thread.daemon = True
        ws_thread.start()

        # 3. Trigger Push (Async to avoid blocking)
        def send_push():
            try:
                from .push_service import PushService
                PushService.send_notification(user, title, body, link)
            except Exception:
                pass

        push_thread = threading.Thread(target=send_push)
        push_thread.daemon = True
        push_thread.start()

    except Exception as e:
        import logging
        logger = logging.getLogger('nitemind')
        logger.error(f"Failed to create notification for {user.email}: {e}")


def notify_streak_at_risk(user):
    """Warn user their streak is at risk (call from a scheduled task or login)."""
    from django.utils import timezone
    from datetime import timedelta
    if user.last_study_date and user.last_study_date < timezone.now().date() - timedelta(days=1):
        create_notification(
            user, 'streak',
            'Streak at Risk!',
            f'You have a {user.study_streak}-day streak. Study today to keep it going!',
            '/planner',
        )


def notify_resource_ready(user, resource_title: str, resource_id: int):
    create_notification(
        user, 'resource',
        'Resource Ready',
        f'"{resource_title}" has been processed and is study-ready.',
        f'/library/{resource_id}',
    )


def notify_deadline_approaching(user, deadline_title: str, days_left: int):
    create_notification(
        user, 'deadline',
        'Deadline Approaching',
        f'"{deadline_title}" is due in {days_left} day{"s" if days_left != 1 else ""}.',
        '/planner',
    )
