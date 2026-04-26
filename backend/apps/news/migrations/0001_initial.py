from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="News",
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
                ("slug", models.SlugField(max_length=160, unique=True)),
                ("title", models.CharField(max_length=300, verbose_name="Заголовок")),
                ("excerpt", models.TextField(verbose_name="Анонс")),
                ("content", models.TextField(verbose_name="Текст")),
                ("category", models.CharField(blank=True, max_length=120, verbose_name="Категория")),
                (
                    "image",
                    models.ImageField(blank=True, null=True, upload_to="news/", verbose_name="image"),
                ),
                ("is_published", models.BooleanField(default=True, verbose_name="Опубликовано")),
                ("published_at", models.DateTimeField(verbose_name="Дата публикации")),
            ],
            options={
                "verbose_name": "Новость",
                "verbose_name_plural": "Новости",
                "ordering": ["-published_at", "-id"],
            },
        ),
    ]
