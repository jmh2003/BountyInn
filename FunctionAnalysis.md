# 数据库

### 用户 user_table

用户表：用户既可以作为顾客发布任务，也可以作为猎人接受任务

- **用户	user_id**     (key 唯一)
- 用户昵称 nickname	
- 用户密码哈希值 password_hash 
- 用户自我陈述 str字符串 user_introduction （个人主页自我介绍，字符串
- 用户信用值 credit_score （用户信誉度，衡量猎人是否违约等，可以用来构建猎人排行榜
- 用户剩余积分 remaining_points （相当于用户的金币数
- 用户能力值 ability_score （用户作为猎人的办事能力，可以用来构建猎人排行榜

### 任务信息表 task_table

描述任务的具体信息

- **任务 task_id （**key 唯一)
- 任务标签 task_tag   （这个是任务的类别，一个任务归属于一个类别）
- 任务标题  task_title (任务标题 可以显示到任务大厅内)
- 任务描述 task_description (任务描述,描述任务具体是什么，str字符串
- 任务发布者id    creator_id (外键，关联Users表，任务发布者)\
- 任务完成者id    assignee_id (外键，关联Users表，任务完成者，可为空)
- 任务状态  task_status (任务状态：待接受 awaiting、进行中ongoing、已完成finished、已取消aborted  )
- 任务的价值、奖励  reward_points (奖励积分)
- 任务创建时间  created_at (创建时间，可以根据创建的时间，来排序，例如将最新的任务放在任务大厅的最前面
- 任务截止时间  deadline (截止时间，用户设定截止时间，如果在截止时间之前，没有猎人接受并完成任务，任务状态设置为取消)
- 是否经过评价 is_reviewed 任务完成之后，记录用户是否评价了猎人

### 猎人候选表      多对多  candidate_table

任务处于待接收状态时候：猎人申请接收任务时候，需要找出目标任务，将目标任务id task_id和猎人 user_id 存入这个候选表，用户和猎人双方能够看到任务的状态为待接受  awaiting

任务正式分配给某个猎人后：需要将对应任务的task_id和user_id对应记录从候选表内移除，并通知这个task对应的猎人，是否接受到了这个任务 

只要是

用于表示各个任务发布之后，想要接收该任务的猎人信息

- 任务id task_id
- 猎人id user_id 

这个关系是多对多，一个猎人可以竞争并接收多个任务，一个任务也可以有多个猎人竞争

### 猎人成绩表 scores_table

这个表格记录猎人的接收任务，完成任务的情况

猎人完成任务之后，会由用户填写表单，记录在这个成绩表中，比如对猎人的评分，如果猎人无法在规定时间内完成任务，则可以不必用户评分，系统自动给最低分。

- **成绩表记录id scores_id** (key 键值唯一)
- 猎人id  reviewee_id (外键，关联Users表，被评价者)
- 评价者id(发布者id)  reviewer_id (外键，关联Users表)
- 任务id task_id 
- 反馈评分 rating 
- 用户评价 comment (评价内容 str)
- 评价时间  rewiew_at  
- 是否完成 任务是否在规定时间内完成 is_finished   true or false

可以根据猎人的完成的任务和数量来衡量用户的信誉度

# 赏金客栈函数接口设计

### 登录界面

注册界面 暂时不考虑找回用户密码

- 注册函数：输入用户用户名nickname 和密码password，输入自我陈述 user_introduction ，注册后分配唯一的user_id，将password进行hash，得到 password_hash  。初始化用户的remaining_points = 100  credit_score =0 ability_score = 0 （没有承接任务，算作没有信用，没有能力值），将这些属性存入到数据库  user_table。   user_table每一条记录包括：user_id nickname password_hash   user_introduction credit_score   remaining_points ability_score 
- 登录函数：登录函数需要输入，昵称 nickname 和密码password 查询数据库，返回user_id ，没查询到user_id就返回空NULL。

### 主界面 菜单 

这个界面是通向各个界面的桥梁

- 加载用户函数：传入登录函数返回的user_id，查询数据库user_table 加载用户的信息，比如nickname等等，实例化对象。
- 显示任务函数：根据一定的算法，查询数据库task_table里面待接受awaiting的任务task，比如随机显示，显示最新发布的任务等等

### 发布任务

用户发布任务

- 发布任务函数：传入发布者的user_id、 task_tag、task_title、task_description、deadline、reward_points 。实例化task， creator_id=  user_id，assignee_id=-1， task_status = awaiting，created_at=当前时间，自动生成task_id，is_reviewed =false。存入到数据库 task_table

猎人接收任务

- 竞争任务函数：传入猎人想要争取的任务的task_id、猎人的user_id，存入到猎人候选表  candidate_table

### 指定任务

- 查询猎人信息函数：传入猎人的user_id，查询数据库user_table和scores_table，返回目标猎人的信息。
- 选择目标猎人：传入创建者的user_id，任务的task_id，核实用户身份，只有task归属于此用户才能选择目标猎人，传入猎人user_id，查询任务表，更改task_table里面的task_id对应的任务状态  task_status 为 ongoing，将task_id对应的任务从candidate_table里面删除，assignee_id 任务分配者更改为 猎人的user_id。

### 完成任务

- 猎人提交任务成果 函数：传入猎人的user_id，传入task_id，核实此任务是否是归属于该猎人完成（查询表格task_table里面的assignee_id。如果是，则修改任务状态task_status为finished.
- 评价猎人函数：传入user_id，查询此用户的任务中，task_status=finished且 is_reviewed =false的任务，以及对应的   assignee_id 。对于每一个任务，输入反馈评分 rating  用户评价 comment (评价内容 str) is_finished  （需要用户进一步核实是否真正完成了任务）。根据这些生成 （reviewee_id   reviewer_id  task_id  rating  comment rewiew_at    is_finished  ）记录，存入 scores_table。将对应的任务的 is_reviewed 改为 true  .调用交易函数
- 交易函数：传入  reviewee_id  和 reviewer_id ，以及对应的task_id。查询任务task_id对应的 reward_points ，更新   reviewee_id  和 reviewer_id 这两者对应的 remaining_points。同时，通过一定的算法，计算更新 credit_score   ability_score。简单来想：如果猎人完成了任务， credit_score +1，没有完成credit_score-1.  ability_score+= rating $\times$​ reward_points

### 排行榜

加载user_table，根据 ability_score 对猎人的能力进行排序。

### 任务大厅

读取  任务信息表 task_table

通过不同的排序方式，对awaiting状态的任务进行排序，显示。

awaiting状态指的是，用户已经发布，但是任务没有猎人接收。



 # 函数接口

# 赏金客栈函数接口详细设计

## 1. 用户认证

### 1.1 注册函数

```python
def register_user(nickname: str, password: str, user_introduction: str) -> int:
    """
    注册新用户
    :param nickname: 用户昵称
    :param password: 用户密码
    :param user_introduction: 用户自我介绍
    :return: 新创建的用户ID，如果注册失败返回-1
    """
```

### 1.2 登录函数

```python
def login_user(nickname: str, password: str) -> int:
    """
    用户登录
    :param nickname: 用户昵称
    :param password: 用户密码
    :return: 用户ID，如果登录失败返回-1
    """
```

## 2. 主界面功能

### 2.1 加载用户函数

```python
def load_user_info(user_id: int) -> dict:
    """
    加载用户信息
    :param user_id: 用户ID
    :return: 包含用户信息的字典
    """
```

### 2.2 显示任务函数

```python
def display_tasks(sort_by: str = 'created_at', limit: int = 10) -> list:
    """
    显示任务列表
    :param sort_by: 排序方式，默认按创建时间
    :param limit: 显示的任务数量
    :return: 任务列表
    """
```

## 3. 任务管理

### 3.1 发布任务函数

```python
def create_task(creator_id: int, task_tag: str, task_title: str, task_description: str, 
                deadline: datetime, reward_points: int) -> int:
    """
    发布新任务
    :param creator_id: 创建者用户ID
    :param task_tag: 任务标签
    :param task_title: 任务标题
    :param task_description: 任务描述
    :param deadline: 截止时间
    :param reward_points: 奖励积分
    :return: 新创建的任务ID，如果创建失败返回-1
    """
```

### 3.2 竞争任务函数

```python
def apply_for_task(task_id: int, hunter_id: int) -> bool:
    """
    猎人申请接受任务
    :param task_id: 任务ID
    :param hunter_id: 猎人用户ID
    :return: 是否成功申请
    """
```

### 3.3 查询猎人信息函数

```python
def get_hunter_info(hunter_id: int) -> dict:
    """
    获取猎人信息
    :param hunter_id: 猎人用户ID
    :return: 包含猎人信息的字典
    """
```

### 3.4 选择目标猎人函数

```python
def assign_task(creator_id: int, task_id: int, hunter_id: int) -> bool:
    """
    任务创建者选择猎人
    :param creator_id: 创建者用户ID
    :param task_id: 任务ID
    :param hunter_id: 被选中的猎人用户ID
    :return: 是否成功分配任务
    """
```

### 3.5 猎人提交任务成果函数

```python
def submit_task(hunter_id: int, task_id: int) -> bool:
    """
    猎人提交任务成果
    :param hunter_id: 猎人用户ID
    :param task_id: 任务ID
    :return: 是否成功提交
    """
```

### 3.6 评价猎人函数

```python
def rate_hunter(creator_id: int, task_id: int, rating: int, comment: str, is_finished: bool) -> bool:
    """
    任务创建者评价猎人
    :param creator_id: 创建者用户ID
    :param task_id: 任务ID
    :param rating: 评分
    :param comment: 评价内容
    :param is_finished: 任务是否真正完成
    :return: 是否成功评价
    """
```

### 3.7 交易函数

```python
def process_transaction(task_id: int) -> bool:
    """
    处理任务完成后的积分交易和信用、能力值更新
    :param task_id: 任务ID
    :return: 是否成功处理交易
    """
```

## 4. 排行榜

### 4.1 获取猎人排行榜函数

```python
def get_hunter_leaderboard(limit: int = 10) -> list:
    """
    获取猎人能力值排行榜
    :param limit: 显示的猎人数量
    :return: 排行榜列表
    """
```

## 5. 任务大厅

### 5.1 获取任务列表函数

```python
def get_task_list(status: str = 'awaiting', sort_by: str = 'created_at', limit: int = 20) -> list:
    """
    获取任务列表
    :param status: 任务状态，默认为待接受
    :param sort_by: 排序方式
    :param limit: 显示的任务数量
    :return: 任务列表
    """
```

### 5.2 搜索任务函数

```python
def search_tasks(keyword: str, tag: str = None) -> list:
    """
    搜索任务
    :param keyword: 搜索关键词
    :param tag: 任务标签（可选）
    :return: 符合条件的任务列表
    """
```

## 6. 用户资料管理

### 6.1 更新用户信息函数

```python
def update_user_info(user_id: int, nickname: str = None, user_introduction: str = None) -> bool:
    """
    更新用户信息
    :param user_id: 用户ID
    :param nickname: 新昵称（可选）
    :param user_introduction: 新自我介绍（可选）
    :return: 是否成功更新
    """
```

### 6.2 修改密码函数

```python
def change_password(user_id: int, old_password: str, new_password: str) -> bool:
    """
    修改用户密码
    :param user_id: 用户ID
    :param old_password: 旧密码
    :param new_password: 新密码
    :return: 是否成功修改密码
    """
```











