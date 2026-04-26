from django.contrib import admin

from .models import PriceCategory, PriceItem


class PriceItemInline(admin.TabularInline):
    model = PriceItem
    extra = 0


@admin.register(PriceCategory)
class PriceCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "service")
    list_editable = ("order",)
    inlines = [PriceItemInline]
