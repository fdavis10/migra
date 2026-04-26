from django.contrib import admin

from .models import Guarantee


@admin.register(Guarantee)
class GuaranteeAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)
