# Generated by Django 4.2.3 on 2024-10-29 16:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0005_rename_assignee_task_assignee_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="task_tag",
            field=models.CharField(
                choices=[
                    ("Learning", "Learning"),
                    ("Life", "Life"),
                    ("Job", "Job"),
                    ("Else", "Else"),
                ],
                max_length=20,
            ),
        ),
    ]
