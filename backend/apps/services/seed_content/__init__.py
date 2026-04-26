from . import (
    article_deportaciya,
    article_grazhdanstvo,
    article_konsultaciya,
    article_kvota_rvp,
    article_pasport_rf,
    article_repatriaciya,
    article_rnr,
    article_rvp,
    article_ustanovlenie,
    article_vnzh,
    article_vremennoe_ubezhishhe,
    article_vydvorenie,
    article_zapret,
)

_SLUG_GETTERS = {
    "kvota-rvp": article_kvota_rvp.get_sections,
    "rvp": article_rvp.get_sections,
    "vnzh": article_vnzh.get_sections,
    "grazhdanstvo": article_grazhdanstvo.get_sections,
    "pasport-rf": article_pasport_rf.get_sections,
    "rnr": article_rnr.get_sections,
    "zapret-na-vezd": article_zapret.get_sections,
    "deportaciya": article_deportaciya.get_sections,
    "vydvorenie": article_vydvorenie.get_sections,
    "vremennoe-ubezhishhe": article_vremennoe_ubezhishhe.get_sections,
    "ustanovlenie-lichnosti": article_ustanovlenie.get_sections,
    "repatriaciya": article_repatriaciya.get_sections,
    "konsultaciya": article_konsultaciya.get_sections,
}


def merge_long_articles_into_services():
    from apps.services.models import Service

    for slug, getter in _SLUG_GETTERS.items():
        sections = getter()
        if not sections:
            continue
        svc = Service.objects.filter(slug=slug).first()
        if not svc:
            continue
        d = dict(svc.detail or {})
        d["content_sections"] = sections
        if len(sections) >= 6:
            d.pop("documents", None)
            d.pop("steps", None)
            d.pop("risks", None)
        if "faqs" in d and "faq" not in d:
            d["faq"] = d.pop("faqs")
        svc.detail = d
        svc.save(update_fields=["detail"])
