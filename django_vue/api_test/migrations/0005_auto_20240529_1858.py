# Generated by Django 3.2 on 2024-05-29 10:58

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api_test', '0004_usersearchrecord'),
    ]

    operations = [
        # migrations.RemoveField(
        #     model_name='moviedata',
        #     name='created_at',
        # ),
        migrations.AlterUniqueTogether(
            name='usersearchrecord',
            unique_together={('user', 'movie')},
        ),
    ]
