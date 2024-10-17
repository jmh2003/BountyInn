from django.db import models
from users.models import User
from tasks.models import Task

# Create your models here.
class Candidate(models.Model):
    task_id = models.ForeignKey(Task, related_name='candidates', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, related_name='applied_tasks', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('task_id', 'user_id')

    def __str__(self):
        return f"Task: {self.task_id.task_title}, Hunter: {self.user_id.nickname}"
    
    