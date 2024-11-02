from django.db import models
from tasks.models import Task
from users.models import User


# Create your models here.
class Score(models.Model):
    scores_id = models.AutoField(primary_key=True)
    reviewee_id = models.ForeignKey(
        User, related_name="received_reviews", on_delete=models.CASCADE
    )
    reviewer_id = models.ForeignKey(
        User, related_name="given_reviews", on_delete=models.CASCADE
    )
    task_id = models.ForeignKey(
        Task, related_name="task_reviews", on_delete=models.CASCADE
    )
    rating = models.IntegerField()
    comment = models.TextField()
    review_at = models.DateTimeField(auto_now_add=True)
    is_finished = models.BooleanField()

    def __str__(self):
        return f"Review for {self.reviewee_id.nickname} by {self.reviewer_id.nickname} on Task: {self.task_id.task_title}"
