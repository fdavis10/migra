from django.contrib import admin

from .models import Promotion


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("title", "discount", "is_active", "expires_at", "order")
    list_editable = ("is_active", "order")
