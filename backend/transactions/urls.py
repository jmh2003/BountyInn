from django.urls import path

from . import views

urlpatterns = [
    path("transaction/", views.transaction, name="transaction"),
    path("assign_task/", views.assign_task, name="assign_task"),
    path("apply_for_task/", views.apply_for_task, name="apply_for_task"),
    path("submit_task/", views.submit_task, name="submit_task"),
    path("review_task/", views.review_task, name="review_task"),
    path("", views.transaction_form, name="transaction_form"),
    path("check_task_applied/", views.check_task_applied, name="check_task_applied"),
]
