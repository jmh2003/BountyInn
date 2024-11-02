import json
import logging

from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse

# users/views.py
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from forum.models import forum

from .models import User


def register(request):
    data = json.loads(request.body)
    nickname = data.get("username")
    password = data.get("password")

    # # 检查昵称是否已被使用
    # if User.objects.filter(nickname=nickname).exists():
    #     return JsonResponse({'error': 'Nickname already taken'}, status=400)

    # # 创建用户并保存到数据库
    # password_hash = make_password(password)
    # user = User(nickname=nickname, password_hash=password_hash, user_introduction=user_introduction, credit_score=10, remaining_points=50, ability_score=10)
    # user.save()
    is_register = user_register(nickname, password)
    if is_register == False:
        print(1)
        return JsonResponse({"error": "Nickname already taken"}, status=400)

    return JsonResponse({"message": "User registered successfully"})


# 查看是否成功注册，注册成功返回true，否则返回false
def user_register(nickname, password):
    # 注意检查，当前用户的昵称是否已被使用
    user_introduction = ""
    if User.objects.filter(nickname=nickname).exists():
        return False
    password_hash = make_password(password)
    user = User(
        nickname=nickname,
        password_hash=password_hash,
        user_introduction=user_introduction,
        credit_score=10,
        remaining_points=50,
        ability_score=10,
        is_alive=True,
    )
    user.save()
    return True


logger = logging.getLogger(__name__)


def login(request):
    data = json.loads(request.body)
    nickname = data.get("username")
    password = data.get("password")
    # user = authenticate(request, username=nickname, password=password)

    try:
        user_id = user_login(nickname, password)
        if user_id:
            # auth_login(request, user)
            response = JsonResponse(
                {
                    "message": "Login successful",
                    "username": nickname,
                    "user_id": user_id,
                }
            )
            return response
        else:
            return JsonResponse({"error": "Invalid password"}, status=400)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


# 用户登录函数，检查用户昵称和密码是否匹配，登录成功就返回用户ID，否则返回None
def user_login(nick_name, password):
    try:
        user = User.objects.get(nickname=nick_name)
        # 用户已经注销，无法继续登录
        if user.is_alive == False:
            return None
        if check_password(password, user.password_hash):
            return user.user_id
        else:
            return None
    except User.DoesNotExist:
        return None


# 更新用户信息，需要输入用户密码和用户名，才能够更改
# 这个更新用户信息，需要传入某个用户的ID值，然后传入新的昵称，新的密码，新的简介
# 需要注意的是，用户在修改密码之前，需要自己输入原来的密码，然后再输入新的密码
# 而输入原来的密码就是一次登录的过程，需要在user_update这个函数的外面实现
def user_update(user_id, new_nickname, new_password, new_user_introduction):
    # 获取到该用户iD，然后更改用户信息
    if user_id:
        user = User.objects.get(user_id=user_id)
        user.user_introduction = new_user_introduction
        # user.credit_score = credit_score
        # user.remaining_points = remaining_points
        # user.ability_score = ability_score
        # 这些能力值是不能够更改的，只能够更改用户的简介
        # 个人密码，个人的简介，个人的昵称是可以更改的
        user.nickname = new_nickname
        user.password_hash = make_password(new_password)  # 重新生成密码hash值
        user.save()
        print("用户信息更新成功")
        return True
    else:
        print("用户不存在或者密码错误")
        return False


# users/views.py
def update_user(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        user_introduction = request.POST.get("user_introduction", "")
        credit_score = request.POST.get("credit_score", 0)
        remaining_points = request.POST.get("remaining_points", 0)
        ability_score = request.POST.get("ability_score", 0)

        try:
            user = User.objects.get(user_id=user_id)
            user.user_introduction = user_introduction
            user.credit_score = credit_score
            user.remaining_points = remaining_points
            user.ability_score = ability_score
            user.save()
            return JsonResponse({"message": "User updated successfully"})
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# def find_user_by_id(user_id):
#     #根据用户的id值，查找用户的信息
#     # 返回user实体 User(nickname=nickname, password_...)
#     pass


@api_view(["POST"])
def find_user_by_id(request):
    user_id = request.data.get("user_id")
    if not user_id:
        return JsonResponse({"error": "No user_id provided"}, status=400)
    try:
        user = User.objects.get(user_id=user_id)
        user_data = {
            "nickname": user.nickname,
            "credit_score": user.credit_score,
            "ability_score": user.ability_score,
        }
        return JsonResponse(user_data)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


# #这个需要提前确认好，输入用户的密码等，进行删除操作，重复确认
# def delete_user(user_id):
#     #根据用户的id值，删除用户的信息
#     #返回值是True或者False
#     pass


def delete_user(user_id):
    try:
        user = User.objects.get(user_id=user_id)
        user.is_alive = False  # 更改key值，表示用户已经注销
        return True
    except User.DoesNotExist:
        return False


# 直接注销用户，删除用户信息


# def logout(request):
#     if request.method == 'POST':
#         auth_logout(request)
#         return redirect('login')  # 重定向到登录页面
#     return JsonResponse({'error': 'Invalid request method'}, status=405)


@require_http_methods(["GET", "POST"])
def logout(request):
    auth_logout(request)
    return redirect("login")  # 重定向到登录页面


#  http://127.0.0.1:8000/users/logout/


@api_view(["POST"])
def get_user_info(request):
    username = request.data.get("username")  # 从请求中获取 username
    try:
        user = User.objects.get(nickname=username)  # 根据用户名查找用户
        print(user)
        user_data = {
            "user_id": user.user_id,
            "nickname": user.nickname,
            "user_introduction": user.user_introduction,
            "credit_score": user.credit_score,
            "remaining_points": user.remaining_points,
            "ability_score": user.ability_score,
            "is_alive": user.is_alive,
        }
        return JsonResponse({"user": user_data}, status=200)  # 返回单个用户信息
    except User.DoesNotExist:
        return JsonResponse({"error": "用户不存在"}, status=404)  # 用户不存在时返回404


@api_view(["POST"])
def update_password(request):
    username = request.data.get("username")
    new_password = request.data.get("new_password")

    if not username or not new_password:
        return JsonResponse({"error": "用户名和新密码不能为空"}, status=400)

    try:
        user = User.objects.get(nickname=username)  # 根据用户名查找用户
        # 更新密码
        user.password_hash = make_password(new_password)  # 使用 Django 的密码哈希功能
        user.save()  # 保存用户信息

        return JsonResponse({"message": "密码已成功更新"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "用户不存在"}, status=404)  # 用户不存在时返回404


@api_view(["POST"])
def update_nickname(request):
    username = request.data.get("username")
    new_nickname = request.data.get("new_nickname")

    if not username or not new_nickname:
        return JsonResponse({"error": "用户名和新昵称不能为空"}, status=400)

    try:
        user = User.objects.get(nickname=username)  # 根据用户名查找用户
        # 检查新昵称是否已被其他用户使用
        if User.objects.filter(nickname=new_nickname).exists():
            return JsonResponse({"error": "该昵称已被占用，请选择其他昵称"}, status=400)

        comment = forum.objects.filter(comment_nickname=username)
        for i in comment:
            i.comment_nickname = new_nickname
            i.save() # 更新评论者的昵称

        user.nickname = new_nickname  # 更新昵称
        user.save()  # 保存用户信息


        return JsonResponse({"message": "昵称已成功更新"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "用户不存在"}, status=404)  # 用户不存在时返回404


@api_view(["POST"])
def update_bio(request):
    username = request.data.get("username")
    new_bio = request.data.get("new_bio")

    if not username or not new_bio:
        return JsonResponse({"error": "用户名和新自我介绍不能为空"}, status=400)

    try:
        user = User.objects.get(nickname=username)  # 根据用户名查找用户
        user.user_introduction = new_bio  # 更新用户自我介绍
        user.save()  # 保存用户信息

        return JsonResponse({"message": "自我介绍已成功更新"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "用户不存在"}, status=404)  # 用户不存在时返回404
