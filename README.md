# Миграционный сервис «РЕЗИДЕНТ»

Монорепозиторий: **Django 5 + DRF** (`backend/`), **React 18 + Vite** (`frontend/`), логотип в `assets/` и дубликат для сборки в `frontend/public/logo.svg`.

## Локальная разработка

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_initial
python manage.py runserver
```

API: `http://127.0.0.1:8000/api/` (лиды: `POST /api/leads/`).

Дамп фикстур (после `seed_initial`): `python manage.py dumpdata services prices promotions news reviews faq guarantees --indent 2 -o fixtures/initial_data.json` (на Windows при необходимости: `set PYTHONUTF8=1`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Прокси Vite отправляет `/api` на `http://127.0.0.1:8000`. Контакты в шапке/подвале подгружаются с `GET /api/site/contact/`; если эндпоинта нет, используются значения из `frontend/src/config/siteStatic.js`.

## Docker

```bash
docker compose up --build
```

- PostgreSQL и backend на порту **8000**
- Статический фронт в nginx на порту **8080**, прокси `/api/` → backend

После первого запуска при необходимости выполните в контейнере backend: `python manage.py seed_initial` или `loaddata fixtures/initial_data.json`.

## Структура

- `assets/` — исходный логотип заказчика
- `backend/apps/` — модели и API: `services`, `prices`, `promotions`, `news`, `leads`, `reviews`, `faq`, `guarantees`
- `frontend/src/` — страницы, компоненты, CSS modules, `styles/variables.css`
