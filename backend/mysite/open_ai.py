# from openai import OpenAI
# import httpx

# client = OpenAI(
#     base_url="https://api.xty.app/v1", 
#     api_key="sk-*****",
#     http_client=httpx.Client(
#         base_url="https://api.xty.app/v1",
#         follow_redirects=True,
#     ),
# )

# def get_result_openai(question, knowledge=None):
    
#     completion = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant.You will give answers to questions based on the facts given and your own knowledge."},
#             {"role": "user", "content": f"Question: {question}?  Please answer in the same language as question: {question}"}
#         ]
#         )
#     return completion.choices[0].message.content

# if __name__ == "__main__":
#     question = "What is the capital of USA?"
#     knowledge = "The capital of USA is Washington D.C."

#     print(get_result_openai(question, knowledge))



####################################################3
from openai import OpenAI

#这个起始是kimi的API key
# 用你的API密钥替换这里的"sk-*********"
client = OpenAI(
    api_key="sk-NWMrZrdsn6YaPTg6yIjmh4GOp8hh74pZ4vs4HHwH8bg7wcVx",
    base_url="https://api.moonshot.cn/v1",
)


def get_result_openai(question, knowledge=None):
    
    # 调用Chat Completions API
    completion = client.chat.completions.create(
        model="moonshot-v1-8k",  # 选择模型
        messages=[
            {"role": "system", "content": "You are a helpful assistant.You will give answers to questions based on the facts given and your own knowledge."},
            {"role": "user", "content": f"Question: {question}?  Please answer in the same language as question: {question}"}
        ],
        temperature=0.3,  # 控制回答的创造性
    )

    return completion.choices[0].message.content

if __name__ == "__main__":
    question = "What is the capital of USA?"
    knowledge = "The capital of USA is Washington D.C."

    print(get_result_openai(question, knowledge))

