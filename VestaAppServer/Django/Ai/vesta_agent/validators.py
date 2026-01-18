import spacy
from rest_framework.exceptions import ValidationError

# Load model once at module level
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback or need to ensure download happens. 
    # For now, assuming it's downloaded via the command ran.
    # In prod, this should be handled in entrypoint.
    import en_core_web_sm
    nlp = en_core_web_sm.load()

FORBIDDEN_WORDS = {
    "database", "sql", "db", "query", 
    "forget", "ignore", "system", "prompt", 
    "function", "python", "import", "exec", "eval"
}

def validate_input_content(text: str):
    """
    Validates that the input text does not contain forbidden words using SpaCy.
    Raises ValidationError if forbidden words are found.
    """
    doc = nlp(text.lower())
    
    found_forbidden = []
    for token in doc:
        # Check lemma to catch plurals like 'databases'
        if token.lemma_ in FORBIDDEN_WORDS or token.text in FORBIDDEN_WORDS:
            found_forbidden.append(token.text)
            
    if found_forbidden:
        raise ValidationError(f"Input contains forbidden words: {', '.join(found_forbidden)}")
