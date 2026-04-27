from django.core.management.base import BaseCommand

from apps.faq.models import FAQ, FAQCategory
from apps.guarantees.models import Guarantee
from apps.news.models import News
from apps.prices.models import PriceCategory, PriceItem
from apps.promotions.models import Promotion
from apps.reviews.models import Review
from apps.services.models import Service
from config.locale_seed import (
    DETAIL_EN_PIECES,
    DURATION_EN,
    FAQ_CATEGORY_TITLE_EN,
    FAQ_ITEM_EN,
    GUARANTEE_EN,
    NEWS_BY_SLUG,
    PRICE_CATEGORY_TITLE_EN,
    PRICE_ITEM_TITLE_EN,
    PROMOTION_EN,
    REVIEWS_EN,
    SERVICE_TEXT_EN,
)


class Command(BaseCommand):
    help = "Fill *_en fields for public API locale (run after migrate)."

    def handle(self, *args, **options):
        n = 0
        for slug, payload in SERVICE_TEXT_EN.items():
            updated = Service.objects.filter(slug=slug).update(**payload)
            n += updated
        for slug, detail_en in DETAIL_EN_PIECES.items():
            updated = Service.objects.filter(slug=slug).update(detail_en=detail_en)
            n += updated

        for slug, payload in NEWS_BY_SLUG.items():
            n += News.objects.filter(slug=slug).update(**payload)

        for cat in FAQCategory.objects.all():
            en = FAQ_CATEGORY_TITLE_EN.get(cat.title, "")
            if en and cat.title_en != en:
                cat.title_en = en
                cat.save(update_fields=["title_en"])
                n += 1

        for faq in FAQ.objects.all():
            pack = FAQ_ITEM_EN.get(faq.question)
            if not pack:
                continue
            faq.question_en = pack["question_en"]
            faq.answer_en = pack["answer_en"]
            faq.save(update_fields=["question_en", "answer_en"])
            n += 1

        for g in Guarantee.objects.all():
            pack = GUARANTEE_EN.get(g.title)
            if not pack:
                continue
            g.title_en = pack["title_en"]
            g.description_en = pack["description_en"]
            g.save(update_fields=["title_en", "description_en"])
            n += 1

        for p in Promotion.objects.all():
            pack = PROMOTION_EN.get(p.title)
            if not pack:
                continue
            p.title_en = pack["title_en"]
            p.description_en = pack["description_en"]
            p.save(update_fields=["title_en", "description_en"])
            n += 1

        for pk, payload in REVIEWS_EN.items():
            n += Review.objects.filter(pk=pk).update(**payload)

        for cat in PriceCategory.objects.all():
            en = PRICE_CATEGORY_TITLE_EN.get(cat.title, "")
            if en and cat.title_en != en:
                cat.title_en = en
                cat.save(update_fields=["title_en"])
                n += 1

        for item in PriceItem.objects.all():
            title_en = PRICE_ITEM_TITLE_EN.get(item.title, "")
            dur_en = DURATION_EN.get(item.duration, item.duration or "")
            if title_en != item.title_en or dur_en != item.duration_en:
                item.title_en = title_en
                item.duration_en = dur_en
                item.save(update_fields=["title_en", "duration_en"])
                n += 1

        self.stdout.write(self.style.SUCCESS(f"seed_english_locale: updated ~{n} field writes"))
