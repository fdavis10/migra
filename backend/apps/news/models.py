from django.db import models


class News(models.Model):
    slug = models.SlugField(unique=True, max_length=160)
    title = models.CharField("Заголовок", max_length=300)
    excerpt = models.TextField("Анонс")
    content = models.TextField("Текст")
    category = models.CharField("Категория", max_length=120, blank=True)
    image = models.ImageField(upload_to="news/", blank=True, null=True)
    is_published = models.BooleanField("Опубликовано", default=True)
    published_at = models.DateTimeField("Дата публикации")
    title_en = models.CharField("Заголовок (EN)", max_length=300, blank=True)
    excerpt_en = models.TextField("Анонс (EN)", blank=True)
    content_en = models.TextField("Текст (EN)", blank=True)
    category_en = models.CharField("Категория (EN)", max_length=120, blank=True)

    class Meta:
        ordering = ["-published_at", "-id"]
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

    def __str__(self):
        return self.title
