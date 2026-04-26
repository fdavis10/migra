from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Promotion",
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
                ("title", models.CharField(max_length=200, verbose_name="Заголовок")),
                ("discount", models.CharField(max_length=50, verbose_name="Скидка")),
                ("description", models.TextField(verbose_name="Описание")),
                ("is_active", models.BooleanField(default=True, verbose_name="Активна")),
                (
                    "expires_at",
                    models.DateTimeField(blank=True, null=True, verbose_name="Действует до"),
                ),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Порядок")),
            ],
            options={
                "verbose_name": "Акция",
                "verbose_name_plural": "Акции",
                "ordering": ["order", "id"],
            },
        ),
    ]
