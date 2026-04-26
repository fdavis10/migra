from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_main", "order", "price_from")
    list_editable = ("is_main", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "slug")
