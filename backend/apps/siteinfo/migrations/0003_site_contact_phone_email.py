from django.db import migrations


def update_contact(apps, schema_editor):
    SiteContent = apps.get_model("siteinfo", "SiteContent")
    SiteContent.objects.all().update(
        phone="+7 (916) 303-28-63",
        email="info@residentservicerf.ru",
        whatsapp_url="https://wa.me/79163032863",
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("siteinfo", "0002_sitecontent_promo_countdown_date"),
    ]

    operations = [
        migrations.RunPython(update_contact, noop_reverse),
    ]
