import en from '@/languages/en.json';
import es from '@/languages/es.json';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
    en,
    es
};
const i18n = new I18n(translations);
// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0]?.languageCode ?? 'en';
// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
const deviceLanguage = i18n.locale;

/**
 * Retrieves the localized text for a given key.
 *
 * This function uses the current locale to retrieve the corresponding text from the language dictionary.
 * If the key is not found in the current locale, it falls back to other languages with the key present.
 *
 * @param key The key of the text to retrieve.
 * @returns The localized text for the given key, or the key itself if no translation is found.
 */
const getLocalizedText = (key: string): string => i18n.t(key);

export { deviceLanguage, getLocalizedText };