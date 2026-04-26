from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Guarantee",
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
                ("icon", models.CharField(max_length=100, verbose_name="Иконка (ключ)")),
                ("title", models.CharField(max_length=200, verbose_name="Заголовок")),
                ("description", models.TextField(verbose_name="Описание")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Порядок")),
            ],
            options={
                "verbose_name": "Гарантия",
                "verbose_name_plural": "Гарантии",
                "ordering": ["order", "id"],
            },
        ),
    ]
