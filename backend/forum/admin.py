# Register your models here.
from django.contrib import admin

# Register your models here.
from .models import forum


class ForumAdmin(admin.ModelAdmin):
    list_display = ("comment_id", "comment_nickname", "comment_content", "created_at")


admin.site.register(forum, ForumAdmin)
