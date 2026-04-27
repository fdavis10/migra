from django.db import models


class FAQCategory(models.Model):
    title = models.CharField("Тема", max_length=100)
    title_en = models.CharField("Тема (EN)", max_length=100, blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Категория FAQ"
        verbose_name_plural = "Категории FAQ"

    def __str__(self):
        return self.title


class FAQ(models.Model):
    category = models.ForeignKey(
        FAQCategory, on_delete=models.CASCADE, related_name="items"
    )
    question = models.CharField("Вопрос", max_length=300)
    answer = models.TextField("Ответ")
    question_en = models.CharField("Вопрос (EN)", max_length=300, blank=True)
    answer_en = models.TextField("Ответ (EN)", blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Вопрос"
        verbose_name_plural = "Вопросы"

    def __str__(self):
        return self.question
