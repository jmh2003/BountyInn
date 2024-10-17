

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
# 测试函数，之后删了
def add_task(request):
    if request.method == 'POST':
        task_tag = request.POST.get('task_tag')
        task_title = request.POST.get('task_title')
        task_description = request.POST.get('task_description')
        creator_id = request.POST.get('creator_id')
        reward_points = request.POST.get('reward_points')
        deadline = request.POST.get('deadline')

        try:
            # creator = User.objects.get(user_id=creator_id)
            # task = Task(
            #     task_tag=task_tag,
            #     task_title=task_title,
            #     task_description=task_description,
            #     creator_id=creator.user_id,
            #     reward_points=reward_points,
            #     deadline=deadline,
            #     assignee_id=None,
            #     task_status='awaiting',
            #     created_at=now(),
            #     is_reviewed=False
            # )
            # task.save()
            is_task_added=user_add_task(creator_id, task_tag, task_title, task_description, reward_points, deadline)
            if is_task_added:
                return JsonResponse({'message': 'Task added successfully'})
            else:
                return JsonResponse({'error': 'Creator not found'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Creator not found'}, status=404)
    return render(request, 'tasks/add_task.html')

#我们需要知道是谁创建的任务，所以需要传入creator_id
def user_add_task(curr_id, task_tag, task_title, task_description, reward_points, deadline):
    try:
        creator = User.objects.get(user_id=curr_id)
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
        return True
    except User.DoesNotExist:
        return False




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


def change_task_info(user_id,tasks_id,new_task_tag,new_task_title,new_task_description,new_reward_points,new_deadline):
    #传入用户id，检查任务是否为该用户发布的任务
    #是，则可以更改任务相关信息
    pass

def change_task_status(tasks_id,new_task_status):
    #当用户完成任务时，需要更改任务状态
    #这个是系统自动更改，没有人的输入介入，所以不需要考虑任务归属问题
    pass

def is_belong_to_user(user_id,tasks_id):
    #检查任务是否为该用户发布的任务
    #是，则返回True
    pass

def check_task_is_reviewed(task_id):
    #检查任务是否已经被审核
    #查询task_id，然后查看is_reviewed的值
    #返回true表示已经审核，返回false表示未审核
    pass

def find_task_by_id(task_id):
    #根据任务的id值，查找任务的信息
    # 返回task实体 Task(task_tag=task_tag, task_title=task_title, task_description=...)
    pass