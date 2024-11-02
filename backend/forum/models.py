from django.db import models
from users.models import User

# Create your models here.


class forum(models.Model):
    comment_id = models.AutoField(primary_key=True)
    # 下面这个关联用户的字段，是评论者的id
    comment_nickname = models.CharField(max_length=50)
    comment_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment_content
