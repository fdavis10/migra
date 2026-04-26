from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "service", "rating", "is_active", "created_at")
    list_editable = ("is_active",)
