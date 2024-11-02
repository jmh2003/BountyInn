from django.contrib import admin

# Register your models here.
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "nickname",
        "credit_score",
        "remaining_points",
        "ability_score",
        "is_alive",
    )


admin.site.register(User, UserAdmin)
