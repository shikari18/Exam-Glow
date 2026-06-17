from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payments'

    def ready(self):
        """Register django-q scheduled tasks after migrations via post_migrate signal."""
        from django.db.models.signals import post_migrate
        post_migrate.connect(self._create_schedules, sender=self)

    def _create_schedules(self, sender, **kwargs):
        """Create django-q scheduled tasks if they don't exist yet."""
        try:
            from django_q.models import Schedule

            task_name = 'Premium Expiry Reminders'
            if not Schedule.objects.filter(name=task_name).exists():
                Schedule.objects.create(
                    name=task_name,
                    func='payments.views.send_expiry_reminders',
                    schedule_type=Schedule.HOURLY,
                    repeats=-1,
                )
        except Exception:
            # django-q may not be migrated yet — safe to skip
            pass
