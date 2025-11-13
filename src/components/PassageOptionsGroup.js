// --------------------------------------------------
// PassageOptionsGroup.js
// import React, { useState } from "react";
// import SyncIcon from "../elements/SyncIcon";
// import ShareDropdown from "../elements/ShareDropdown";
// import TranslationSelector from "../modals/TranslationSelector.js";
// import BookSelector from "../modals/BookSelector.js";
// import ChapterSelector from "../modals/ChapterSelector.js";
// import "../styles/PassageOptionsGroup.css";

// const PassageOptionsGroup = ({
//   lang,
//   currentRef,
//   setCurrentRef,
//   versions,
//   setVersions,
//   displayMode,
//   setDisplayMode,
//   isScrollSynced, // НОВЕ
//   setIsScrollSynced, // НОВЕ
//   onPrevChapter,
//   onNextChapter,
//   onNewPanel,
//   onCloseColumn,
//   onOpenBookSelector,
//   coreData,
//   coreLoading,
// }) => {
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

//   const [showBook, setShowBook] = useState(false);
//   const [showChapter, setShowChapter] = useState(false);
//   const [selectedBook, setSelectedBook] = useState("GEN");
//   const [selectedChapters, setSelectedChapters] = useState(50);

//   const [book, chapter] = currentRef.split(".");

//   return (
//     <>
//       <div className="passage-options-group">
//         {/* argSummary */}
//         <div className="arg-summary ms-3 d-flex align-items-center gap-1 flex-wrap">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             onClick={() => setShowTranslationModal(true)}
//             title={lang.select_translations || "Оберіть переклади"}
//           >
//             {versions.length > 0
//               ? versions.join(", ")
//               : lang.no_versions || "Немає"}
//           </button>
//           <span className="text-muted">|</span>

//           <button
//             className="btn btn-sm btn-outline-secondary me-1"
//             onClick={() => setShowBook(true)}
//           >
//             {book}
//           </button>
//           <span className="text-muted">|</span>
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             onClick={() => setShowChapter(true)}
//           >
//             {chapter}
//           </button>

//           <span className="text-muted">|</span>
//           <button className="btn btn-sm btn-outline-secondary">
//             <i className="bi bi-search"></i>
//           </button>
//         </div>

//         {/* Prev/Next */}
//         <div className="d-flex align-items-center gap-2">
//           <div className="next-prev-group">
//             <button
//               className="btn btn-link p-0 me-2"
//               onClick={onPrevChapter}
//               title={lang.prev_chapter}
//             >
//               <i className="bi bi-arrow-left-circle-fill text-primary"></i>
//             </button>
//             <button
//               className="btn btn-link p-0"
//               onClick={onNextChapter}
//               title={lang.next_chapter}
//             >
//               <i className="bi bi-arrow-right-circle-fill text-primary"></i>
//             </button>
//           </div>

//           <ShareDropdown
//             url={window.location.href}
//             text={`${currentRef} | ${versions.join(", ")}`}
//             lang={lang}
//           />

//           <SyncIcon
//             isSynced={isScrollSynced}
//             onToggle={() => setIsScrollSynced(!isScrollSynced)}
//             title={isScrollSynced ? lang.sync_scroll_on : lang.sync_scroll_off}
//           />

//           <button
//             className="btn btn-link p-0 d-none d-sm-inline-block"
//             onClick={onNewPanel}
//             title={lang.new_panel}
//           >
//             <i className="bi bi-plus-circle-fill text-success"></i>
//           </button>

//           <button
//             className="btn btn-link p-0 d-none d-sm-inline-block"
//             onClick={onCloseColumn}
//             title={lang.close_column}
//           >
//             <i className="bi bi-x-circle-fill text-danger"></i>
//           </button>
//         </div>
//       </div>

//       {/* Translation Selector Modal */}
//       <TranslationSelector
//         isOpen={showTranslationModal}
//         onRequestClose={() => setShowTranslationModal(false)}
//         lang={lang}
//         onSelectVersions={setVersions}
//       />
//       <BookSelector
//         isOpen={showBook}
//         onRequestClose={() => setShowBook(false)}
//         lang={lang}
//         versions={versions}
//         onSelectBook={(code) => {
//           setSelectedBook(code);
//           const bookData = coreData[versions[0].toLowerCase()]?.OldT?.flatMap(
//             (g) => g.books
//           ).find((b) => b.code === code);
//           setSelectedChapters(bookData?.chapters || 1);
//           setCurrentRef(`${code}.1`);
//         }}
//       />
//       <ChapterSelector
//         isOpen={showChapter}
//         onRequestClose={() => setShowChapter(false)}
//         lang={lang}
//         bookCode={book}
//         chapters={selectedChapters}
//         onSelectChapter={(ch) => {
//           setCurrentRef(`${book}.${ch}`);
//         }}
//       />
//     </>
//   );
// };

// export default PassageOptionsGroup;

//------------------------------------------

// PassageOptionsGroup.js 07.11.2026 додавання незаледних вікон перекладів
// import React, { useState } from "react";
// import SyncIcon from "../elements/SyncIcon";
// import ShareDropdown from "../elements/ShareDropdown";
// import TranslationSelector from "../modals/TranslationSelector.js";
// import BookSelector from "../modals/BookSelector.js";
// import ChapterSelector from "../modals/ChapterSelector.js";
// import CloseIcon from "../elements/CloseIcon";
// import "../styles/PassageOptionsGroup.css";

// const PassageOptionsGroup = ({
//   lang,
//   currentRef,
//   setCurrentRef,
//   versions,
//   setVersions,
//   onPrevChapter,
//   onNextChapter,
//   onNewPanel,
//   onClosePanel,
//   onOpenBookSelector,
//   coreData,
//   coreLoading,
//   disableClose,
// }) => {
//   const [showTranslationModal, setShowTranslationModal] = useState(false);

//   const [showBook, setShowBook] = useState(false);
//   const [showChapter, setShowChapter] = useState(false);
//   const [selectedBook, setSelectedBook] = useState("GEN");
//   const [selectedChapters, setSelectedChapters] = useState(50);

//   const [book, chapter] = currentRef.split(".");

//   return (
//     <>
//       <div className="passage-options-group ">
//         {/* argSummary */}
//         <div className="arg-summary-choice">
//           <button
//             className="custom-button"
//             onClick={() => setShowTranslationModal(true)}
//             title={lang.select_translations || "Оберіть переклади"}
//           >
//             {versions.length > 0
//               ? versions.join(", ")
//               : lang.no_versions || "Немає"}
//           </button>
//           <span className="text-muted">|</span>

//           <button className="custom-button" onClick={() => setShowBook(true)}>
//             {book}
//           </button>
//           <span className="text-muted">|</span>
//           <button
//             className="custom-button"
//             onClick={() => setShowChapter(true)}
//           >
//             {chapter}
//           </button>

//           <span className="text-muted">|</span>
//           <button className="custom-button">
//             <i className="bi bi-search"></i>
//           </button>
//         </div>

//         {/* Prev/Next */}
//         <div className="arg-summary-navigation ">
//           {/* <div className="next-prev-group"> */}
//           <button
//             className="btn btn-link p-0 me-2"
//             onClick={onPrevChapter}
//             title={lang.prev_chapter}
//           >
//             <i className="bi bi-arrow-left-circle-fill text-primary"></i>
//           </button>
//           <button
//             className="btn btn-link p-0"
//             onClick={onNextChapter}
//             title={lang.next_chapter}
//           >
//             <i className="bi bi-arrow-right-circle-fill text-primary"></i>
//           </button>
//           {/* </div> */}
//           {/* <div className="d-flex align-items-center gap-2"> */}
//           <ShareDropdown
//             url={window.location.href}
//             text={`${currentRef} | ${versions.join(", ")}`}
//             lang={lang}
//           />

//           <button
//             className="btn btn-link p-0 d-none d-sm-inline-block"
//             onClick={onNewPanel}
//             title={lang.new_panel}
//           >
//             <i className="bi bi-plus-circle-fill text-success"></i>
//           </button>

//           <CloseIcon disabled={disableClose} onClick={onClosePanel} />
//           {/* </div> */}
//         </div>
//       </div>

//       {/* Translation Selector Modal */}
//       <TranslationSelector
//         isOpen={showTranslationModal}
//         onRequestClose={() => setShowTranslationModal(false)}
//         lang={lang}
//         onSelectVersions={setVersions}
//       />
//       <BookSelector
//         isOpen={showBook}
//         onRequestClose={() => setShowBook(false)}
//         lang={lang}
//         versions={versions}
//         onSelectBook={(code) => {
//           setSelectedBook(code);
//           const bookData = coreData[versions[0].toLowerCase()]?.OldT?.flatMap(
//             (g) => g.books
//           ).find((b) => b.code === code);
//           setSelectedChapters(bookData?.chapters || 1);
//           setCurrentRef(`${code}.1`);
//         }}
//       />
//       <ChapterSelector
//         isOpen={showChapter}
//         onRequestClose={() => setShowChapter(false)}
//         lang={lang}
//         bookCode={book}
//         chapters={selectedChapters}
//         onSelectChapter={(ch) => {
//           setCurrentRef(`${book}.${ch}`);
//         }}
//       />
//     </>
//   );
// };

// export default PassageOptionsGroup;

// --------------------------------------------------------

// PassageOptionsGroup.js
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
}) => {
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showChapter, setShowChapter] = useState(false);
  const [selectedBook, setSelectedBook] = useState("GEN");
  const [selectedChapters, setSelectedChapters] = useState(50);

  const [book, chapter] = currentRef.split(".");

  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

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
            <i
              className={`bi bi-chevron-left fs-4 transition-all ${
                hoverPrev ? "text-danger" : "text-primary"
              }`}
            ></i>
          </button>

          <div className=" m-0">{lang.chapter || "Розділ"}</div>

          <button
            className="custom-button-nav"
            onMouseEnter={() => setHoverNext(true)}
            onMouseLeave={() => setHoverNext(false)}
            onClick={onNextChapter}
            title={lang.next_chapter}
          >
            <i
              className={`bi bi-chevron-right fs-4 transition-all ${
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
            <i className="bi bi-plus-circle-fill text-success fs-5"></i>
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
      />
      <BookSelector
        isOpen={showBook}
        onRequestClose={() => setShowBook(false)}
        lang={lang}
        versions={versions}
        onSelectBook={(code) => {
          setSelectedBook(code);
          const bookData = coreData[versions[0].toLowerCase()]?.OldT?.flatMap(
            (g) => g.books
          ).find((b) => b.code === code);
          setSelectedChapters(bookData?.chapters || 1);
          setCurrentRef(`${code}.1`);
        }}
      />
      <ChapterSelector
        isOpen={showChapter}
        onRequestClose={() => setShowChapter(false)}
        lang={lang}
        bookCode={book}
        chapters={selectedChapters}
        onSelectChapter={(ch) => {
          setCurrentRef(`${book}.${ch}`);
        }}
      />
    </>
  );
};

export default PassageOptionsGroup;
