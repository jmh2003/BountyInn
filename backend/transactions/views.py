from django.shortcuts import render

# Create your views here.
#交易函数

#根据对应的task_id，然后进行交易
def transaction(task_id):
    #查询到task_id
    #查找到对应的task_id的任务
    #查找到对应的task_id的任务的发布者和接受任务的猎人
    #将根据任务的奖励值，将奖励值从发布者的账户中减去，然后加到猎人的账户中
    
    pass

def assign_task(creator_id,task_id, hunter_id):
    #将这个任务分配给猎人
    #修改task里面的assignee_id
    #使用is_belongs_to来判断是否是发布者
    pass

def apply_for_task(hunter_id,task_id):
    #猎人申请任务

    pass

def submit_task(task_id,hunter_id):
    #猎人提交任务
    #首先需要检查,这个任务是不是归属于这个猎人，hunter_id是不是assignee_id

    pass

def review_task(task_id,creator_id):
    #发布者对任务进行审核
    #首先需要检查,这个任务是不是归属于这个发布者，creator_id是不是creator_id
    #只有属于这个发布者的任务才能进行审核
    pass


