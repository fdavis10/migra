from django.db import migrations


def rename_quota_category(apps, schema_editor):
    PriceCategory = apps.get_model("prices", "PriceCategory")
    PriceCategory.objects.filter(title="Квота на РВП").update(
        title="Квота на временное проживание (РВП)",
        title_en="Temporary residence quota (TRP)",
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("prices", "0003_split_quota_price_category"),
    ]

    operations = [
        migrations.RunPython(rename_quota_category, noop_reverse),
    ]
