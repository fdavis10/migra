import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY", "dev-insecure-change-me-resident-service-2026"
)

DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if h.strip()
]

USE_X_FORWARDED_HOST = os.environ.get("DJANGO_USE_X_FORWARDED_HOST", "0") == "1"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "apps.panel",
    "apps.services",
    "apps.prices",
    "apps.promotions",
    "apps.news",
    "apps.leads",
    "apps.reviews",
    "apps.faq",
    "apps.guarantees",
    "apps.siteinfo",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

if os.environ.get("POSTGRES_HOST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("POSTGRES_DB", "resident"),
            "USER": os.environ.get("POSTGRES_USER", "resident"),
            "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "resident"),
            "HOST": os.environ["POSTGRES_HOST"],
            "PORT": os.environ.get("POSTGRES_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "Europe/Moscow"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
        "OPTIONS": {"location": str(MEDIA_ROOT)},
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if o.strip()
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": False,
}

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]

if not DEBUG:
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "same-origin"
    X_FRAME_OPTIONS = "DENY"
    if os.environ.get("DJANGO_BEHIND_HTTPS_PROXY", "0") == "1":
        SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    if os.environ.get("DJANGO_SECURE_SSL_REDIRECT", "0") == "1":
        SECURE_SSL_REDIRECT = True
    if os.environ.get("DJANGO_SESSION_COOKIE_SECURE", "0") == "1":
        SESSION_COOKIE_SECURE = True
        CSRF_COOKIE_SECURE = True

# ---------------------------------------------------------------------------
# Email (SMTP) configuration
# ---------------------------------------------------------------------------
# Provider defaults are tailored to Timeweb (smtp.timeweb.ru:465 SSL),
# but every value can be overridden via environment variables.

EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND",
    "django.core.mail.backends.smtp.EmailBackend"
    if os.environ.get("EMAIL_HOST_USER") or not DEBUG
    else "django.core.mail.backends.console.EmailBackend",
)
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.timeweb.ru")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "465"))
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", "1") == "1"
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "0") == "1"
if EMAIL_USE_SSL and EMAIL_USE_TLS:
    EMAIL_USE_TLS = False  # mutually exclusive in Django
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "leads@residentservicerf.ru")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_TIMEOUT = int(os.environ.get("EMAIL_TIMEOUT", "20"))

DEFAULT_FROM_EMAIL = os.environ.get(
    "DEFAULT_FROM_EMAIL",
    f'Миграционный сервис «Резидент» <{EMAIL_HOST_USER}>',
)
SERVER_EMAIL = os.environ.get("SERVER_EMAIL", EMAIL_HOST_USER)

# Recipients of new-lead notifications (comma-separated env var supported).
LEADS_RECIPIENT_EMAILS = [
    a.strip()
    for a in os.environ.get(
        "LEADS_RECIPIENT_EMAILS",
        os.environ.get("LEADS_RECIPIENT_EMAIL", "info@residentservicerf.ru"),
    ).split(",")
    if a.strip()
]
LEADS_EMAIL_SUBJECT_PREFIX = os.environ.get(
    "LEADS_EMAIL_SUBJECT_PREFIX", "[Резидент]"
)
LEADS_EMAIL_FAIL_SILENTLY = os.environ.get("LEADS_EMAIL_FAIL_SILENTLY", "1") == "1"
SITE_PUBLIC_URL = os.environ.get(
    "SITE_PUBLIC_URL", "https://residentservicerf.ru"
).rstrip("/")

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "[{asctime}] {levelname} {name}: {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.environ.get("DJANGO_LOG_LEVEL", "INFO"),
        },
        "apps.leads": {
            "handlers": ["console"],
            "level": os.environ.get("LEADS_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
    },
}
