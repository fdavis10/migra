from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Service",
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
                ("slug", models.SlugField(max_length=120, unique=True, verbose_name="Слаг")),
                ("title", models.CharField(max_length=200, verbose_name="Название")),
                ("short_desc", models.TextField(verbose_name="Краткое описание")),
                ("full_desc", models.TextField(blank=True, verbose_name="Полное описание")),
                ("icon", models.CharField(max_length=100, verbose_name="Иконка (ключ)")),
                (
                    "price_from",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Цена от",
                    ),
                ),
                (
                    "price_to",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Цена до",
                    ),
                ),
                (
                    "price_note",
                    models.CharField(
                        blank=True, max_length=120, verbose_name="Примечание к цене"
                    ),
                ),
                ("is_main", models.BooleanField(default=False, verbose_name="На главной")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Порядок")),
                ("detail", models.JSONField(blank=True, default=dict, verbose_name="Детали страницы")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Услуга",
                "verbose_name_plural": "Услуги",
                "ordering": ["order", "id"],
            },
        ),
    ]
