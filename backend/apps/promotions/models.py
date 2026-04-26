from django.db import models


class Promotion(models.Model):
    title = models.CharField("Заголовок", max_length=200)
    discount = models.CharField("Скидка", max_length=50)
    description = models.TextField("Описание")
    is_active = models.BooleanField("Активна", default=True)
    expires_at = models.DateTimeField("Действует до", null=True, blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    def __str__(self):
        return self.title
