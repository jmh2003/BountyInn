from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Task
from users.models import User
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


# def user_add_task(curr_id, task_tag, task_title, task_description, reward_points, deadline):
#     try:
#         # 假设这里有逻辑来根据curr_id查找用户
#         creator = User.objects.get(user_id=curr_id)
#         task = Task(
#             task_tag=task_tag,
#             task_title=task_title,
#             task_description=task_description,
#             creator=creator,  # 使用User对象而非user_id
#             reward_points=reward_points,
#             deadline=deadline,
#             assignee_id=None,
#             task_status='awaiting',
#             created_at=now(),
#             is_reviewed=False
#         )
#         task.save()
#         return True
#     except User.DoesNotExist:
#         return False
def get_user_tasks(request):
        username = request.GET.get('username')  # 从请求参数中获取 username
        try:
            user = User.objects.filter(nickname=username).first()  # 根据 username 查询 User
            if user is None:
                return JsonResponse({'error': 'User not found'}, status=404)

            tasks = Task.objects.filter(creator_id=user.user_id).values(
                'task_id', 'task_tag', 'task_title', 'task_description',
                'task_status', 'reward_points', 'deadline'
            )
            task_list = list(tasks)
            return JsonResponse(task_list, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


#需要确认当前任务是否归属于当前用户
def user_delete_task(curr_id, task_id):
    try:
        task = Task.objects.get(task_id=task_id)
        if task.creator_id == curr_id:
            task.delete()
            return True
        else:
            return False
    except Task.DoesNotExist:
        return False


# http://127.0.0.1:8000/tasks/delete_task/
def delete_task(request):
    #注意检查这里的task，归属的发布者是否是当前用户
    #自己不能删除别人发布的任务
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        curr_id = request.POST.get('curr_id')

        try:
            is_task_deleted=user_delete_task(curr_id, task_id)
            if is_task_deleted:
                return JsonResponse({'message': 'Task deleted successfully'})
            else:
                return JsonResponse({'error': 'Task not found'}, status=404)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
        
    return render(request, 'tasks/delete_task.html')

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
