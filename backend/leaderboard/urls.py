from django.urls import path
from . import views

urlpatterns = [
    path('by_id/', views.leaderboard_by_id, name='leaderboard_by_id'),
    path('by_ability/', views.leaderboard_by_ability, name='leaderboard_by_ability'),
]

#    http://127.0.0.1:8000/leaderboard/by_id/
#    http://127.0.0.1:8000/leaderboard/by_ability/


