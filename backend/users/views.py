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

        # # 检查昵称是否已被使用
        # if User.objects.filter(nickname=nickname).exists():
        #     return JsonResponse({'error': 'Nickname already taken'}, status=400)

        # # 创建用户并保存到数据库
        # password_hash = make_password(password)
        # user = User(nickname=nickname, password_hash=password_hash, user_introduction=user_introduction, credit_score=10, remaining_points=50, ability_score=10)
        # user.save()
        is_register = user_register(nickname, password, user_introduction)
        if is_register == False:
            return JsonResponse({'error': 'Nickname already taken'}, status=400)

        return JsonResponse({'message': 'User registered successfully'})

    return render(request, 'users/register.html')


#查看是否成功注册，注册成功返回true，否则返回false
def user_register(nickname, password, user_introduction):
    #注意检查，当前用户的昵称是否已被使用
    if User.objects.filter(nickname=nickname).exists():
        return False
    password_hash = make_password(password)
    user = User(nickname=nickname, password_hash=password_hash, user_introduction=user_introduction, credit_score=10, remaining_points=50, ability_score=10)
    user.save()
    return True



def login(request):
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        password = request.POST.get('password')

        try:
            user_id = user_login(nickname, password)
            if user_id:
                return JsonResponse({'message': 'Login successful'})    
            else:
                return JsonResponse({'error': 'Invalid password'}, status=400)
            
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return render(request, 'users/login.html')

# 用户登录函数，检查用户昵称和密码是否匹配，登录成功就返回用户ID，否则返回None
def user_login(nick_name, password):
    try:
        user = User.objects.get(nickname=nick_name)
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
def user_update(user_id,new_nickname,new_password,new_user_introduction):
    #获取到该用户iD，然后更改用户信息
    if user_id:
        user = User.objects.get(user_id=user_id)
        user.user_introduction = new_user_introduction
        # user.credit_score = credit_score
        # user.remaining_points = remaining_points
        # user.ability_score = ability_score
        #这些能力值是不能够更改的，只能够更改用户的简介
        #个人密码，个人的简介，个人的昵称是可以更改的
        user.nickname = new_nickname
        user.password_hash = make_password(new_password)#重新生成密码hash值
        user.save()
        print("用户信息更新成功")
        return True
    else:
        print("用户不存在或者密码错误")
        return False



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



def find_user_by_id(user_id):
    #根据用户的id值，查找用户的信息
    # 返回user实体 User(nickname=nickname, password_...)
    pass

#这个需要提前确认好，输入用户的密码等，进行删除操作，重复确认
def delete_user(user_id):
    #根据用户的id值，删除用户的信息
    #返回值是True或者False
    pass


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