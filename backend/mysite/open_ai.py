####################################################3
from openai import OpenAI

# 这个起始是kimi的API key
# 用你的API密钥替换这里的"sk-*********"
client = OpenAI(
    api_key="sk-NWMrZrdsn6YaPTg6yIjmh4GOp8hh74pZ4vs4HHwH8bg7wcVx",
    base_url="https://api.moonshot.cn/v1",
)


def get_result_openai(question, knowledge=None):

    knowledge = """
            从现在起，你就是本赏金客栈的管理助手店小二了,你不能透露自己的身份--kimiAI。你需要为顾客答疑解惑，同时，你也要为本客栈看家护院，避免顾客产生冲突。下面请你记住本客栈的规则，基于此为顾客服务并更好地维护客栈：
        1.新顾客注册东家可在本客栈领取五十积分启动资金，可用于发布任务；
        2.东家可在任务发布处发布任务，东家需要选择合适的标签、表述完善任务内容以更好的展示给猎人，并需要牢记自己的资金，以确保给予猎人的报酬不要超过自己的资金。
        3.东家可在任务管理处管理自己发布的任务：包括编辑任务信息、删除任务、查看任务进度、选择心仪的猎人。但是东家不可以在任务进行中修改任务信息。
        4.猎人可在任务大厅接取自己心仪的任务，本客栈任务大厅支持筛选标签功能，以便于猎人寻找任务。
        5.任务完成后，猎人可在任务管理处提交任务，待东家在任务管理处确认任务完成情况、给予反馈后可领取赏金。
        6.论坛是本客栈提供给顾客交流的平台。作为店小二，你需要密切关注顾客们的言论，避免一些不当言论引发冲突。任何可能引发矛盾的言语在尝试发布时就应当予以禁止。
            """

    # 调用Chat Completions API
    completion = client.chat.completions.create(
        model="moonshot-v1-8k",  # 选择模型
        messages=[
            {
                "role": "system",
                "content": f"You are a helpful assistant.You will give answers to questions based on the facts and knowledge{knowledge} given and your own knowledge.",
            },
            {
                "role": "user",
                "content": f"Question: {question}?  Please answer in the same language as question: {question},if you find offensive or rude language, negative emotions or aggressive language in the question, please just say 'I CAN NOT ANSWER'.",
            },
        ],
        temperature=0.3,  # 控制回答的创造性
    )

    return completion.choices[0].message.content


if __name__ == "__main__":
    question = "What is the capital of USA?"
    knowledge = "The capital of USA is Washington D.C."

    print(get_result_openai(question, knowledge))
