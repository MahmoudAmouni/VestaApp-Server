import spacy
from rest_framework.exceptions import ValidationError

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

FORBIDDEN_WORDS = {
    "database", "sql", "db", "query", 
    "forget", "ignore", "system", "prompt", 
    "function", "python", "import", "exec", "eval"
}

def validate_input_content(text: str):
    doc = nlp(text.lower())
    
    found_forbidden = []
    for token in doc:
        if token.lemma_ in FORBIDDEN_WORDS or token.text in FORBIDDEN_WORDS:
            found_forbidden.append(token.text)
            
    if found_forbidden:
        raise ValidationError(f"Input contains forbidden words: {', '.join(found_forbidden)}")
