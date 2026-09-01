// src\components\PassageOptionsGroup.js
import React, { useState } from "react";
import ShareDropdown from "../elements/ShareDropdown";
import TranslationSelector from "../modals/TranslationSelector.js";
import BookSelector from "../modals/BookSelector.js";
import ChapterSelector from "../modals/ChapterSelector.js";
import CloseIcon from "../elements/CloseIcon";
import "../styles/PassageOptionsGroup.css";

// Дефолтні версії для заповітів (фолбек, якщо немає збережених версій)
const DEFAULT_VERSIONS = {
  OldT: ["LXX", "UTT"],
  NewT: ["TR", "UTT"],
};

const PassageOptionsGroup = ({
  lang,
  currentRef,
  setCurrentRef,
  versions,
  setVersions,
  onPrevChapter,
  onNextChapter,
  onNewPanel,
  onClosePanel,
  coreData,
  coreLoading,
  disableClose,
  localCurrentRef,
  onOpenPanelSettings,
  testamentVersions,
  setTestamentVersions,
}) => {
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showChapter, setShowChapter] = useState(false);
  const [selectedBook, setSelectedBook] = useState("GEN");
  const [selectedChapters, setSelectedChapters] = useState();

  const [book, chapter] = localCurrentRef
    ? localCurrentRef.split(".")
    : currentRef.split(".");

  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  const getTestament = (bookCode) => {
    const newTestamentBooks = [
      "MAT",
      "MRK",
      "LUK",
      "JHN",
      "ACT",
      "ROM",
      "1CO",
      "2CO",
      "GAL",
      "EPH",
      "PHP",
      "COL",
      "1TH",
      "2TH",
      "1TI",
      "2TI",
      "TIT",
      "PHM",
      "HEB",
      "JAS",
      "1PE",
      "2PE",
      "1JN",
      "2JN",
      "3JN",
      "JUD",
      "REV",
    ];
    return newTestamentBooks.includes(bookCode) ? "NewT" : "OldT";
  };

  const getBookChapters = (bookCode, version) => {
    const verData = coreData[version?.toLowerCase()];
    if (!verData) return 1;

    const newTBook = verData.NewT?.flatMap((g) => g.books).find(
      (b) => b.code === bookCode,
    );
    if (newTBook) return newTBook.chapters;

    const oldTBook = verData.OldT?.flatMap((g) => g.books).find(
      (b) => b.code === bookCode,
    );
    if (oldTBook) return oldTBook.chapters;

    console.log(`Не знайдена Book ${bookCode} для ${version}`);
    return 1;
  };

  const getMaxChaptersForBook = (bookCode, versions) => {
    let maxChapters = 1;
    versions.forEach((version) => {
      const chapters = getBookChapters(bookCode, version);
      if (chapters > maxChapters) maxChapters = chapters;
    });
    return maxChapters;
  };

  const getCurrentBookChapters = () => {
    return getMaxChaptersForBook(book, versions);
  };

  const handleSelectBookAndChapter = (bookCode, chapter) => {
    // Зберігаємо поточні версії для поточного заповіту
    const currentTestament = getTestament(book);
    if (setTestamentVersions) {
      setTestamentVersions((prev) => ({
        ...prev,
        [currentTestament]: [...versions],
      }));
    }

    // Якщо заповіт змінився - відновлюємо збережені версії для нового заповіту
    const newTestament = getTestament(bookCode);
    if (currentTestament !== newTestament) {
      const savedVersions = (testamentVersions || {})[newTestament] || [];
      setVersions(
        savedVersions.length > 0
          ? savedVersions
          : DEFAULT_VERSIONS[newTestament] || [],
      );
    }

    setCurrentRef(`${bookCode}.${chapter}`);
    setSelectedBook(bookCode);
  };

  return (
    <>
      <div className="passage-options-group">
        <div className="arg-summary-choice">
          <button
            className="custom-button-Trans"
            onClick={() => setShowTranslationModal(true)}
            title={lang.select_translations || "Оберіть переклади"}
          >
            {versions.length > 0
              ? versions.join(", ")
              : lang.no_versions || "Немає"}
          </button>
          <span className="text-muted">|</span>

          <button
            className="custom-button-choice"
            disabled={coreLoading}
            onClick={() => setShowBook(true)}
          >
            {book}
          </button>
          <span className="text-muted">|</span>

          {/* Навігація навколо кнопки розділу */}
          <div className="chapter-nav-group">
            <button
              className="custom-button-nav"
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              onClick={onPrevChapter}
              title={lang.prev_chapter}
            >
              <i className="bi bi-chevron-left fs-5"></i>
            </button>

            <button
              className="custom-button-choice chapter-ref-button"
              onClick={() => setShowChapter(true)}
            >
              {chapter}
            </button>

            <button
              className="custom-button-nav"
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              onClick={onNextChapter}
              title={lang.next_chapter}
            >
              <i
                className={`bi bi-chevron-right fs-5 transition-all ${
                  hoverNext ? "text-danger" : "text-primary"
                }`}
              ></i>
            </button>
          </div>

          <span className="text-muted">|</span>
          <button className="custom-button-choice">
            <i className="bi bi-search"></i>
          </button>
          <span className="text-muted">|</span>

          <ShareDropdown
            url={window.location.href}
            text={`${currentRef} | ${versions.join(", ")}`}
            lang={lang}
          />

          <button
            className="custom-button-nav"
            onClick={onNewPanel}
            title={lang.new_panel}
          >
            <i className="bi bi-plus-circle-fill"></i>
          </button>

          <button
            className="custom-button-nav"
            onClick={onOpenPanelSettings}
            title={lang?.panel_settings || "Налаштування панелі"}
          >
            <i className="bi bi-three-dots-vertical"></i>
          </button>

          {!disableClose && (
            <CloseIcon className="custom-button-nav" onClick={onClosePanel} />
          )}
        </div>
      </div>

      {/* Translation Selector Modal */}
      <TranslationSelector
        isOpen={showTranslationModal}
        onRequestClose={() => setShowTranslationModal(false)}
        lang={lang}
        onSelectVersions={setVersions}
        initialVersions={versions}
        currentBook={book}
      />

      <BookSelector
        isOpen={showBook}
        onRequestClose={() => setShowBook(false)}
        lang={lang}
        versions={versions}
        coreData={coreData}
        coreLoading={coreLoading}
        onSelectBook={(code) => {
          setSelectedBook(code);
          const chapters = getMaxChaptersForBook(code, versions);
          setSelectedChapters(chapters);
        }}
        onSelectBookAndChapter={handleSelectBookAndChapter}
      />

      <ChapterSelector
        isOpen={showChapter}
        onRequestClose={() => setShowChapter(false)}
        lang={lang}
        bookCode={book}
        chapters={getCurrentBookChapters()}
        onSelectChapter={(ch) => {
          setCurrentRef(`${book}.${ch}`);
        }}
      />
    </>
  );
};

export default PassageOptionsGroup;
