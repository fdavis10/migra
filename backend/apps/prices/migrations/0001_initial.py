import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PriceCategory",
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
                ("title", models.CharField(max_length=200, verbose_name="Название категории")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Порядок")),
                (
                    "service",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="price_categories",
                        to="services.service",
                    ),
                ),
            ],
            options={
                "verbose_name": "Категория прайса",
                "verbose_name_plural": "Категории прайса",
                "ordering": ["order", "id"],
            },
        ),
        migrations.CreateModel(
            name="PriceItem",
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
                ("title", models.CharField(max_length=300, verbose_name="Услуга / позиция")),
                (
                    "price_from",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Стоимость от",
                    ),
                ),
                (
                    "price_to",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Стоимость до",
                    ),
                ),
                (
                    "price_display",
                    models.CharField(blank=True, max_length=120, verbose_name="Текст цены"),
                ),
                ("duration", models.CharField(blank=True, max_length=100, verbose_name="Срок")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Порядок")),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="prices.pricecategory",
                    ),
                ),
            ],
            options={
                "verbose_name": "Позиция прайса",
                "verbose_name_plural": "Позиции прайса",
                "ordering": ["order", "id"],
            },
        ),
    ]
