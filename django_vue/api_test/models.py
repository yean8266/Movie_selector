from __future__ import unicode_literals
from django.contrib.auth.models import User
# Create your models here.

from django.db import models
class Book(models.Model):
    book_name = models.CharField(max_length=128)
    add_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.book_name



from django.db import models

class MovieData(models.Model):
    title = models.CharField(max_length=255, unique=True)
    background = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
    analysis = models.TextField(blank=True, null=True)
    scenes = models.TextField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    impact = models.TextField(blank=True, null=True)

class UserSearchRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(MovieData, on_delete=models.CASCADE)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')
