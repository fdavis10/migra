from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100, verbose_name="Имя")),
                ("service", models.CharField(blank=True, max_length=200, verbose_name="Услуга")),
                (
                    "service_slug",
                    models.SlugField(blank=True, max_length=120, verbose_name="Слаг услуги"),
                ),
                ("text", models.TextField(verbose_name="Текст")),
                ("source", models.CharField(blank=True, max_length=50, verbose_name="Источник")),
                ("rating", models.PositiveIntegerField(default=5, verbose_name="Оценка")),
                ("is_active", models.BooleanField(default=True, verbose_name="Показывать")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Отзыв",
                "verbose_name_plural": "Отзывы",
                "ordering": ["-created_at"],
            },
        ),
    ]
