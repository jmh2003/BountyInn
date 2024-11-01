from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Task
from users.models import User
from leaderboard.models import Score
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

            task_tag = data.get('task_tag')
            print(f"Received task_tag: {task_tag}")

            if creator.remaining_points < data.get('reward_points'):
                return JsonResponse({'error': 'Insufficient points'}, status=400)
            
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
            # print(task.task_tag)
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
            # task['candidates'] = candidate_nicknames if candidate_nicknames else ['No candidates found']
            task['candidates'] = candidate_nicknames
            task_list.append(task)

        return JsonResponse(task_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_assignee_tasks(request):
    username = request.GET.get('username')  # 从请求参数中获取 username
    try:
        user = User.objects.filter(nickname=username).first()  # 根据 username 查询 User
        if user is None:
            return JsonResponse({'error': 'User not found'}, status=404)

        # 获取用户接取的任务 厉害！
        tasks = Task.objects.filter(assignee_id=user.user_id).values(
            'task_id', 'task_tag', 'task_title', 'task_description',
            'task_status', 'reward_points', 'deadline', 'is_reviewed', 'task_outcome'
        )

        task_list = []
        for task in tasks:
            task_list.append(task)

        return JsonResponse(task_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_review_tasks(request):
    username = request.GET.get('username')  # 从请求参数中获取 username
    try:
        user = User.objects.filter(nickname=username).first()  # 根据 username 查询 User
        if user is None:
            return JsonResponse({'error': 'User not found'}, status=404)

        # 获取用户接取的任务 厉害！
        tasks = Task.objects.filter( creator_id=user.user_id,
                task_status='finished',
                ).values(
            'task_id', 'task_tag', 'task_title', 'task_description',
            'task_status', 'reward_points', 'deadline', 'is_reviewed', 'task_outcome'
        )


        task_list = []
        for task in tasks:
            task_list.append(task)

        return JsonResponse(task_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# @api_view(['PUT'])
# def submit_task_outcome(request):
#     task_id = request.data.get('task_id')  # 从请求体获取 task_id
#     try:
#         task = Task.objects.get(task_id=task_id)  # 使用 task_id 获取任务
#     except Task.DoesNotExist:
#         return Response({'error': 'Task not found'}, status=404)

#     task.task_outcome = request.data.get('task_outcome', task.task_outcome)
#         # 更新任务信息
#     if task.task_outcome==None:
#         return Response({'error': 'Task outcome is None'}, status=404)
#     task.task_status= 'finished'
#     task.save()  # 保存更改
#     return Response({'message': 'Task updated successfully'}, status=200)


@api_view(['PUT'])
def submit_task_outcome(request):
    task_id = request.data.get('task_id')
    task_outcome = request.data.get('task_outcome')

    if not task_outcome or task_outcome.strip() == '':
        return Response({'error': 'Task outcome cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        task = Task.objects.get(pk=task_id)
        task.task_outcome = task_outcome
        task.task_status = 'finished'
        task.save()
        return Response({'message': 'Task outcome updated successfully'}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
    task.task_tag = request.data.get('task_tag',task.task_tag) # 更新任务标签

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

            Candidate.objects.filter(task_id=task_id).delete()  # 删除所有候选人

            return JsonResponse({'message': 'Task status updated to aborted and related candidate data deleted'}, status=200)

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


import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def submit_review(request):
    print("hhh")
    print(request.data)

    task_id = request.data.get('task_id')
    # reviewee_id = request.data.get('reviewee_id')
    # reviewer_id = request.data.get('reviewer_id')
    task = Task.objects.get(task_id=task_id)
    reviewee_id = task.assignee_id
    reviewer_id = task.creator_id
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    logger.debug(f"Received submit_review data: task_id={task_id}, reviewee_id={reviewee_id}, reviewer_id={reviewer_id}, rating={rating}, comment={comment}")

    if not all([task_id, reviewee_id, reviewer_id, rating, comment.strip()]):
        return Response({'error': '所有字段都是必填的。'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        print("before create")
        score = Score.objects.create(
            task_id=task,
            reviewee_id=reviewee_id,
            reviewer_id=reviewer_id,
            rating=int(rating),
            comment=comment.strip(),
            is_finished=True
        )
        print("after create")
        score.save()
        task.is_reviewed = True
        task.save()

        # 减去发布者的奖励值
         # filter
        print("before get creator money")
        creator =task.creator_id

        # creator = User.objects.get(user_id=task.creator_id)
        creator.remaining_points -= task.reward_points
        creator.save()
        print("after get")
        # 将奖励值加到猎人的账户中
        hunter=task.assignee_id
        #hunter = User.objects.get(user_id=task.assignee_id)
        hunter.remaining_points += task.reward_points
        hunter.ability_score+=task.reward_points*rating
        #更新算法，计算能力值，参考为能力值=能力值+奖励值*评分
        hunter.credit_score+=rating-1
        #如果是0分的话，信用将会减少
        hunter.save()
        print("hhhjiehsule")

        return Response({'message': '评价提交成功。'}, status=status.HTTP_201_CREATED)
    except Task.DoesNotExist:
        return Response({'error': '任务未找到。'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': '用户未找到。'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error submitting review: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)