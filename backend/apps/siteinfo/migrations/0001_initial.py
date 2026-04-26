from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SiteContent",
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
                ("hero_title", models.CharField(blank=True, max_length=300, verbose_name="Hero H1")),
                ("hero_subtitle", models.TextField(blank=True, verbose_name="Hero подзаголовок")),
                ("phone", models.CharField(max_length=64)),
                ("email", models.EmailField(max_length=254)),
                ("address", models.TextField()),
                ("work_hours", models.CharField(max_length=200)),
                ("map_embed_html", models.TextField(blank=True)),
                ("whatsapp_url", models.URLField(blank=True)),
                ("telegram_url", models.URLField(blank=True)),
                ("vk_url", models.URLField(blank=True)),
                ("about_company", models.TextField(blank=True)),
                ("founder_message", models.TextField(blank=True)),
                ("founder_name", models.CharField(blank=True, max_length=120)),
                ("founder_title", models.CharField(blank=True, max_length=200)),
                ("advantages", models.JSONField(blank=True, default=list)),
                ("payment_methods", models.JSONField(blank=True, default=list)),
            ],
            options={
                "verbose_name": "Контент сайта",
                "verbose_name_plural": "Контент сайта",
            },
        ),
    ]
