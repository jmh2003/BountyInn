from .models import User
# users/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.hashers import make_password , check_password
from django.views.decorators.http import require_http_methods

def register(request):
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        password = request.POST.get('password')
        user_introduction = request.POST.get('user_introduction', '')

        # 检查昵称是否已被使用
        if User.objects.filter(nickname=nickname).exists():
            return JsonResponse({'error': 'Nickname already taken'}, status=400)

        # 创建用户并保存到数据库
        password_hash = make_password(password)
        user = User(nickname=nickname, password_hash=password_hash, user_introduction=user_introduction, credit_score=10, remaining_points=50, ability_score=10)
        user.save()
        return JsonResponse({'message': 'User registered successfully'})

    return render(request, 'users/register.html')



# def login(request):
#     if request.method == 'POST':
#         nickname = request.POST.get('nickname')
#         password = request.POST.get('password')

#         try:
#             user = User.objects.get(nickname=nickname)
#             if check_password(password, user.password_hash):
#                 auth_login(request, user)
#                 return JsonResponse({'message': 'Login successful'})
#             else:
#                 return JsonResponse({'error': 'Invalid password'}, status=400)
#         except User.DoesNotExist:
#             return JsonResponse({'error': 'User not found'}, status=404)

#     return render(request, 'users/login.html')


def login(request):
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        password = request.POST.get('password')

        try:
            user = User.objects.get(nickname=nickname)
            if check_password(password, user.password_hash):
                # 手动设置用户为已登录状态
                request.session['user_id'] = user.user_id
                return JsonResponse({'message': 'Login successful'})
            else:
                return JsonResponse({'error': 'Invalid password'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return render(request, 'users/login.html')

# users/views.py
def update_user(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_introduction = request.POST.get('user_introduction', '')
        credit_score = request.POST.get('credit_score', 0)
        remaining_points = request.POST.get('remaining_points', 0)
        ability_score = request.POST.get('ability_score', 0)

        try:
            user = User.objects.get(user_id=user_id)
            user.user_introduction = user_introduction
            user.credit_score = credit_score
            user.remaining_points = remaining_points
            user.ability_score = ability_score
            user.save()
            return JsonResponse({'message': 'User updated successfully'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# def logout(request):
#     if request.method == 'POST':
#         auth_logout(request)
#         return redirect('login')  # 重定向到登录页面
#     return JsonResponse({'error': 'Invalid request method'}, status=405)

@require_http_methods(["GET", "POST"])
def logout(request):
    auth_logout(request)
    return redirect('login')  # 重定向到登录页面
#  http://127.0.0.1:8000/users/logout/
