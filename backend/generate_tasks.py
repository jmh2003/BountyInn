import os
import random

import django
from django.utils.timezone import now, timedelta

# 设置 Django 项目的环境变量，'mysite' 应该替换为你的项目名称
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

# 初始化 Django 环境
django.setup()

# 导入模型
from tasks.models import Task
from users.models import User

# 预定义的任务标签
TASK_TAG_CHOICES = ["Learning", "Life", "Job", "Else"]

# 获取所有用户，用于随机分配创建者
users = list(User.objects.all())

# 确保有用户存在
if not users:
    print("No users found. Please create users first.")
else:
    # 要生成的任务数量
    num_tasks = 100

    for i in range(num_tasks):
        # 随机选择任务标签、奖励点数等
        task_tag = random.choice(TASK_TAG_CHOICES)
        reward_points = random.randint(5, 50)
        deadline = now() + timedelta(
            days=random.randint(1, 30)
        )  # 随机生成未来1-30天的截止日期
        creator = random.choice(users)  # 随机选择一个用户作为创建者

        # 生成随机任务标题和描述
        task_title = f"Task {i+1} - {task_tag}"
        task_description = f"This is a randomly generated task for testing purposes. Task {i+1} with tag {task_tag}."

        # 创建任务
        task = Task(
            task_tag=task_tag,
            task_title=task_title,
            task_description=task_description,
            creator_id=creator,
            task_status="awaiting",  # 固定为 'awaiting'
            reward_points=reward_points,
            deadline=deadline,
            is_reviewed=False,  # 固定为 False
        )
        task.save()

    print(
        f"{num_tasks} tasks with status 'awaiting' and is_reviewed=False have been generated successfully!"
    )
