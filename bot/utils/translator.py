import json
import os

class Translator:
    def __init__(self):
        self.languages = {}
        self.default_lang = "en"
        
        for filename in os.listdir("bot/locales"):
            if filename.endswith(".json"):
                lang_code = filename[:-5]
                with open(f"bot/locales/{filename}", "r", encoding="utf-8") as f:
                    self.languages[lang_code] = json.load(f)

    def translate(self, key, lang=None, **kwargs):
        if not lang:
            lang = self.default_lang

        lang_data = self.languages.get(lang, self.languages[self.default_lang])
        text = lang_data.get(key, self.languages[self.default_lang].get(key, key))
        
        return text.format(**kwargs)

translator = Translator()