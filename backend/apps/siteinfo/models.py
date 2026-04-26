from django.db import models


class SiteContent(models.Model):
    """Единая запись (pk=1) с контактами и текстами «О компании» для фронтенда."""

    hero_title = models.CharField("Hero H1", max_length=300, blank=True)
    hero_subtitle = models.TextField("Hero подзаголовок", blank=True)
    phone = models.CharField(max_length=64)
    email = models.EmailField()
    address = models.TextField()
    work_hours = models.CharField(max_length=200)
    map_embed_html = models.TextField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    telegram_url = models.URLField(blank=True)
    vk_url = models.URLField(blank=True)
    about_company = models.TextField(blank=True)
    founder_message = models.TextField(blank=True)
    founder_name = models.CharField(max_length=120, blank=True)
    founder_title = models.CharField(max_length=200, blank=True)
    advantages = models.JSONField(default=list, blank=True)
    payment_methods = models.JSONField(default=list, blank=True)
    promo_countdown_date = models.DateField(
        "Дата окончания акции (таймер на главной)",
        null=True,
        blank=True,
        help_text="На сайте отображается обратный отсчёт до конца этого дня по московскому времени.",
    )

    class Meta:
        verbose_name = "Контент сайта"
        verbose_name_plural = "Контент сайта"

    def __str__(self):
        return "Контент сайта"
