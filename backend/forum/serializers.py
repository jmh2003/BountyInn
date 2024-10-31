# forum/serializers.py
from rest_framework import serializers
from .models import forum

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = forum
        fields = ['comment_id', 'comment_nickname', 'comment_content', 'created_at']