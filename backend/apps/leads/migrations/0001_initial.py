from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Lead",
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
                ("name", models.CharField(blank=True, max_length=100, verbose_name="Имя")),
                ("phone", models.CharField(max_length=30, verbose_name="Телефон")),
                (
                    "citizenship",
                    models.CharField(blank=True, max_length=100, verbose_name="Гражданство"),
                ),
                ("region", models.CharField(blank=True, max_length=100, verbose_name="Регион")),
                ("service", models.CharField(blank=True, max_length=200, verbose_name="Услуга")),
                ("message", models.TextField(blank=True, verbose_name="Сообщение")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "Новая"),
                            ("in_progress", "В работе"),
                            ("done", "Завершена"),
                            ("spam", "Спам"),
                        ],
                        default="new",
                        max_length=20,
                        verbose_name="Статус",
                    ),
                ),
                (
                    "source_page",
                    models.CharField(blank=True, max_length=200, verbose_name="Страница"),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Заявка",
                "verbose_name_plural": "Заявки",
                "ordering": ["-created_at"],
            },
        ),
    ]
