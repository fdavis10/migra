from django.db import models


class Lead(models.Model):
    STATUS = [
        ("new", "Новая"),
        ("in_progress", "В работе"),
        ("done", "Завершена"),
        ("spam", "Спам"),
    ]
    SOURCE = [
        ("modal", "Модальная форма"),
        ("chat", "Чат"),
        ("other", "Другое"),
    ]
    name = models.CharField("Имя", max_length=100, blank=True)
    phone = models.CharField("Телефон", max_length=30)
    citizenship = models.CharField("Гражданство", max_length=100, blank=True)
    region = models.CharField("Регион", max_length=100, blank=True)
    service = models.CharField("Услуга", max_length=200, blank=True)
    message = models.TextField("Сообщение", blank=True)
    status = models.CharField(
        "Статус", max_length=20, choices=STATUS, default="new"
    )
    source_page = models.CharField("Страница", max_length=200, blank=True)
    source = models.CharField(
        "Источник",
        max_length=20,
        choices=SOURCE,
        default="modal",
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"{self.phone} ({self.get_status_display()})"
