from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0002_lead_source"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lead",
            name="source",
            field=models.CharField(
                choices=[
                    ("modal", "Модальная форма"),
                    ("callback", "Обратный звонок"),
                    ("home", "Главная страница"),
                    ("contacts", "Страница контактов"),
                    ("service", "Страница услуги"),
                    ("quiz", "Тест на скидку"),
                    ("chat", "Чат со специалистом"),
                    ("other", "Другое"),
                ],
                db_index=True,
                default="modal",
                max_length=20,
                verbose_name="Источник",
            ),
        ),
    ]
