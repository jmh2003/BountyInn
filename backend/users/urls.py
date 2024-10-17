from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('update_user/', views.update_user, name='update_user'),
    path('logout/', views.logout, name='logout'),
]