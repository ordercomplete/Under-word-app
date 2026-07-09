// src\components\PassageOptionsGroup.js
import React, { useState } from "react";
import ShareDropdown from "../elements/ShareDropdown";
import TranslationSelector from "../modals/TranslationSelector.js";
import BookSelector from "../modals/BookSelector.js";
import ChapterSelector from "../modals/ChapterSelector.js";
import CloseIcon from "../elements/CloseIcon";
import "../styles/PassageOptionsGroup.css";

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
}) => {
  // console.log(
  //   "Panel: 1-PassageOptionsGroup coreData keys:",
  //   Object.keys(coreData || {})
  // );
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

  // Функція для визначення заповіту
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

  // Функція для отримання кількості розділів поточної книги
  const getCurrentBookChapters = () => {
    return getMaxChaptersForBook(book, versions); // використовуємо функцію з попереднього варіанту
  };

  // Нова функція для вибору книги + розділу
  const handleSelectBookAndChapter = (bookCode, chapter) => {
    setCurrentRef(`${bookCode}.${chapter}`);
    setSelectedBook(bookCode);
    // Опціонально: оновити chapters, якщо потрібно
  };

  // Додайте цю функцію всередині компонента перед return 24.12.15
  const getBookChapters = (bookCode, version) => {
    const verData = coreData[version?.toLowerCase()];
    if (!verData) return 1;

    // 1. Шукаємо в NewT
    const newTBook = verData.NewT?.flatMap((g) => g.books).find(
      (b) => b.code === bookCode,
    );
    if (newTBook) return newTBook.chapters;

    // 2. Шукаємо в OldT
    const oldTBook = verData.OldT?.flatMap((g) => g.books).find(
      (b) => b.code === bookCode,
    );
    if (oldTBook) return oldTBook.chapters;

    // 3. Якщо не знайдено
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
  return (
    <>
      <div className="passage-options-group">
        {/* argSummary */}
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
          <button
            className="custom-button-choice"
            onClick={() => setShowChapter(true)}
          >
            {chapter}
          </button>

          <span className="text-muted">|</span>
          <button className="custom-button-choice">
            <i className="bi bi-search"></i>
          </button>
        </div>

        {/* Prev/Next */}
        <div className="arg-summary-navigation">
          <button
            className="custom-button-nav"
            onMouseEnter={() => setHoverPrev(true)}
            onMouseLeave={() => setHoverPrev(false)}
            onClick={onPrevChapter}
            title={lang.prev_chapter}
          >
            <i className="bi bi-chevron-left fs-5"></i>
          </button>

          <div className=" m-0">{localCurrentRef || currentRef}</div>

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

          <ShareDropdown
            url={window.location.href}
            text={`${currentRef} | ${versions.join(", ")}`}
            lang={lang}
          />

          <button
            className="btn p-0"
            onClick={onNewPanel}
            title={lang.new_panel}
          >
            <i className="bi bi-plus-circle-fill fs-5"></i>
          </button>

          <CloseIcon
            className="btn fs-5 p-0 "
            disabled={disableClose}
            onClick={onClosePanel}
          />
        </div>
      </div>
      {/* Translation Selector Modal */}
      <TranslationSelector
        isOpen={showTranslationModal}
        onRequestClose={() => setShowTranslationModal(false)}
        lang={lang}
        onSelectVersions={setVersions}
        initialVersions={versions} // ← ПЕРЕДАЄМО поточні версії
        currentBook={book} // ← ПЕРЕДАЄМО поточну книгу
      />

      <BookSelector
        isOpen={showBook}
        onRequestClose={() => setShowBook(false)}
        lang={lang}
        versions={versions}
        coreData={coreData}
        coreLoading={coreLoading}
        // Старий пропс (можна залишити для сумісності або прибрати)
        onSelectBook={(code) => {
          setSelectedBook(code);
          const chapters = getMaxChaptersForBook(code, versions);
          setSelectedChapters(chapters);
          // НЕ викликаємо setCurrentRef тут!
        }}
        // Новий пропс для комбінованого вибору
        onSelectBookAndChapter={handleSelectBookAndChapter}
      />

      <ChapterSelector
        isOpen={showChapter}
        onRequestClose={() => setShowChapter(false)}
        lang={lang}
        bookCode={book}
        // chapters={selectedChapters}
        chapters={getCurrentBookChapters()} // реальна кількість розділів
        onSelectChapter={(ch) => {
          setCurrentRef(`${book}.${ch}`);
        }}
      />
    </>
  );
};

export default PassageOptionsGroup;
