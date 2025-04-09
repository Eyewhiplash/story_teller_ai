import { useLanguage } from '../contexts/LanguageContext'
import sv from '../translations/sv'
import en from '../translations/en'

const translations = {
  sv,
  en
}

export function useTranslation() {
  const { language } = useLanguage()

  const t = (key) => {
    const translation = translations[language]?.[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }
    return translation
  }

  return { t, language }
} 