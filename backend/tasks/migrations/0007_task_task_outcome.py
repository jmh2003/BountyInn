# Generated by Django 5.1.1 on 2024-10-29 23:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0006_alter_task_task_tag"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="task_outcome",
            field=models.TextField(blank=True, null=True),
        ),
    ]
