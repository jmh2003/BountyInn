from django.shortcuts import render
# Create your views here.
# users/views.py
from django.shortcuts import render
from .models import User,Score
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import User

from .models import Score  # 假设你有一个存储排行榜条目的模型
from django.db.models import F
from rest_framework import status

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


@api_view(['POST'])
def get_rankings(request):
    """
    获取排行榜数据，根据指定的排名种类（剩余积分、能力分数、信用分数）排序并返回。
    """
    rank_type = request.data.get('rankType')
    if rank_type not in ['剩余积分', '能力分数', '信用分数']:
        return Response({"error": "无效的排名种类"}, status=status.HTTP_400_BAD_REQUEST)

    # 根据不同的排名种类选择排序字段
    if rank_type == '剩余积分':
        order_field = '-remaining_points'
    elif rank_type == '能力分数':
        order_field = '-ability_score'
    elif rank_type == '信用分数':
        order_field = '-credit_score'

    # 查询用户信息并按指定字段排序
    users = User.objects.all().order_by(order_field)[:100]  # 取前100名用户
    rankings = [
        {
            "user_id": user.user_id,
            "name": user.nickname,
            # "score": getattr(user, order_field.lstrip('-')),
            "ability_score": user.ability_score,
            "credit_score": user.credit_score,
            "remaining_points": user.remaining_points,
        }
        for user in users
    ]

    return Response({"rankings": rankings}, status=status.HTTP_200_OK)


@api_view(['POST'])
def get_user_rank(request):
    """
    获取用户个人排名，根据用户名和指定的排名种类返回用户的排名。
    """
    rank_type = request.data.get('rankType')
    username = request.data.get('username')
    print(username)
    if not username or rank_type not in ['剩余积分', '能力分数', '信用分数']:
        return Response({"error": "参数无效"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(nickname=username)
    except User.DoesNotExist:
        return Response({"error": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

    # 根据排名种类确定排序字段
    if rank_type == '剩余积分':
        order_field = '-remaining_points'
    elif rank_type == '能力分数':
        order_field = '-ability_score'
    elif rank_type == '信用分数':
        order_field = '-credit_score'

    # 获取所有用户的指定分数排序列表，并计算该用户的排名
    users = User.objects.all().order_by(order_field)
    rank = list(users).index(user) + 1  # 排名从1开始

    return Response({"userRank": {"nickname":user.nickname,"rank": rank, "score": getattr(user, order_field.lstrip('-')),"user_introduction":user.user_introduction}},
                    status=status.HTTP_200_OK)

@api_view(['POST'])
def get_task_info_by_id(request):
    """
    根据任务ID获取任务对应的comment、rating、review_at等信息。
    """
    task_id = request.data.get('task_id')

    if not task_id:
        return Response({
            'error': '任务ID不能为空'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        score = Score.objects.get(task_id=task_id)

        response_data = {
            'task_id': task_id,
            'rating': score.rating,
            'comment': score.comment,
            'review_at': score.review_at,
            'reviewer': score.reviewer_id.nickname,
            'reviewee': score.reviewee_id.nickname,
            'is_finished': score.is_finished
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Score.DoesNotExist:
        return Response({
            'error': '任务ID不存在'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'发生错误：{str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

