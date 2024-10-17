from django.shortcuts import render

# Create your views here.
# users/views.py
from django.shortcuts import render
from .models import User

# 按用户ID排序的排行榜视图函数
def leaderboard_by_id(request):
    users = User.objects.all().order_by('user_id')
    return render(request, 'leaderboard/leaderboard.html', {'users': users, 'sort_by': 'user_id'})

# 按能力值排序的排行榜视图函数
def leaderboard_by_ability(request):
    users = User.objects.all().order_by('-ability_score')
    return render(request, 'leaderboard/leaderboard.html', {'users': users, 'sort_by': 'ability_score'})