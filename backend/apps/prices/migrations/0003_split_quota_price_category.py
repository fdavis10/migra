from django.db import migrations
from django.db.models import F, Q


def split_quota_from_rvp_category(apps, schema_editor):
    PriceCategory = apps.get_model("prices", "PriceCategory")
    PriceItem = apps.get_model("prices", "PriceItem")
    Service = apps.get_model("services", "Service")

    if PriceCategory.objects.filter(title="Квота на РВП").exists():
        return

    rvp_cat = PriceCategory.objects.filter(
        title="Разрешение на временное проживание (РВП)",
    ).first()
    if not rvp_cat:
        return

    quota_item = (
        PriceItem.objects.filter(category=rvp_cat)
        .filter(
            Q(title__icontains="квоты на РВП") | Q(title__icontains="квота на РВП"),
        )
        .order_by("order", "id")
        .first()
    )
    if not quota_item:
        return

    orig_order = rvp_cat.order
    PriceCategory.objects.filter(order__gte=orig_order).update(order=F("order") + 1)
    rvp_cat.refresh_from_db()

    quota_service = Service.objects.filter(slug="kvota-rvp").first()
    qc = PriceCategory.objects.create(
        title="Квота на РВП",
        title_en="TRP quota",
        order=orig_order,
        service=quota_service,
    )

    quota_item.category_id = qc.id
    quota_item.order = 1
    quota_item.save(update_fields=["category_id", "order"])

    for idx, it in enumerate(
        PriceItem.objects.filter(category_id=rvp_cat.id).order_by("order", "id"),
        start=1,
    ):
        if it.order != idx:
            it.order = idx
            it.save(update_fields=["order"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("prices", "0002_add_english_fields"),
        ("services", "0002_add_english_fields"),
    ]

    operations = [
        migrations.RunPython(split_quota_from_rvp_category, noop_reverse),
    ]
