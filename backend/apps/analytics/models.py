from django.db import models


class PageVisit(models.Model):
    """Просмотр страницы публичного сайта (SPA)."""

    path = models.CharField("Путь", max_length=512, db_index=True)
    visitor_id = models.CharField(
        "Идентификатор посетителя",
        max_length=64,
        blank=True,
        null=True,
        db_index=True,
    )
    created_at = models.DateTimeField("Время", auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Просмотр страницы"
        verbose_name_plural = "Просмотры страниц"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.path} @ {self.created_at}"
