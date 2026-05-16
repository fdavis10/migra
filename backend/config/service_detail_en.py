"""
English overlays for `Service.detail` — aligned with Russian copy in
`apps/services/management/commands/seed_initial.py` (same structure, faithful translation).
"""

from config.service_en_loader import build_detail_en_patches

_IMG_DOCS = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80"
_IMG_MEET = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
_IMG_TEAM = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
_IMG_LAW = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
_IMG_CONS1 = "https://images.unsplash.com/photo-1521791055364-18923db94d93?auto=format&fit=crop&w=1200&q=80"
_IMG_CONS3 = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"


def _fig(src: str, alt: str, caption: str) -> dict:
    return {"type": "figure", "src": src, "alt": alt, "caption": caption}


def _p(text: str) -> dict:
    return {"type": "paragraph", "text": text}


DETAIL_EN_PIECES = {
    "rvp": {
        "why_choose": [
            "Experience with MMC Sakharovo and migration offices in Moscow and the Moscow region",
            "Repeat filings under the contract with no extra fee per attempt",
            "Fixed price in the agreement before work begins",
        ],
        "packages": [
            {"name": "Basic", "price": "32500", "description": "Preparation of the document package"},
            {"name": "Standard", "price": "49000", "description": "Package + lawyer escort"},
            {"name": "Premium", "price": "69000", "description": "Full support until the outcome"},
        ],
        "status_advantages": [
            {"title": "Duration", "text": "Up to 3 years in one federal subject of Russia"},
            {"title": "Work", "text": "No work patent required in the TRP region of issue"},
            {"title": "PRP", "text": "Basis for later permanent residence (PRP) applications"},
            {"title": "Mandatory insurance", "text": "Access to mandatory medical insurance after registration"},
        ],
        "risks": (
            "Typical risks when filing on your own: mistakes in the application, an expired passport, incorrect "
            "translation bundles, missing up-to-date certificates, missing quota or appointment deadlines with the "
            "Ministry of Internal Affairs — all of this leads to refusal and lost time. A lawyer helps minimise these risks."
        ),
        "documents": [
            "Application in the prescribed form",
            "Passport and notarised translation",
            "Medical documents from the approved list",
            "Certificate of Russian, legislation basics and history of Russia",
            "Documents proving grounds (quota, marriage, kinship, education, etc.)",
            "Receipt for payment of the state duty",
        ],
        "steps": [
            "Free consultation and review of grounds",
            "Agreement and action plan",
            "Collecting and checking documents, translations",
            "Appointment and filing with the Ministry of Internal Affairs, receiving the decision",
        ],
        "faq": [
            {
                "q": "How long is TRP valid?",
                "a": "Up to three years; it is not extended like PRP — next you apply for PRP if grounds exist.",
            },
            {
                "q": "Can I work on TRP?",
                "a": "Yes, in the federal subject where TRP was issued, without a patent; other regions require separate grounds.",
            },
            {
                "q": "What is the difference between quota and TRP without quota?",
                "a": "Quota is a limit for those without preferential grounds. Without quota applies when the law gives you a direct basis (family, education, etc.).",
            },
            {
                "q": "Where do I file in Moscow?",
                "a": "Most often MMC Sakharovo or the local migration office, depending on your situation.",
            },
        ],
        "content_sections": [
            _p(
                "Before filing it is important to check your passport validity, lawful stay, migration registration, "
                "and whether fines or administrative offences may affect the decision."
            ),
            _fig(
                _IMG_DOCS,
                "Working with documents and consultation",
                "Photo: Unsplash — preparing documents for filing",
            ),
        ],
    },
    "kvota-rvp": {
        "why_choose": [
            "Package tailored to quota commission and Ministry of Internal Affairs requirements",
            "Repeat filings under the contract if refused (unlimited case management)",
            "Fixed price in the agreement before work starts",
        ],
        "packages": [
            {
                "name": "Quota case management (Moscow and Moscow Oblast)",
                "price": "39900",
                "description": "Unlimited filings; work typically starts within ~5 business days",
            },
        ],
        "status_advantages": [
            {"title": "Movement", "text": "Lawful residence in a federal subject of Russia for the TRP period"},
            {"title": "Work", "text": "Employment without a patent in the TRP region"},
            {"title": "Sole proprietor / self-employed", "text": "Option to register entrepreneurial activity where applicable"},
            {"title": "Insurance & PRP", "text": "Access to mandatory insurance; PRP later if legal conditions are met"},
        ],
        "risks": (
            "Quota refusal is possible for an unspent or recognised conviction, serious administrative offences in the last year, "
            "forged documents, unlawful stay, passport expiring less than six months before filing, unreliable information, "
            "tax evasion with declared income, and other cases expressly listed in legislation."
        ),
        "documents": [
            "Application in the prescribed form",
            "Passport and notarised translation",
            "Work patent or other work permission — if applicable to your status",
            "Employment contract and seniority documents (when proving lawful employment)",
            "Documents on relatives in Russia (if applicable)",
            "Diploma / certificate of study at an accredited institution",
            "Migration card and detachable registration notifications",
            "Income statements and, if required, deposit certificates from licensed Russian banks",
        ],
        "steps": [
            "Request: you leave contacts, we schedule a consultation",
            "Consultation (in office, online or by phone) — review of grounds and risks",
            "Agreement: we fix scope of work and price",
            "Handover: you provide available certificates and passport data",
            "Preparation: missing documents, translations, booking with the Ministry of Internal Affairs",
            "Filing with the migration authority by appointment; lawyer escort if needed",
        ],
        "faq": [
            {
                "q": "Can a quota be “bought”?",
                "a": "No. The commission allocates quota on lawful grounds. We prepare documents and support a lawful procedure.",
            },
            {
                "q": "When can I re-apply after refusal?",
                "a": "Deadlines depend on the reason for refusal and the region; we advise after reviewing your decision and current rules.",
            },
            {
                "q": "How do I know the quota was approved?",
                "a": "Usually at the territorial Ministry of Internal Affairs office where you filed; you can also check lists at the migration unit.",
            },
            {
                "q": "Who can obtain TRP without quota?",
                "a": "The law lists categories: marriage to a Russian citizen, minor children who are Russian citizens, Russian parents, "
                "birth on RSFSR territory, studies in Russia, citizens of certain states in statutory cases, etc. If no ground fits — quota is required.",
            },
        ],
        "content_sections": [
            _p(
                "Quota is distributed by month each year: it is important to arrive with a correct package and avoid formal "
                "errors in the application — those are the most common reasons for refusal."
            ),
            _p(
                "Applicants may include, among others, specialists in in-demand professions, persons with lawful work history in Russia, "
                "students at state-accredited institutions, property owners in Russia, persons with confirmed income and deposits in Russian banks, "
                "graduates with recognised diplomas, and foreign nationals whose close relatives hold PRP or Russian citizenship — the full list "
                "depends on the law and your documents."
            ),
            _fig(
                _IMG_MEET,
                "Consultation and document work",
                "Photo: Unsplash — reviewing your situation and document package",
            ),
            _p(
                "Migration legislation is updated regularly: we track changes to lists, application forms and certificate requirements "
                "so the package matches the rules in force on the filing date."
            ),
            _fig(
                _IMG_TEAM,
                "Team preparation for filing",
                "Photo: Unsplash — team preparation for filing",
            ),
        ],
    },
    "vnzh": {
        "why_choose": [
            'Personalised plan for the «Permanent residence (PRP)» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Application (2 copies)",
            "State duty receipt 6,000 ₽ (from 01.07.2024)",
            "Passport (valid at least 2 months at filing)",
            "Four photos 35×45 mm",
            "Proof of housing",
            "Certificate of Russian language, history and legislation",
            "Criminal record certificate (age 14+)",
            "Proof of income",
        ],
        "faq": [
            {"q": "How long is PRP valid?", "a": "Indefinite since 2019, but annual notification is mandatory."},
            {
                "q": "Can I apply without TRP?",
                "a": (
                    "Yes, for several categories (native Russian speakers, highly qualified specialists, "
                    "honours graduates, Belarus citizens, etc.)."
                ),
            },
            {"q": "How long does it take?", "a": "Usually 2–4 months."},
            {"q": "Can I work in other regions?", "a": "Yes, after registration within 7 days."},
            {"q": "What happens without notification?", "a": "Risk of PRP cancellation."},
        ],
        "risks": (
            "When filing alone, refusals are common due to application mistakes, outdated certificates, unconfirmed income, "
            "or missing the notification deadline — legal support helps reduce these risks."
        ),
        "content_sections": [
            _p(
                "Before filing it is important to confirm lawful stay, passport validity, income source and housing — "
                "these determine the document set and which Ministry of Internal Affairs office to use."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
            _p(
                "We anticipate inspector questions and prepare explanations for sensitive points: gaps in employment record, "
                "name changes, children from different marriages, employer changes, etc."
            ),
            _fig(
                _IMG_DOCS,
                "Document preparation",
                "Photo: Unsplash — document preparation",
            ),
        ],
        "packages": [
            {"name": "Basic", "price": "32500", "description": "Package preparation"},
            {"name": "Standard", "price": "49000", "description": "Package + escort"},
            {"name": "Premium", "price": "69000", "description": "Full support"},
        ],
        "status_advantages": [
            {"title": "Stay", "text": "Indefinite since 2019, annual notification"},
            {"title": "Work", "text": "In any region of Russia"},
            {"title": "Healthcare", "text": "Mandatory medical insurance"},
            {"title": "Pension & benefits", "text": "Full access"},
        ],
    },
    "grazhdanstvo": {
        "why_choose": [
            'Personalised plan for the «Citizenship of Russia» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Application in the prescribed form",
            "Passport and notarised translation",
            "PRP and documents proving lawful residence",
            "Exam certificates for Russian and fundamentals of Russian legislation",
            "Criminal record certificate and other certificates per the list on the filing date",
            "State duty receipt",
        ],
        "faq": [
            {
                "q": "Do I have to renounce my previous citizenship?",
                "a": "No — dual citizenship is allowed for most foreign nationals obtaining a Russian passport.",
            },
            {
                "q": "After how many years can I apply?",
                "a": "Usually after 5 years of continuous residence on PRP; other periods apply for simplified categories under the law.",
            },
            {
                "q": "What is simplified procedure?",
                "a": "For native Russian speakers, compatriots, state resettlement programme participants, etc. — the list is set in legislation.",
            },
        ],
        "risks": (
            "Mistakes in the questionnaire, missed deadlines or an incomplete package lead to refusal and lost time; "
            "legal support helps you move forward without unnecessary delay."
        ),
        "content_sections": [
            _p(
                "Every case is unique: we consider prior citizenship, family status, military registration, tax history, "
                "and grounds for simplified procedure."
            ),
            _fig(
                _IMG_TEAM,
                "Client support",
                "Photo: Unsplash — client support",
            ),
            _p(
                "We check criminal record certificates in advance, military ID (for men of certain ages), income documents, "
                "and lawful stay from entry through filing."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
        ],
        "packages": [
            {"name": "Basic", "price": "32500", "description": "Package preparation"},
            {"name": "Standard", "price": "49000", "description": "Package + escort"},
            {"name": "Premium", "price": "69000", "description": "Full support"},
        ],
        "steps_timeline": ["TRP", "PRP", "Citizenship"],
    },
    "pasport-rf": {
        "why_choose": [
            'Personalised plan for the «Internal passport of Russia» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Application for passport issuance",
            "Birth or marriage certificate — if data changed",
            "Passport photos",
            "State duty receipt",
            "Document confirming Russian citizenship",
        ],
        "faq": [
            {
                "q": "How long to receive the passport?",
                "a": "Usually from a few days to a couple of weeks — depends on the Ministry of Internal Affairs office.",
            },
            {
                "q": "Is the oath required before the passport?",
                "a": "The order depends on how you obtained citizenship; we explain at consultation.",
            },
        ],
        "risks": (
            "Incorrect data or expired certificates lead to documents being returned and a new appointment."
        ),
        "content_sections": [
            _p(
                "Processing times depend on office workload; it is important to check military registration in advance "
                "and whether outstanding obligations affect issuance."
            ),
            _fig(
                _IMG_DOCS,
                "Document preparation",
                "Photo: Unsplash — document preparation",
            ),
            _p(
                "If your surname or details changed after naturalisation, we prepare a consistent package to avoid mismatches "
                "between the citizenship decision and the passport application."
            ),
            _fig(
                _IMG_MEET,
                "Consultation and case review",
                "Photo: Unsplash — consultation and case review",
            ),
        ],
    },
    "rnr": {
        "why_choose": [
            'Personalised plan for the «Employer-issued work permit» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Employer application",
            "Employment contract with the foreign specialist",
            "Qualification and education documents with translation",
            "Passport and migration documents of the applicant",
            "State duty receipts per the list on the filing date",
        ],
        "faq": [
            {
                "q": "How long is the work permit valid?",
                "a": "Tied to the contract and category; confirmed for each case.",
            },
            {
                "q": "Can filing be done remotely?",
                "a": "Some steps may be done by representative under power of attorney — details at consultation.",
            },
        ],
        "risks": (
            "Mismatch between position and qualifications or errors in quota requests often lead to refusal."
        ),
        "content_sections": [
            _p(
                "The procedure includes verification of qualifications, contract, hiring grounds, and correctness of passport and diploma translations."
            ),
            _fig(
                _IMG_MEET,
                "Consultation and case review",
                "Photo: Unsplash — consultation and case review",
            ),
            _p(
                "Deadlines depend on specialist category and region; we assess refusal risks in advance and prepare additional explanations for the authority."
            ),
            _fig(
                _IMG_TEAM,
                "Team support",
                "Photo: Unsplash — team support",
            ),
        ],
    },
    "zapret-na-vezd": {
        "why_choose": [
            'Personalised plan for the «Appealing an entry ban» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Copy of the entry-ban decision (if available)",
            "Passport and migration documents",
            "Evidence supporting your circumstances",
            "Power of attorney if a representative handles the case",
        ],
        "faq": [
            {"q": "Can the ban be lifted early?", "a": "It depends on the ground and term; we assess after reviewing the file."},
            {"q": "How long do court stages take?", "a": "Usually several months; depends on the court and region."},
        ],
        "risks": "Filing without analysing the decision often ends in a formal refusal.",
        "content_sections": [
            _p(
                "First it is important to establish the exact date and wording of the ban — that determines strategy: "
                "administrative appeal, lawsuit, or a combined route."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
            _p(
                "We collect evidence of lawful stay, medical and family circumstances where relevant to mitigating consequences."
            ),
            _fig(
                _IMG_DOCS,
                "Document preparation",
                "Photo: Unsplash — document preparation",
            ),
        ],
        "appeal_stages": [
            {"title": "Legal analysis", "price": "18000", "duration": "7 days"},
            {"title": "Appeal", "price": "68000", "duration": "2–4 mo."},
            {"title": "Application to the Ministry of Internal Affairs", "price": "24000", "duration": "1 mo."},
        ],
    },
    "deportaciya": {
        "why_choose": [
            'Personalised plan for the «Appealing deportation» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Copy of deportation and related orders",
            "Passport and migration documents",
            "Evidence supporting your circumstances",
            "Power of attorney if a representative handles the case",
        ],
        "faq": [
            {
                "q": "What is the appeal deadline?",
                "a": "Depends on the type of decision; we confirm immediately after reviewing documents.",
            },
            {
                "q": "Can I stay in Russia while the case is pending?",
                "a": "Sometimes yes; we assess under specific rules and your status.",
            },
        ],
        "risks": (
            "Missing the appeal deadline or an incomplete set of arguments often leads to refusal without review on the merits."
        ),
        "content_sections": [
            _p(
                "Deportation may be challenged if the decision procedure, notification deadlines, or all circumstances of the case were not properly considered."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
            _p(
                "We collect evidence of lawful stay, family and medical circumstances where they affect how a court or superior body assesses the case."
            ),
            _fig(
                _IMG_DOCS,
                "Document preparation",
                "Photo: Unsplash — document preparation",
            ),
        ],
    },
    "vydvorenie": {
        "why_choose": [
            'Personalised plan for the «Appealing administrative removal» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Removal decision and related acts",
            "Passport, visa, migration card, patent or other lawful status",
            "Documents supporting your arguments",
            "Representative’s power of attorney",
        ],
        "faq": [
            {"q": "How long does review take?", "a": "Depends on the instance; we give estimates after analysing the case."},
            {
                "q": "Is personal attendance required?",
                "a": "Some steps may be done under power of attorney; we agree details in advance.",
            },
        ],
        "risks": (
            "Self-filing without legal analysis often misses procedural requirements and deadlines."
        ),
        "content_sections": [
            _p(
                "We first analyse the grounds for removal and completeness of the case file — that determines strategy: "
                "complaint to a superior, lawsuit, or both."
            ),
            _fig(
                _IMG_MEET,
                "Consultation",
                "Photo: Unsplash — consultation",
            ),
            _p(
                "We help document evidence of lawful stay, employment and family ties to Russia where relevant to your situation."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
        ],
    },
    "vremennoe-ubezhishhe": {
        "why_choose": [
            'Personalised plan for the «Temporary asylum (TA)» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Application in the prescribed form",
            "Identity documents (if any)",
            "Materials supporting the circumstances of the application",
            "Translations — as required by the authority",
        ],
        "faq": [
            {
                "q": "How does TA differ from refugee status?",
                "a": "Different legal regimes and procedures; we choose the appropriate option at consultation.",
            },
            {"q": "Can I apply with children?", "a": "Yes; minors have special rules — we clarify for your case."},
        ],
        "risks": (
            "Inaccuracies in the application or an incomplete package often lead to delay or refusal on formal grounds."
        ),
        "content_sections": [
            _p(
                "A TA application is filed under established rules; it is important to present facts consistently and attach supporting materials where possible."
            ),
            _fig(
                _IMG_TEAM,
                "Support at filing",
                "Photo: Unsplash — support at filing",
            ),
            _p(
                "We explain procedure stages, timelines and your rights at each step to reduce stress and formal refusal risks."
            ),
            _fig(
                _IMG_DOCS,
                "Documents",
                "Photo: Unsplash — documents",
            ),
        ],
    },
    "ustanovlenie-lichnosti": {
        "why_choose": [
            'Personalised plan for the «Identity establishment» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Any available documents on identity and stay",
            "Witness statements and certificates — as agreed",
            "Applications and motions — we draft them",
            "Power of attorney — when acting through a representative",
        ],
        "faq": [
            {
                "q": "How long does the procedure take?",
                "a": "Depends on completeness of materials and region; we give estimates after initial analysis.",
            },
            {
                "q": "What after identity is established?",
                "a": "Usually a path opens to the next status — TRP, temporary asylum, etc.; we plan together with you.",
            },
        ],
        "risks": (
            "Substituting facts or providing unreliable information leads to refusal and may entail liability."
        ),
        "content_sections": [
            _p(
                "Without identity documents you cannot lawfully continue TRP, PRP or other statuses. Identity establishment is a separate procedure with strict evidence rules."
            ),
            _fig(
                _IMG_DOCS,
                "Documents",
                "Photo: Unsplash — documents",
            ),
            _p(
                "We help collect admissible evidence, draft motions and interact with authorities within the law."
            ),
            _fig(
                _IMG_MEET,
                "Consultation",
                "Photo: Unsplash — consultation",
            ),
        ],
    },
    "rvpo": {
        "why_choose": [
            'Personalised plan for the «TRP for studies (TRP-O)» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Invitation / certificate from the educational organisation",
            "Passport and translation",
            "Medical and other documents — per the checklist for your case",
            "Photos and receipts — per filing requirements",
        ],
        "faq": [
            {
                "q": "Can I work on TRP-O?",
                "a": "Employment rules depend on current norms; we explain at consultation.",
            },
            {
                "q": "What if I transfer to another university?",
                "a": "Notifications and document updates may be required; we explain the procedure.",
            },
        ],
        "risks": (
            "Mismatched timelines between the university and migration procedure often disrupt enrolment."
        ),
        "content_sections": [
            _p(
                "The key document is the university’s basis; in parallel we prepare the application and supporting certificates under current requirements."
            ),
            _fig(
                _IMG_MEET,
                "Consultation",
                "Photo: Unsplash — consultation",
            ),
            _p(
                "We support filing and interaction with authorities and explain next steps after TRP-O is granted."
            ),
            _fig(
                _IMG_TEAM,
                "Support",
                "Photo: Unsplash — support",
            ),
        ],
    },
    "repatriaciya": {
        "why_choose": [
            'Personalised plan for the «Repatriation to Russia» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Documents on ancestry and ancestors' citizenship",
            "Documents on language proficiency and ties to Russia — per programme requirements",
            "Marriage and birth certificates — when including family",
            "Foreign passport, photos, receipts — per filing checklist",
        ],
        "faq": [
            {
                "q": "How long do the stages take?",
                "a": "Depends on the region and completeness of documents; we give estimates after reviewing your case.",
            },
            {
                "q": "Do I need to come to Russia before the decision?",
                "a": "Depends on the procedure chosen; we discuss at consultation.",
            },
        ],
        "risks": (
            "Errors proving compatriot status or missing mandatory documents extend timelines or lead to refusal."
        ),
        "content_sections": [
            _p(
                "Repatriation is a simplified route for eligible compatriots and their families. We prepare evidence and filing steps under current rules."
            ),
            _fig(
                _IMG_DOCS,
                "Documents",
                "Photo: Unsplash — documents",
            ),
            _p(
                "We align the file with programme requirements and coordinate appointments with competent bodies."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
        ],
    },
    "bezhencz": {
        "why_choose": [
            'Personalised plan for the «Refugee status» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Application for refugee status",
            "Identity documents — if any",
            "Materials supporting persecution or danger",
            "Translations — as required",
        ],
        "faq": [
            {
                "q": "How does refugee status differ from temporary asylum?",
                "a": "Different legal consequences and procedures; we choose the best route at consultation.",
            },
            {
                "q": "Can a refusal be appealed?",
                "a": "In some cases yes; we assess after reviewing the decision.",
            },
        ],
        "risks": (
            "Contradictions in statements or incomplete explanations complicate review of the application."
        ),
        "content_sections": [
            _p(
                "Refugee status requires proof under the statutory test. We help prepare the file and accompany procedural steps."
            ),
            _fig(
                _IMG_TEAM,
                "Support",
                "Photo: Unsplash — support",
            ),
            _p(
                "We structure the narrative and documents so the authority can verify grounds efficiently."
            ),
            _fig(
                _IMG_MEET,
                "Consultation",
                "Photo: Unsplash — consultation",
            ),
        ],
    },
    "vyhod-iz-grazhdanstva": {
        "why_choose": [
            'Personalised plan for the «Renunciation of Russian citizenship» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Internal passport of Russia",
            "Foreign passport of Russia — if any",
            "Documents on grounds for exit (second citizenship, application, etc. — depending on situation)",
            "State duty receipt",
        ],
        "faq": [
            {"q": "How long does review take?", "a": "Depends on the authority and completeness; estimates after analysis."},
            {"q": "Is personal attendance required?", "a": "Often yes for certain steps; we clarify for your region."},
        ],
        "risks": (
            "Concealing obligations or providing unreliable information may lead to refusal or legal consequences."
        ),
        "content_sections": [
            _p(
                "Renunciation follows a strict procedure. We help prepare documents and accompany filings with competent bodies."
            ),
            _fig(
                _IMG_LAW,
                "Legal support",
                "Photo: Unsplash — legal support",
            ),
            _p(
                "We check consistency between civil-registry records, passports and applications to avoid returns for correction."
            ),
            _fig(
                _IMG_DOCS,
                "Documents",
                "Photo: Unsplash — documents",
            ),
        ],
    },
    "patent": {
        "why_choose": [
            'Personalised plan for the «Work patent (full package)» service',
            "Fixed stages and estimate in the contract",
            "Experience with migration authorities and courts",
        ],
        "steps": [
            "Request and first contact",
            "Consultation: review of documents and grounds",
            "Agreement and package preparation",
            "Filing with authorities / participation in procedures",
            "Receiving the outcome and explaining next steps",
        ],
        "documents": [
            "Passport and migration card / visa",
            "SNILS — if required for your region",
            "Photos",
            "Employer contacts — if required for the patent",
        ],
        "faq": [
            {
                "q": "Is the medical exam included in the price?",
                "a": "The “full” package covers escort for all typical stages; details are in the agreement.",
            },
            {
                "q": "How long is the patent valid?",
                "a": "Up to one year with renewal under regional rules; we advise timelines for your case.",
            },
        ],
        "risks": (
            "Filing with expired documents or without required certificates leads to refusal and fines."
        ),
        "content_sections": [
            _p(
                "First we verify work region, entry dates and medical / exam requirements — they may differ."
            ),
            _fig(
                _IMG_TEAM,
                "Process support",
                "Photo: Unsplash — process support",
            ),
            _p(
                "We prepare the set for MMC / Ministry of Internal Affairs, book medical exam and testing, and monitor payment of duties and insurance."
            ),
            _fig(
                _IMG_DOCS,
                "Documents",
                "Photo: Unsplash — documents",
            ),
        ],
    },
    "konsultaciya": {
        "why_choose": [
            "Lawyers with experience in migration agencies and MMC",
            "A clear plan without filler — only what applies to your case",
            "In office, by video call or by phone",
        ],
        "steps": [
            "Booking: you choose a convenient format and time",
            "You send scans or bring documents from the list",
            "Consultation: review of status, timelines and legalisation options",
            "Written summary and plan — on request after the meeting",
            "If you wish — agreement for full support",
        ],
        "documents": [
            "Passport",
            "Migration stamps, patent, TRP/PRP — whatever you have",
            "Government decisions and refusals — if any",
            "Employment contract or employer certificate — if relevant to status",
        ],
        "risks": (
            "Without a full document set at the first meeting some questions remain open — we recommend sending scans in advance per the booking checklist."
        ),
        "content_sections": [
            _p(
                "At the consultation we do not limit ourselves to general remarks about the law: we review your entry history, "
                "grounds for legalisation, quotas and quota categories, family status, employment contract if it matters for status, "
                "and possible “bottlenecks” in documents."
            ),
            _fig(
                _IMG_CONS1,
                "Discussing agreement and documents",
                "Photo: Unsplash — business meeting and document work",
            ),
            _p(
                "If you are only planning relocation or are already in Russia, we explain the difference between a work patent, TRP and PRP "
                "in the context of your goal — work, studies, family reunification, citizenship on simplified grounds. "
                "We advise which certificates and translations you need and where to order them to save time."
            ),
            _fig(
                _IMG_LAW,
                "Specialist preparing for consultation",
                "Photo: Unsplash — preparing for client consultation",
            ),
            _p(
                "After the conversation you may sign an agreement for full support immediately or return later — we can record "
                "arrangements in a written summary on request. Our goal is that you leave with a clear picture and without pressure."
            ),
            _fig(
                _IMG_CONS3,
                "Working on applications",
                "Photo: Unsplash — preparing and checking applications",
            ),
        ],
        "faq": [
            {
                "q": "How long is the consultation?",
                "a": "Usually 30–45 minutes. For complex cases we can arrange an extended format in advance.",
            },
            {
                "q": "Do I need to come to the office?",
                "a": "No — online and phone are available. In-person is optional by appointment.",
            },
            {
                "q": "What should I bring to the first meeting?",
                "a": "Passport, migration stamps, decisions/refusals if any. We send the exact list after you book.",
            },
        ],
    },
}

for __slug, __patch in build_detail_en_patches().items():
    if __slug in DETAIL_EN_PIECES:
        DETAIL_EN_PIECES[__slug] = {**DETAIL_EN_PIECES[__slug], **__patch}
