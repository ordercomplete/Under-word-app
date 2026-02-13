// src/utils/translationUtils.js був розроблений для роботи історії відвідувань
export const translationUtils = {
  /**
   * Перевіряє чи є версія оригіналом
   */
  isOriginal(version) {
    if (!version) return false;
    // Беремо з глобального конфігу, а не з хардкоду
    const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
    const bible = bibles.find((b) => b.initials === version.toUpperCase());
    return bible?.type === "original";
  },

  /**
   * Отримує заповіти для версії
   */
  getTestaments(version) {
    if (!version) return [];
    const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
    const bible = bibles.find((b) => b.initials === version.toUpperCase());
    return bible?.testaments || [];
  },

  /**
   * Перевіряє чи підтримує версія заповіт
   */
  supportsTestament(version, testament) {
    const testaments = this.getTestaments(version);
    return testaments.includes(testament);
  },

  /**
   * Отримує сумісні версії для заповіту
   */
  getCompatibleVersions(versions, targetTestament) {
    return versions.filter((v) => {
      const testaments = this.getTestaments(v);
      return testaments.includes(targetTestament);
    });
  },

  /**
   * Отримує оригінал для перекладу в конкретному заповіті
   */
  getOriginalForTranslation(translation, testament) {
    const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];
    const bible = bibles.find((b) => b.initials === translation.toUpperCase());
    if (!bible?.basedOn) return null;

    return testament === "OldT"
      ? bible.basedOn.old_testament
      : bible.basedOn.new_testament;
  },

  /**
   * Отримує дефолтні версії для заповіту
   */
  getDefaultVersions(testament) {
    const bibles = window.__TRANSLATIONS_DATA__?.bibles || [];

    // Оригінали для заповіту
    const originals = bibles
      .filter((b) => b.type === "original" && b.testaments.includes(testament))
      .map((b) => b.initials);

    // Переклади UTT/UBT для заповіту
    const translations = bibles
      .filter(
        (b) =>
          b.type === "translation" &&
          b.testaments.includes(testament) &&
          (b.initials === "UTT" || b.initials === "UBT"),
      )
      .map((b) => b.initials);

    return {
      originals: originals[0] || null,
      translations: translations,
      all: [...originals, ...translations],
    };
  },
};
