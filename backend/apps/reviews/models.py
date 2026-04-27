from django.db import models


class Review(models.Model):
    name = models.CharField("Имя", max_length=100)
    service = models.CharField("Услуга", max_length=200, blank=True)
    service_slug = models.SlugField("Слаг услуги", max_length=120, blank=True)
    text = models.TextField("Текст")
    text_en = models.TextField("Текст (EN)", blank=True)
    service_en = models.CharField("Услуга (EN)", max_length=200, blank=True)
    source = models.CharField("Источник", max_length=50, blank=True)
    rating = models.PositiveIntegerField("Оценка", default=5)
    is_active = models.BooleanField("Показывать", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

    def __str__(self):
        return self.name
