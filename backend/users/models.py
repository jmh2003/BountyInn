
# Create your models here.
from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    nickname = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=256)
    user_introduction = models.TextField()
    credit_score = models.IntegerField(default=0)
    remaining_points = models.IntegerField(default=0)
    ability_score = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname
    
