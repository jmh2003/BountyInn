from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path('add_task/', views.add_task, name='add_task'),
    path('delete_task/', views.delete_task, name='delete_task'),
]