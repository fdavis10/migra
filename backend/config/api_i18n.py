"""API locale: query ?lang=en|ru or Accept-Language."""


def get_api_lang(request) -> str:
    if request is None:
        return "ru"
    q = getattr(request, "query_params", None)
    if q:
        raw = q.get("lang") or q.get("locale") or ""
        if isinstance(raw, str):
            low = raw.strip().lower()
            if low.startswith("en"):
                return "en"
            if low.startswith("ru"):
                return "ru"
    accept = request.META.get("HTTP_ACCEPT_LANGUAGE", "") or ""
    low = accept.strip().lower()
    if low.startswith("en"):
        return "en"
    return "ru"


def pick_str(ru_val: str, en_val: str | None, use_en: bool) -> str:
    if use_en and en_val and str(en_val).strip():
        return en_val.strip()
    return ru_val if ru_val is not None else ""


def merge_localized_json(base, overlay):
    """Merge Russian JSON with English overlay: overlay wins when non-empty; recurse dicts."""
    if overlay is None:
        return base
    if isinstance(base, dict) and isinstance(overlay, dict):
        out = {}
        keys = set(base) | set(overlay)
        for k in keys:
            if k not in base:
                out[k] = overlay[k]
                continue
            if k not in overlay or overlay[k] in (None, "", [], {}):
                out[k] = base[k]
            else:
                out[k] = merge_localized_json(base[k], overlay[k])
        return out
    if isinstance(base, list) and isinstance(overlay, list):
        return overlay if len(overlay) > 0 else base
    if overlay not in (None, ""):
        return overlay
    return base
