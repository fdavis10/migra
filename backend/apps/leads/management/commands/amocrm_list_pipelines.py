from django.core.management.base import BaseCommand, CommandError

from apps.leads.amocrm import AmocrmApiError, list_pipelines


class Command(BaseCommand):
    help = "Показать воронки и статусы AmoCRM (нужны токены)"

    def handle(self, *args, **options):
        try:
            pipelines = list_pipelines()
        except AmocrmApiError as exc:
            raise CommandError(str(exc)) from exc
        if not pipelines:
            self.stdout.write("Воронок нет")
            return
        for p in pipelines:
            self.stdout.write(f"pipeline id={p.get('id')} name={p.get('name')}")
            for st in (p.get("_embedded") or {}).get("statuses") or []:
                self.stdout.write(f"  status id={st.get('id')} name={st.get('name')}")
