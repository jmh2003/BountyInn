from django.db import models
from users.models import User

TASK_STATUS_CHOICES = [
    ('awaiting', 'Awaiting'),
    ('ongoing', 'Ongoing'),
    ('finished', 'Finished'),
    ('aborted', 'Aborted'),
]

TASK_TAG_CHOICES = [
    ('Learning', 'Learning'),
    ('Life', 'Life'),
    ('Job', 'Job'),
]

class Task(models.Model):


    task_id = models.AutoField(primary_key=True)
    task_tag = models.CharField(max_length=20, choices=TASK_TAG_CHOICES)
    task_title = models.CharField(max_length=200)
    task_description = models.TextField()
    creator_id = models.ForeignKey(User, related_name='created_tasks', on_delete=models.CASCADE)
    assignee_id = models.ForeignKey(User, related_name='assigned_tasks', on_delete=models.SET_NULL, null=True, blank=True)
    task_status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='awaiting')
    reward_points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    is_reviewed = models.BooleanField(default=False)

    def __str__(self):
        return self.task_title
    