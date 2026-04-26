from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="lead",
            name="source",
            field=models.CharField(
                choices=[
                    ("modal", "Модальная форма"),
                    ("chat", "Чат"),
                    ("other", "Другое"),
                ],
                db_index=True,
                default="modal",
                max_length=20,
                verbose_name="Источник",
            ),
        ),
    ]
