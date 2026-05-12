from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Только обновляет detail.content_sections для услуг из seed_content (без пересоздания FAQ/цен/новостей)"

    def handle(self, *args, **options):
        from apps.services.seed_content import merge_long_articles_into_services

        merge_long_articles_into_services()
        self.stdout.write(self.style.SUCCESS("Секции длинных статей обновлены."))

