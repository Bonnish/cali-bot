import json
import os

class Translator:
    def __init__(self):
        self.languages = {}
        self.default_lang = "en"
        
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        locales_dir = os.path.join(base_dir, "locales")
        for filename in os.listdir(locales_dir):
            if filename.endswith(".json"):
                lang_code = filename[:-5]
                with open(os.path.join(locales_dir, filename), "r", encoding="utf-8") as f:
                    self.languages[lang_code] = json.load(f)

    def translate(self, key, lang=None, **kwargs):
        if not lang:
            lang = self.default_lang

        lang_data = self.languages.get(lang, self.languages[self.default_lang])
        text = lang_data.get(key, self.languages[self.default_lang].get(key, key))
        
        return text.format(**kwargs)

translator = Translator()