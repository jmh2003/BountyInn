
# # forum/views.py
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import forum
# from .serializers import ForumSerializer
# from django.utils.dateparse import parse_datetime

# @api_view(['GET', 'POST'])
# def comments(request):
#     """
#     获取所有评论（GET）或发布新评论（POST）。
#     支持通过查询参数 `username`、`start_date` 和 `end_date` 过滤评论。
#     """
#     if request.method == 'GET':
#         forum_comments = forum.objects.all().order_by('created_at')  # 升序排序

#         # 获取查询参数
#         username = request.query_params.get('username', None)
#         start_date = request.query_params.get('start_date', None)
#         end_date = request.query_params.get('end_date', None)

#         # 根据查询参数过滤
#         if username:
#             forum_comments = forum_comments.filter(comment_nickname__icontains=username)
#         if start_date:
#             try:
#                 start_datetime = parse_datetime(start_date)
#                 if start_datetime:
#                     forum_comments = forum_comments.filter(created_at__gte=start_datetime)
#             except ValueError:
#                 return Response({"error": "Invalid start_date format."}, status=status.HTTP_400_BAD_REQUEST)
#         if end_date:
#             try:
#                 end_datetime = parse_datetime(end_date)
#                 if end_datetime:
#                     forum_comments = forum_comments.filter(created_at__lte=end_datetime)
#             except ValueError:
#                 return Response({"error": "Invalid end_date format."}, status=status.HTTP_400_BAD_REQUEST)

#         serializer = ForumSerializer(forum_comments, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
#     elif request.method == 'POST':
#         serializer = ForumSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# forum/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import forum
from .serializers import ForumSerializer
from django.utils.dateparse import parse_datetime
from django.db.models import Q  # 导入 Q 对象

@api_view(['GET', 'POST'])
def comments(request):
    """
    获取所有评论（GET）或发布新评论（POST）。
    支持通过查询参数 `search`、`start_date` 和 `end_date` 过滤评论。
    当 `search` 存在时，匹配 `comment_nickname` 或 `comment_content` 中包含该字符串的评论。
    """
    if request.method == 'GET':
        forum_comments = forum.objects.all().order_by('created_at')  # 升序排序

        # 获取查询参数
        search = request.query_params.get('search', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        # 根据查询参数过滤
        if search:
            forum_comments = forum_comments.filter(
                Q(comment_nickname__icontains=search) | Q(comment_content__icontains=search)
            )
        if start_date:
            try:
                start_datetime = parse_datetime(start_date)
                if start_datetime:
                    forum_comments = forum_comments.filter(created_at__gte=start_datetime)
            except ValueError:
                return Response({"error": "Invalid start_date format."}, status=status.HTTP_400_BAD_REQUEST)
        if end_date:
            try:
                end_datetime = parse_datetime(end_date)
                if end_datetime:
                    forum_comments = forum_comments.filter(created_at__lte=end_datetime)
            except ValueError:
                return Response({"error": "Invalid end_date format."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ForumSerializer(forum_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = ForumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)