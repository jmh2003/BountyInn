import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI

from .open_ai import get_result_openai


@csrf_exempt
def get_openai_response(request):
    if request.method == "POST":
        data = json.loads(request.body)
        question = data.get("question")
        print(question)
        # 调用 OpenAI API 获取回答
        answer = get_result_openai(question)
        print(answer)
        return JsonResponse({"answer": answer})
    return JsonResponse({"error": "Invalid request method"}, status=400)
