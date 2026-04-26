def h2(text):
    return {"type": "heading", "level": 2, "text": text}


def h3(text):
    return {"type": "heading", "level": 3, "text": text}


def p(text):
    return {"type": "paragraph", "text": text}


def ul(*items):
    return {"type": "list", "ordered": False, "items": [x for x in items if x]}


def ol(*items):
    return {"type": "list", "ordered": True, "items": [x for x in items if x]}
