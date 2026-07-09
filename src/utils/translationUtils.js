// src/utils/translationUtils.js — динамічний доступ до translations.json
// ВСІ методи використовують window.__TRANSLATIONS_DATA__ замість хардкоду

const getBibles = () => window.__TRANSLATIONS_DATA__?.bibles || [];

const findBible = (version) => {
  if (!version) return null;
  return getBibles().find((b) => b.initials === version.toUpperCase()) || null;
};

export const translationUtils = {
  /**
   * Перевіряє чи є версія оригіналом
   */
  isOriginal(version) {
    return findBible(version)?.type === "original";
  },

  /**
   * Отримує об'єкт Bible з translations.json по ініціалах
   */
  getBibleInfo(version) {
    return findBible(version);
  },

  /**
   * Отримує заповіти для версії
   */
  getTestaments(version) {
    return findBible(version)?.testaments || [];
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
   * Отримує список всіх оригіналів (версій з type === "original")
   */
  getOriginalsList() {
    return getBibles()
      .filter((b) => b.type === "original")
      .map((b) => b.initials);
  },

  /**
   * Перевіряє чи є initials в списку оригіналів
   */
  isOriginalInitials(initials) {
    if (!initials) return false;
    return this.getOriginalsList().includes(initials.toUpperCase());
  },

  /**
   * Отримує мову для версії
   */
  getLang(version) {
    return findBible(version)?.lang || "";
  },

  /**
   * Отримує шлях до даних версії (поле path з translations.json)
   */
  getPathForVersion(version) {
    return findBible(version)?.path || "";
  },

  /**
   * Визначає base path для завантаження: "originals" або "translations"
   */
  getBaseType(version) {
    return this.isOriginal(version) ? "originals" : "translations";
  },

  /**
   * Отримує оригінал для перекладу в конкретному заповіті
   */
  getOriginalForTranslation(translation, testament) {
    const bible = findBible(translation);
    if (!bible?.basedOn) return null;

    return testament === "OldT"
      ? bible.basedOn.old_testament
      : bible.basedOn.new_testament;
  },

  /**
   * Отримує дефолтні версії для заповіту
   */
  getDefaultVersions(testament) {
    const bibles = getBibles();

    const originals = bibles
      .filter(
        (b) =>
          b.type === "original" &&
          b.testaments.includes(testament) &&
          b.isDefault,
      )
      .map((b) => b.initials);

    const translations = bibles
      .filter(
        (b) =>
          b.type === "translation" &&
          b.testaments.includes(testament) &&
          b.isDefault,
      )
      .map((b) => b.initials);

    return {
      originals: originals[0] || null,
      translations: translations,
      all: [...originals, ...translations],
    };
  },
};

export default translationUtils;
