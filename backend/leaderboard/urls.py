from django.urls import path

from . import views

urlpatterns = [
    path("by_id/", views.leaderboard_by_id, name="leaderboard_by_id"),
    path("by_ability/", views.leaderboard_by_ability, name="leaderboard_by_ability"),
    path(
        "get-rankings/", views.get_rankings, name="get_rankings"
    ),  # 新增获取排行榜路径
    path(
        "get-user-rank/", views.get_user_rank, name="get_user_rank"
    ),  # 新增获取个人排名路径
    path(
        "get_task_score/", views.get_task_info_by_id, name="get_task_score"
    ),  # 新增获取个人成绩路径
]

#    http://127.0.0.1:8000/leaderboard/by_id/
#    http://127.0.0.1:8000/leaderboard/by_ability/
