from django.contrib import admin

from .models import FAQ, FAQCategory


class FAQInline(admin.TabularInline):
    model = FAQ
    extra = 0


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)
    inlines = [FAQInline]
