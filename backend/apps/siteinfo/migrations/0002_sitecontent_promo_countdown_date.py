from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("siteinfo", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitecontent",
            name="promo_countdown_date",
            field=models.DateField(
                blank=True,
                help_text="На сайте отображается обратный отсчёт до конца этого дня по московскому времени.",
                null=True,
                verbose_name="Дата окончания акции (таймер на главной)",
            ),
        ),
    ]
