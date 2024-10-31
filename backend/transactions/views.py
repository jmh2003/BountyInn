import json
from django.shortcuts import render
from transactions.models import Task, Candidate
from users.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render



def transaction_form(request):
    return render(request, 'transactions/transaction_form.html')

# 交易函数，基于 task_id 进行交易
# review的时候调用，简答地修改积分
@csrf_exempt
def transaction(request):
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        if not task_id:
            return JsonResponse({'error': 'Task ID is required'}, status=400)
        try:
            task = Task.objects.get(task_id=task_id)
            creator = task.creator_id
            hunter = task.assignee_id

            # 检查发布者是否有足够的剩余点数进行交易
            if creator.remaining_points < task.reward_points:
                return JsonResponse({'error': 'Insufficient points for the transaction'}, status=400)

            # 减去发布者的奖励值
            creator.remaining_points -= task.reward_points
            creator.save()

            # 将奖励值加到猎人的账户中
            hunter.remaining_points += task.reward_points
            hunter.save()

            return JsonResponse({'message': 'Transaction successful'})

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


# 分配任务，猎人从候选者中选择一个进行任务分配
@csrf_exempt
def assign_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            creator_id = data.get('creator_id')
            task_id = data.get('task_id')
            hunter_name = data.get('hunter_name')
            task = Task.objects.get(task_id=task_id)
            
            if task.task_status != 'awaiting':
                return JsonResponse({'error': 'Task is already assigned or not available'}, status=400)

            if task.creator_id.user_id == int(creator_id):
                task.assignee_id = User.objects.get(nickname=hunter_name)
                task.task_status = 'ongoing'
                task.save()
                return JsonResponse({'message': 'Task assigned successfully'})
            else:
                return JsonResponse({'error': 'You are not the creator of this task'}, status=403)

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Hunter does not exist'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


# 申请任务，猎人进行任务申请
@csrf_exempt
def apply_for_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        hunter_id = data.get('hunter_id')
        task_id = data.get('task_id')
        
        if not hunter_id or not task_id:
            return JsonResponse({'error': 'Hunter ID and Task ID are required'}, status=400)

        try:
            task = Task.objects.get(task_id=task_id)

            # 检查任务是否是 "awaiting" 状态
            if task.task_status != 'awaiting':
                return JsonResponse({'error': 'Task is not available for application'}, status=400)

            # 检查是否已申请
            if Candidate.objects.filter(task_id=task, user_id=hunter_id).exists():
                return JsonResponse({'error': 'You have already applied for this task'}, status=400)

            candidate = Candidate.objects.create(task_id=task, user_id=User.objects.get(user_id=hunter_id))
            return JsonResponse({'message': 'Task applied successfully'})

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Hunter does not exist'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


# 猎人提交任务，猎人完成任务后，提交对应的任务
@csrf_exempt
def submit_task(request):
    if request.method == 'POST':
        hunter_id = request.POST.get('hunter_id')
        task_id = request.POST.get('task_id')
        
        if not hunter_id or not task_id:
            return JsonResponse({'error': 'Hunter ID and Task ID are required'}, status=400)

        try:
            task = Task.objects.get(task_id=task_id)
            if task.assignee_id.user_id == int(hunter_id):
                task.task_status = 'finshed'
                task.save()
                return JsonResponse({'message': 'Task submitted successfully'})
            else:
                return JsonResponse({'error': 'You are not the assignee of this task'}, status=403)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# 审核任务
@csrf_exempt
def review_task(request):
    if request.method == 'POST':
        creator_id = request.POST.get('creator_id')
        task_id = request.POST.get('task_id')

        if not creator_id or not task_id:
            return JsonResponse({'error': 'Creator ID and Task ID are required'}, status=400)

        try:
            task = Task.objects.get(task_id=task_id)
            if task.creator_id.user_id == int(creator_id):
                task.is_reviewed = True
                task.save()
                return JsonResponse({'message': 'Task reviewed successfully'})
            else:
                return JsonResponse({'error': 'You are not the creator of this task'}, status=403)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def check_task_applied(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        hunter_id = data.get('hunter_id')
        task_id = data.get('task_id')
        
        if not hunter_id or not task_id:
            return JsonResponse({'error': 'Hunter ID and Task ID are required'}, status=400)

        try:
            task = Task.objects.get(task_id=task_id)

            # 检查是否已申请
            if Candidate.objects.filter(task_id=task, user_id=hunter_id).exists():
                # print(task, hunter_id)
                return JsonResponse({'applied': True})
            else:
                return JsonResponse({'applied': False})

        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task does not exist'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Hunter does not exist'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

