from django.db import models


class PriceCategory(models.Model):
    title = models.CharField("Название категории", max_length=200)
    order = models.PositiveIntegerField("Порядок", default=0)
    service = models.ForeignKey(
        "services.Service",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="price_categories",
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Категория прайса"
        verbose_name_plural = "Категории прайса"

    def __str__(self):
        return self.title


class PriceItem(models.Model):
    category = models.ForeignKey(
        PriceCategory, on_delete=models.CASCADE, related_name="items"
    )
    title = models.CharField("Услуга / позиция", max_length=300)
    price_from = models.DecimalField(
        "Стоимость от", max_digits=10, decimal_places=2, null=True, blank=True
    )
    price_to = models.DecimalField(
        "Стоимость до", max_digits=10, decimal_places=2, null=True, blank=True
    )
    price_display = models.CharField(
        "Текст цены", max_length=120, blank=True
    )
    duration = models.CharField("Срок", max_length=100, blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Позиция прайса"
        verbose_name_plural = "Позиции прайса"

    def __str__(self):
        return self.title
