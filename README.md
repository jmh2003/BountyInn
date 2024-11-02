# Bounty Inn - Bounty Inn

Bounty Inn is a Django-based platform for task trading and community interaction, where users can post tasks, apply for tasks, complete tasks, and interact in forums. This platform provides a point and credit system to reward task creators and completers, and supports features like leaderboards and user information management.

![image-20241102154325363](frontend/cool-menu/public/login.png)

## Table of Contents

[TOC]

---

## Feature Overview

1. **User Management**: Supports user registration, login, updating information, and logout.
2. **Task System**: Users can post tasks, and other users can apply for, claim, and submit the results of tasks.
3. **Point System**: Users earn/spend points for posting and completing tasks.
4. **Credit and Ability Scoring**: Dynamically updates users' credit and ability scores based on task ratings and completion.
5. **Leaderboard**: Ranks users based on points, ability scores, or credit scores.
6. **Forum System**: Supports users posting and commenting in forums, with keyword and date range filtering for comments.
7. **Transaction Records**: Records transactions and points for task posters and completers.

![image-20241102154325363](frontend/cool-menu/public/inn.jpg)

## Technology Stack

- **Backend**: Django 5.1.1, Django REST Framework
- **Database**: SQLite
- **Frontend**: Provides JSON format interfaces, suitable for integration with front-end frameworks
- **API Calls**: Integrated with OpenAI API (requires configuration of API Key)

## Deployment Steps

### 1. Clone the Project

```bash
git clone https://github.com/jmh2003/NIS3368.git
cd backend
```

### 2. Create a Virtual Environment and Install Dependencies

It is recommended to use a virtual environment to manage project dependencies:

```bash
pip install virtualenv
virtualenv venv # Create a new environment called 'venv'
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 3. Configure the Database

The project defaults to using SQLite, but you can change to another database in `settings.py` as needed.

### 4. Run Database Migrations

Migrate the database to create the necessary table structures for the project:

```bash
python ./backend/manage.py makemigrations
python ./backend/manage.py migrate
```

### 5. Create Superuser (Optional)

Create a superuser account to manage users and data through the Django Admin interface:

```bash
python manage.py createsuperuser
```

### 6. Configure OpenAI API Key

In the `mysite/open_ai.py` file, replace with your own OpenAI API key:

```python
client = OpenAI(api_key="your_openai_api_key", base_url="https://api.moonshot.cn/v1")
```

### 7. Set urls

The ports for the front end and back end need to correspond with each other.  In `backend/mysite/settings.py`, 

```
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://122.9.1.113:3000",
] 
```

CORS_ALLOWED_ORIGINS needs to include the front-end React port "http://127.0.0.1:3000". In the front end, in`frontend/cool-menu/.env`, the back-end Django URL needs to be filled in.

```
REACT_APP_API_BASE_URL=http://http://127.0.0.1:8000
```

### 8. Run

Start the backend service:

```bash
cd ./backend
python manage.py runserver
```

Start the front-end interface:

```bash
cd ./frontend/cool-menu/
npm start
```

The server will run at http://127.0.0.1:8000

## API Interface Overview

### User Module

- **Register**: `POST /api/users/register/`
- **Login**: `POST /api/users/login/`
- **Update User Information**: `POST /api/users/update_user/`
- **Get User Information**: `POST /api/users/get_user_info/`

### Task Module

- **Create Task**: `POST /api/tasks/add_task/`
- **Get User Tasks**: `GET /api/tasks/tasks/`
- **Submit Task Outcome**: `PUT /api/tasks/submit_task_outcome/`
- **Delete Task**: `PATCH /api/tasks/delete_task/`

### Forum Module

- **Get Comments**: `GET /api/forum/comments/`
- **Post Comments**: `POST /api/forum/comments/`

### Leaderboard Module

- **Get Leaderboard**: `POST /api/leaderboard/get-rankings/`
- **Get User Rank**: `POST /api/leaderboard/get-user-rank/`

> For more details, see the comments in the `backend/*/views.py` files.

## Usage

1. **User Registration and Login**: Register and log in new users through the API to obtain an authentication token.
2. **Task Posting and Completion**: After logging in, users can post tasks, apply for tasks, and complete tasks by submitting results.
3. **Point Transactions**: Points are automatically transferred after task completion, and credit and ability scores are updated.
4. **Forum Interaction**: Users can post, reply to comments, and filter discussion content by keywords or date ranges.
5. **Leaderboard Viewing**: Supports viewing user rankings by remaining points, credit scores, and ability scores.



