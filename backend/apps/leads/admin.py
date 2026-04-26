from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("phone", "name", "source", "citizenship", "region", "status", "created_at")
    list_filter = ("status", "source")
    search_fields = ("phone", "name")
