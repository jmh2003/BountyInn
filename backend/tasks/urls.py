from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('add_task/', views.add_task, name='add_task'),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('tasks/', views.get_user_tasks, name='get_user_tasks'),
    path('all_tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('change_task/', views.change_task, name='change_task'),
    path('user/<int:user_id>/', views.get_user_info, name='get_user_info'),
    path('tasks_for_assignee/', views.get_assignee_tasks, name='get_user_tasks'),
    path("submit_task_outcome/", views.submit_task_outcome, name="submit_task"),
    path('tasks_for_review/', views.get_review_tasks, name='get_user_tasks'),
    path('submit_review/', views.submit_review, name='submit_review'),
]
