import assert from "node:assert/strict";
import test from "node:test";
import { dictionaries, LANGUAGES, type Lang } from "../lib/i18n/dictionaries";
import { languageDirection, languageFromBrowser, resolveLanguagePreference } from "../lib/i18n/preference";
import { transliterateHindi } from "../lib/i18n/transliteration";
import { generateDraft } from "../lib/ai/drafts";
import { respond } from "../lib/ai/engine";

test("manual language choice takes precedence over account, storage, and browser preferences", () => {
  assert.equal(resolveLanguagePreference({
    manual: "hi", account: "en", stored: "bn", browser: "te",
  }), "hi");
});

test("account preference takes precedence over local and browser preferences", () => {
  assert.equal(resolveLanguagePreference({
    account: "mr", stored: "bn", browser: "te",
  }), "mr");
});

test("browser preference is used only when no manual, account, or stored language exists", () => {
  assert.equal(resolveLanguagePreference({ browser: "ta-IN" }), "ta");
  assert.equal(languageFromBrowser("hi-Latn-IN"), "hi-Latn");
  assert.equal(languageFromBrowser("fr-FR"), null);
});

test("all registered languages have a dictionary and Hinglish remains Roman script", () => {
  assert.equal(LANGUAGES.length, 14);
  for (const { code } of LANGUAGES) assert.ok(dictionaries[code]);
  const sample = dictionaries["hi-Latn"].hero.subtitle;
  assert.match(sample, /[A-Za-z]/);
  assert.doesNotMatch(sample, /[\u0900-\u097f]/);
  assert.equal(transliterateHindi("नमस्ते"), "namaste");
});

test("Urdu is the only right-to-left application locale", () => {
  assert.equal(languageDirection("ur"), "rtl");
  assert.equal(languageDirection("hi-Latn"), "ltr");
});

test("complaint drafts are generated in Roman Hindi for Hinglish", () => {
  const draft = generateDraft({
    category: "WATER",
    description: "Paani supply band hai.",
    language: "hi-Latn",
  });
  assert.match(draft.body, /Shikayatkarta/);
  assert.doesNotMatch(draft.body, /[\u0900-\u097f]/);
});

test("AI replies retain the selected locale and script for every supported language", () => {
  for (const { code } of LANGUAGES) {
    const response = respond({ message: "hello", preferredLang: code });
    assert.equal(response.language, code);
    assert.ok(response.text.trim(), `Empty AI greeting for ${code}`);
  }
  const english = respond({ message: "hello", preferredLang: "en" }).text;
  assert.doesNotMatch(english, /[\u0900-\u097f]/);
  const hindi = respond({ message: "hello", preferredLang: "hi" }).text;
  assert.match(hindi, /[\u0900-\u097f]/);
  const hinglish = respond({ message: "hello", preferredLang: "hi-Latn" }).text;
  assert.doesNotMatch(hinglish, /[\u0900-\u097f]/);
});

test("every supported language has the same dictionary shape and non-empty messages", () => {
  const flatten = (value: unknown, prefix = "", result = new Map<string, string>()) => {
    if (typeof value === "string") result.set(prefix, value);
    else if (Array.isArray(value)) value.forEach((child, index) => flatten(child, `${prefix}[${index}]`, result));
    else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, result);
    }
    return result;
  };
  const baseKeys = [...flatten(dictionaries.en).keys()].sort();
  for (const language of Object.keys(dictionaries) as Lang[]) {
    const entries = flatten(dictionaries[language]);
    assert.deepEqual([...entries.keys()].sort(), baseKeys, `Dictionary shape mismatch for ${language}`);
    assert.ok([...entries.values()].every((value) => value.trim()), `Empty translation in ${language}`);
  }
});
