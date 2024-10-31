# Generated by Django 5.1.1 on 2024-10-31 13:25

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="forum",
            fields=[
                ("comment_id", models.AutoField(primary_key=True, serialize=False)),
                ("comment_nickname", models.CharField(max_length=50)),
                ("comment_content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
