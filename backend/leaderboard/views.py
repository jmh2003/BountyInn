from django.shortcuts import render

# Create your views here.
# users/views.py
from django.shortcuts import render
from .models import User,Score


# 按用户ID排序的排行榜视图函数
def leaderboard_by_id(request):
    users = User.objects.all().order_by('user_id')
    return render(request, 'leaderboard/leaderboard.html', {'users': users, 'sort_by': 'user_id'})

# 按能力值排序的排行榜视图函数
def leaderboard_by_ability(request):
    users = User.objects.all().order_by('-ability_score')
    return render(request, 'leaderboard/leaderboard.html', {'users': users, 'sort_by': 'ability_score'})

#is_descending是一个布尔值，如果是True，那么就是降序，如果是False，那么就是升序

#查询score表格，按照用户ID排序,确定好是升序还是降序
def sort_by_id(User,is_descending=False):
    #这个返回用户的id nickname credit_score  ability_score 
    # [('1', 'user1', 100, 100), ('2', 'user2', 100, 100)]
    #返回元组的列表
    pass

def sort_by_ability(User,is_descending=True):
    #根据用户的能力值进行排序
    #这个返回用户的id nickname credit_score  ability_score 
    # [('1', 'user1', 100, 100), ('2', 'user2', 100, 100)]
    #返回元组的列表
    pass


#更新用户的成绩，获取最新的排名
def update_score(User,Score):
    #更新用户的成绩
    #根据最新的成绩单，统计每个用户的成绩，
    #设计好算法，更新用户的成绩信息，记录在user表格中
    #更新用户的 credit_score  ability_score 
    #无返回值
    pass

