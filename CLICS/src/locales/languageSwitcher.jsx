import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex gap-2 p-2">
      <button
        className={i18n.language?.startsWith('en') ? 'font-semibold underline' : ''}
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('language.english', 'English')}
      </button>
      <button
        className={i18n.language?.startsWith('ur') ? 'font-semibold underline' : ''}
        onClick={() => i18n.changeLanguage('ur')}
      >
        {t('language.urdu', 'اردو')}
      </button>
    </div>
  );
}
