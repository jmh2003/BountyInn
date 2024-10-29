from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Task
from users.models import User
from transactions.models import Candidate
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required
import json
def index(request):
    return HttpResponse("Hello, world. You're at the tasks index.")


def add_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nickname = data.get('username')  # 从请求数据中获取nickname
            creator = User.objects.filter(nickname=nickname).first()
            if creator is None:
                return JsonResponse({'error': 'User not found'}, status=404)

            # 创建任务
            task = Task(
                task_tag=data.get('task_tag'),
                task_title=data.get('task_title'),
                task_description=data.get('task_description'),
                creator_id=creator,  # 使用 User 对象
                reward_points=data.get('reward_points'),
                deadline=data.get('deadline'),
                task_status='awaiting',
                is_reviewed=False
            )
            task.save()  # 保存任务
            return JsonResponse({'message': 'Task added successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_user_tasks(request):
    username = request.GET.get('username')  # 从请求参数中获取 username
    try:
        user = User.objects.filter(nickname=username).first()  # 根据 username 查询 User
        if user is None:
            return JsonResponse({'error': 'User not found'}, status=404)

        # 获取用户创建的任务，并关联候选人
        tasks = Task.objects.filter(creator_id=user.user_id).values(
            'task_id', 'task_tag', 'task_title', 'task_description',
            'task_status', 'reward_points', 'deadline'
        )

        task_list = []
        for task in tasks:
            # 查询尝试接取此任务的候选人
            candidates = Candidate.objects.filter(task_id=task['task_id']).values('user_id__nickname')
            candidate_nicknames = [candidate['user_id__nickname'] for candidate in candidates]

            # 添加候选人信息到任务数据中
            task['candidates'] = candidate_nicknames if candidate_nicknames else ['No candidates found']
            task_list.append(task)

        return JsonResponse(task_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['PUT'])
def change_task(request):
    task_id = request.data.get('task_id')  # 从请求体获取 task_id
    try:
        task = Task.objects.get(task_id=task_id)  # 使用 task_id 获取任务
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    # 更新任务信息
    task.task_title = request.data.get('task_title', task.task_title)
    task.task_description = request.data.get('task_description', task.task_description)
    task.reward_points = request.data.get('reward_points', task.reward_points)
    task.deadline = request.data.get('deadline', task.deadline)
    task.task_status = request.data.get('task_status', task.task_status)

    task.save()  # 保存更改
    return Response({'message': 'Task updated successfully'}, status=200)

def delete_task(request):
    if request.method == 'PATCH':  # 修改为PATCH请求
        try:
            body = json.loads(request.body)
            task_id = body.get('task_id')

            # 获取任务并修改状态
            task = Task.objects.get(task_id=task_id)
            task.task_status = 'aborted'  # 修改任务状态为 'aborted'
            task.save()

            return JsonResponse({'message': 'Task status updated to aborted'}, status=200)

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
def get_all_tasks(request):
    try:
        tasks = Task.objects.all().values(
         'task_id', 'task_tag', 'task_title', 'task_description',
        'creator_id', 'assignee_id', 'task_status', 'reward_points', 'deadline', 'is_reviewed'
         )
        task_list = list(tasks)
        return JsonResponse(task_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def change_task_info(user_id, task_id, new_task_tag, new_task_title, new_task_description, new_reward_points, new_deadline):
    try:
        task = Task.objects.get(task_id=task_id)
        if task.creator_id.user_id == user_id:  # 检查任务是否归属于当前用户
            task.task_tag = new_task_tag
            task.task_title = new_task_title
            task.task_description = new_task_description
            task.reward_points = new_reward_points
            task.deadline = new_deadline
            task.save()
            return True
        else:
            return False
    except Task.DoesNotExist:
        return False

@api_view(['GET'])
def get_user_info(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        user_data = {
            'nickname': user.nickname,
            'credit_score': user.credit_score,
            'ability_score': user.ability_score,
        }
        return Response(user_data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

def change_task_status(task_id, new_task_status):
    try:
        task = Task.objects.get(task_id=task_id)
        task.task_status = new_task_status  # 更新任务状态
        task.save()
        return True
    except Task.DoesNotExist:
        return False

def is_belong_to_user(user_id, task_id):
    try:
        task = Task.objects.get(task_id=task_id)
        return task.creator_id.user_id == user_id  # 返回是否属于当前用户
    except Task.DoesNotExist:
        return False

def check_task_is_reviewed(task_id):
    try:
        task = Task.objects.get(task_id=task_id)
        return task.is_reviewed  # 返回审核状态
    except Task.DoesNotExist:
        return False

def find_task_by_id(task_id):
    try:
        task = Task.objects.get(task_id=task_id)
        return task  # 返回任务实体
    except Task.DoesNotExist:
        return None  # 如果任务不存在，返回 None
