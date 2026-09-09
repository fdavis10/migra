from django.core.management.base import BaseCommand, CommandError

from apps.leads.amocrm import AmocrmApiError, exchange_authorization_code, list_pipelines


class Command(BaseCommand):
    help = "Обмен кода авторизации AmoCRM на access/refresh токены"

    def add_arguments(self, parser):
        parser.add_argument("code", type=str, help="Authorization code из Redirect URI")
        parser.add_argument(
            "--redirect-uri",
            default="",
            help="Должен совпадать с Redirect URI в интеграции",
        )
        parser.add_argument(
            "--show-pipelines",
            action="store_true",
            help="После обмена показать воронки и статусы",
        )

    def handle(self, *args, **options):
        code = options["code"]
        redirect = options["redirect_uri"] or None
        try:
            data = exchange_authorization_code(code, redirect_uri=redirect)
        except AmocrmApiError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(self.style.SUCCESS("Токены сохранены в .amocrm_tokens.json"))
        self.stdout.write(f"expires_in={data.get('expires_in')}")
        if options["show_pipelines"]:
            try:
                pipelines = list_pipelines()
            except AmocrmApiError as exc:
                raise CommandError(str(exc)) from exc
            for p in pipelines:
                self.stdout.write(f"pipeline id={p.get('id')} name={p.get('name')}")
                for st in (p.get("_embedded") or {}).get("statuses") or []:
                    self.stdout.write(
                        f"  status id={st.get('id')} name={st.get('name')}"
                    )
