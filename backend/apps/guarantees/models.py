from django.db import models


class Guarantee(models.Model):
    icon = models.CharField("Иконка (ключ)", max_length=100)
    title = models.CharField("Заголовок", max_length=200)
    description = models.TextField("Описание")
    title_en = models.CharField("Заголовок (EN)", max_length=200, blank=True)
    description_en = models.TextField("Описание (EN)", blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Гарантия"
        verbose_name_plural = "Гарантии"

    def __str__(self):
        return self.title
