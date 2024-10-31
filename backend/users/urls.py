from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('update_user/', views.update_user, name='update_user'),
    path('logout/', views.logout, name='logout'),
    path('get_user_info/', views.get_user_info, name='get_user_info'),
    path('update_password/', views.update_password, name='update_password'),
    path('update_nickname/', views.update_nickname, name='update_nickname'),
    path('find_user/', views.find_user_by_id, name='find_user_by_id'),
]
