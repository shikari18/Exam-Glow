"""
Migration: Add ExamGlow-specific profile fields to the User model.
These fields come from yuna's user_profiles table and map to the Django user.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_user_total_resources_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='school',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='user',
            name='year_group',
            field=models.CharField(blank=True, max_length=50, help_text='e.g. Year 11, Grade 10'),
        ),
        migrations.AddField(
            model_name='user',
            name='study_goal',
            field=models.TextField(blank=True, help_text='User\'s personal study goal'),
        ),
        migrations.AddField(
            model_name='user',
            name='course',
            field=models.CharField(blank=True, max_length=100, default='Cambridge IGCSE'),
        ),
        migrations.AddField(
            model_name='user',
            name='subjects',
            field=models.JSONField(
                default=list,
                blank=True,
                help_text='List of subjects the user is studying',
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='updates_opt_in',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='longest_streak',
            field=models.IntegerField(default=0),
        ),
    ]
