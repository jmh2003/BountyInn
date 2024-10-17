

# tasks/views.py
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Task
from users.models import User
from django.utils.timezone import now

def index(request):
    return HttpResponse("Hello, world. You're at the tasks index.")


# http://127.0.0.1:8000/tasks/add_task/
def add_task(request):
    if request.method == 'POST':
        task_tag = request.POST.get('task_tag')
        task_title = request.POST.get('task_title')
        task_description = request.POST.get('task_description')
        creator_id = request.POST.get('creator_id')
        reward_points = request.POST.get('reward_points')
        deadline = request.POST.get('deadline')

        try:
            creator = User.objects.get(user_id=creator_id)
            task = Task(
                task_tag=task_tag,
                task_title=task_title,
                task_description=task_description,
                creator_id=creator.user_id,
                reward_points=reward_points,
                deadline=deadline,
                assignee_id=None,
                task_status='awaiting',
                created_at=now(),
                is_reviewed=False
            )
            task.save()
            return JsonResponse({'message': 'Task added successfully'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Creator not found'}, status=404)
    return render(request, 'tasks/add_task.html')

# http://127.0.0.1:8000/tasks/delete_task/
def delete_task(request):
    #注意检查这里的task，归属的发布者是否是当前用户
    #自己不能删除别人发布的任务
    if request.method == 'POST':
        task_id = request.POST.get('task_id')

        try:
            task = Task.objects.get(task_id=task_id)
            task.delete()
            return JsonResponse({'message': 'Task deleted successfully'})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)

    return render(request, 'tasks/delete_task.html')

