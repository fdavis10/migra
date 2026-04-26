from django.db import models


class Service(models.Model):
    """Миграционная услуга; detail — JSON для блоков детальной страницы."""

    slug = models.SlugField("Слаг", unique=True, max_length=120)
    title = models.CharField("Название", max_length=200)
    short_desc = models.TextField("Краткое описание")
    full_desc = models.TextField("Полное описание", blank=True)
    icon = models.CharField("Иконка (ключ)", max_length=100)
    price_from = models.DecimalField(
        "Цена от", max_digits=10, decimal_places=2, null=True, blank=True
    )
    price_to = models.DecimalField(
        "Цена до", max_digits=10, decimal_places=2, null=True, blank=True
    )
    price_note = models.CharField(
        "Примечание к цене", max_length=120, blank=True
    )
    is_main = models.BooleanField("На главной", default=False)
    order = models.PositiveIntegerField("Порядок", default=0)
    detail = models.JSONField("Детали страницы", default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

    def __str__(self):
        return self.title
