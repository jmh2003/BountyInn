from django.contrib import admin

# # Register your models here.
# from .models import Task
# admin.site.register(Task)

from django import forms
from django.contrib import admin
from .models import Task, User

class TaskAdminForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['creator_id'].queryset = User.objects.all()
        self.fields['creator_id'].label_from_instance = lambda obj: f"{obj.user_id}"

        self.fields['assignee_id'].queryset = User.objects.all()
        self.fields['assignee_id'].label_from_instance = lambda obj: f"{obj.user_id}"

class TaskAdmin(admin.ModelAdmin):
    form = TaskAdminForm

admin.site.register(Task, TaskAdmin)
