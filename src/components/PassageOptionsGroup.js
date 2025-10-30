// import React from "react";
// import SyncIcon from "../elements/SyncIcon";
// import "../styles/PassageOptionsGroup.css";

// const PassageOptionsGroup = ({ lang }) => {
//   return (
//     <div className="passage-options">
//       <span className="option-item">УБТ</span>
//       <span className="option-item">LXX Буття 1:20</span>
//       <span className="option-item icon-search">{lang.search}</span>
//       <span className="option-item icon-settings">{lang.settings}</span>
//       <SyncIcon />
//       <span className="option-item icon-add-window">+</span>
//       <span className="option-item icon-close-window">x</span>
//     </div>
//   );
// };

// export default PassageOptionsGroup;

// import React, { useState } from 'react';
// import {
//   NavDropdown,
//   Dropdown,
//   Button,
//   Accordion,
//   Card,
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import ShareDropdown from './ShareDropdown';
// import './PassageOptionsGroup.css';

// interface Props {
//   lang: any;                     // lang.json
//   currentRef: string;            // "Gen.1"
//   versions: string[];            // ["THOT","LXX","UkrOgienko"]
//   onPrevChapter: () => void;
//   onNextChapter: () => void;
//   onResizeToggle: () => void;    // placeholder
//   onNewPanel: () => void;
//   onCloseColumn: () => void;
// }

// const PassageOptionsGroup: React.FC<Props> = ({
//   lang,
//   currentRef,
//   versions,
//   onPrevChapter,
//   onNextChapter,
//   onResizeToggle,
//   onNewPanel,
//   onCloseColumn,
// }) => {
//   const navigate = useNavigate();

//   // ----- Display mode -------------------------------------------------
//   const [displayMode, setDisplayMode] = useState<'INTERLEAVED' | 'COLUMN'>(
//     'INTERLEAVED'
//   );

//   // ----- Display options (H,V,X,L,R,N,…) ------------------------------
//   const [displayOpts, setDisplayOpts] = useState({
//     H: false,
//     V: false,
//     X: false,
//     L: false,
//     R: false,
//     N: true,
//     O: false,
//     G: true,
//     U: true,
//     P: false,
//   });

//   // ----- General options -----------------------------------------------
//   const [generalOpts, setGeneralOpts] = useState({
//     quickLexicon: true,
//     vocabVerse: true,
//     similarWord: true,
//   });

//   // ----- SyncIcon button -------------------------------------------------
//   const [isScrollSynced, setIsScrollSynced] = useState(true);

//   // --------------------------------------------------------------------
//   const toggleDisplayMode = (mode: typeof displayMode) => {
//     setDisplayMode(mode);
//   };

//   const toggleDisplayOpt = (key: keyof typeof displayOpts) => {
//     setDisplayOpts((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const toggleGeneralOpt = (key: keyof typeof generalOpts) => {
//     setGeneralOpts((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   // --------------------------------------------------------------------
//   return (
//     <div className="passage-options-group d-flex justify-content-end align-items-center flex-wrap gap-2">
//       {/* ---------- Prev / Next chapter ---------- */}
//       <div className="next-prev-group">
//         <button
//           className="btn btn-link p-0 me-2"
//           onClick={onPrevChapter}
//           title={lang.prev_chapter}
//         >
//           <i className="bi bi-arrow-left-circle-fill text-primary"></i>
//         </button>
//         <button
//           className="btn btn-link p-0"
//           onClick={onNextChapter}
//           title={lang.next_chapter}
//         >
//           <i className="bi bi-arrow-right-circle-fill text-primary"></i>
//         </button>
//       </div>

//       {/* ---------- Share dropdown ---------- */}
//       <ShareDropdown
//   url={window.location.href}
//   text={`${currentRef} | ${versions.join(', ')} — Under-word-app`}
// />

//             {/* Facebook widget */}

//       {/* ---------- Resize panel ---------- */}

//       {/* ---------- Settings dropdown ---------- */}
//       <NavDropdown
//         title={<i className="bi bi-gear-fill text-primary"></i>}
//         align="end"
//         className="settings-dropdown"
//       >
//         {/* ==== DISPLAY MODE ==== */}
//         <Dropdown.Header>{lang.display_mode_header}</Dropdown.Header>
//         {(['INTERLEAVED', 'COLUMN'] as const).map((mode) => (
//           <Dropdown.Item
//             key={mode}
//             active={displayMode === mode}
//             onClick={() => toggleDisplayMode(mode)}
//           >
//             {lang[`display_mode_${mode.toLowerCase()}`] || mode}
//             {displayMode === mode && (
//               <i className="bi bi-check float-end"></i>
//             )}
//           </Dropdown.Item>
//         ))}

//         <Dropdown.Divider />

//         {/* ==== DISPLAY OPTIONS ==== */}
//         <Dropdown.Header>{lang.display_options_header}</Dropdown.Header>

//         {/* Simple options */}
//         {(['X', 'L', 'N'] as const).map((opt) => (
//           <Dropdown.Item
//             key={opt}
//             active={displayOpts[opt]}
//             onClick={() => toggleDisplayOpt(opt)}
//           >
//             {lang[`display_opt_${opt}`] || opt}
//             {displayOpts[opt] && <i className="bi bi-check float-end"></i>}
//           </Dropdown.Item>
//         ))}

//         {/* ---- Original language options (Accordion) ---- */}
//         <Accordion className="mx-2">
//           <Accordion.Item eventKey="orig-lang">
//             <Accordion.Header className="fw-bold">
//               {lang.original_lang_options}
//             </Accordion.Header>
//             <Accordion.Body className="p-0">
//               {(['O', 'G', 'U', 'P'] as const).map((opt) => (
//                 <Dropdown.Item
//                   key={opt}
//                   className="ps-4"
//                   active={displayOpts[opt]}
//                   onClick={() => toggleDisplayOpt(opt)}
//                 >
//                   {lang[`orig_opt_${opt}`] || opt}
//                   {displayOpts[opt] && (
//                     <i className="bi bi-check float-end"></i>
//                   )}
//                 </Dropdown.Item>
//               ))}
//             </Accordion.Body>
//           </Accordion.Item>
//         </Accordion>

//         <Dropdown.Divider />

//         {/* ==== GENERAL OPTIONS ==== */}
//         <Dropdown.Header>{lang.general_options_header}</Dropdown.Header>
//         {(['quickLexicon', 'vocabVerse', 'similarWord'] as const).map(
//           (opt) => (
//             <Dropdown.Item
//               key={opt}
//               active={generalOpts[opt]}
//               onClick={() => toggleGeneralOpt(opt)}
//             >
//               {lang[`general_opt_${opt}`] || opt}
//               {generalOpts[opt] && <i className="bi bi-check float-end"></i>}
//             </Dropdown.Item>
//           )
//         )}

//         {/* Font size (quick) */}
//         <Dropdown.Item className="d-flex align-items-center justify-content-between">
//           <span>{lang.font_size}</span>
//           <Button
//             size="sm"
//             variant="outline-primary"
//             onClick={() => alert(lang.font_size_modal)} // відкрити ModalFont
//           >
//             A
//           </Button>
//         </Dropdown.Item>
//       </NavDropdown>
//       {/* ---------- Sync Scroll Icon (перед +) ---------- */}
//       <SyncIcon
//         isSynced={isScrollSynced}
//         onToggle={() => setIsScrollSynced(!isScrollSynced)}
//         title={isScrollSynced ? lang.sync_scroll_on : lang.sync_scroll_off}
//       />
//       {/* ---------- New panel / Close column ---------- */}
//       <button
//         className="btn btn-link p-0 d-none d-sm-inline-block"
//         onClick={onNewPanel}
//         title={lang.new_panel}
//       >
//         <i className="bi bi-plus-circle-fill text-success"></i>
//       </button>

//       <button
//         className="btn btn-link p-0 d-none d-sm-inline-block"
//         onClick={onCloseColumn}
//         title={lang.close_column}
//       >
//         <i className="bi bi-x-circle-fill text-danger"></i>
//       </button>

//       {/* ---------- argSummary (versions + reference) ---------- */}
//       <div className="arg-summary ms-3 d-flex align-items-center gap-1 flex-wrap">
//         <Button
//           size="sm"
//           variant="outline-secondary"
//           onClick={() => alert(lang.select_versions)}
//         >
//           {versions.join(', ')}
//         </Button>
//         <span className="text-muted">|</span>
//         <Button
//           size="sm"
//           variant="outline-secondary"
//           onClick={() => alert(lang.select_passage)}
//         >
//           {currentRef}
//         </Button>
//         <span className="text-muted">|</span>
//         <Button
//           size="sm"
//           variant="outline-secondary"
//           onClick={() => alert(lang.search_bible)}
//         >
//           <i className="bi bi-search"></i>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PassageOptionsGroup;

// import React from "react";
// import SyncIcon from "../elements/SyncIcon";
// import ShareDropdown from "../elements/ShareDropdown";
// import TranslationSelector from "./TranslationSelector";
// import "../styles/PassageOptionsGroup.css";

// const PassageOptionsGroup = ({
//   lang,
//   currentRef,
//   versions,
//   displayMode,
//   setDisplayMode,
//   isScrollSynced,
//   setIsScrollSynced,
//   onPrevChapter,
//   onNextChapter,
//   onNewPanel,
//   onCloseColumn,
// }) => {
//   return (
//     <div className="passage-options-group">
//       {/* argSummary */}
//       <div className="arg-summary ms-3 d-flex align-items-center gap-1 flex-wrap">
//         <button className="btn btn-sm btn-outline-secondary">
//           {versions.join(", ")}
//         </button>
//         <span className="text-muted">|</span>
//         <button className="btn btn-sm btn-outline-secondary">
//           {currentRef}
//         </button>
//         <span className="text-muted">|</span>
//         <button className="btn btn-sm btn-outline-secondary">
//           <i className="bi bi-search"></i>
//         </button>
//       </div>
//       {/* Prev/Next */}
//       <div className="d-flex align-items-center gap-2">
//         <div className="next-prev-group">
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
//         </div>

//         {/* Share */}
//         <ShareDropdown
//           url={window.location.href}
//           text={`${currentRef} | ${versions.join(", ")}`}
//           lang={lang}
//         />

//         {/* Sync Icon — ПЕРЕД + */}
//         <SyncIcon
//           isSynced={isScrollSynced}
//           onToggle={() => setIsScrollSynced(!isScrollSynced)}
//           title={isScrollSynced ? lang.sync_scroll_on : lang.sync_scroll_off}
//         />

//         {/* New Panel */}
//         <button
//           className="btn btn-link p-0 d-none d-sm-inline-block"
//           onClick={onNewPanel}
//           title={lang.new_panel}
//         >
//           <i className="bi bi-plus-circle-fill text-success"></i>
//         </button>

//         {/* Close Column */}
//         <button
//           className="btn btn-link p-0 d-none d-sm-inline-block"
//           onClick={onCloseColumn}
//           title={lang.close_column}
//         >
//           <i className="bi bi-x-circle-fill text-danger"></i>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PassageOptionsGroup;

import React, { useState } from "react";
import SyncIcon from "../elements/SyncIcon";
import ShareDropdown from "../elements/ShareDropdown";
import TranslationSelector from "./TranslationSelector";
import BookSelector from "./BookSelector"; // ДОДАНО
import ChapterSelector from "./ChapterSelector.js"; // ДОДАНО
import "../styles/PassageOptionsGroup.css";

const PassageOptionsGroup = ({
  lang,
  currentRef,
  setCurrentRef,
  versions,
  setVersions,
  displayMode,
  setDisplayMode,
  isScrollSynced,
  setIsScrollSynced,
  onPrevChapter,
  onNextChapter,
  onNewPanel,
  onCloseColumn,
  // onOpenBookSelector,
}) => {
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  // const [showBookModal, setShowBookModal] = useState(false);

  const handleVersionsChange = (selected) => {
    setVersions(selected);
    localStorage.setItem("selectedVersions", JSON.stringify(selected));
  };

  const [showBook, setShowBook] = useState(false);
  const [showChapter, setShowChapter] = useState(false);
  const [selectedBook, setSelectedBook] = useState("GEN");
  const [selectedChapters, setSelectedChapters] = useState(50);

  const [book, chapter] = currentRef.split(".");

  return (
    <>
      <div className="passage-options-group">
        {/* argSummary */}
        <div className="arg-summary ms-3 d-flex align-items-center gap-1 flex-wrap">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowTranslationModal(true)}
            title={lang.select_translations || "Оберіть переклади"}
          >
            {versions.length > 0
              ? versions.join(", ")
              : lang.no_versions || "Немає"}
          </button>
          <span className="text-muted">|</span>
          {/* <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onOpenBookSelector}
            title={lang.change_passage || "Змінити уривок"}
          >
            {currentRef}
          </button> */}
          {/* <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowBookModal(true)}
            title={lang.change_passage || "Змінити уривок"}
          >
            {currentRef}
          </button> */}

          <button
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => setShowBook(true)}
          >
            {book}
          </button>
          <span className="text-muted">|</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowChapter(true)}
          >
            {chapter}
          </button>

          <span className="text-muted">|</span>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-search"></i>
          </button>
        </div>

        {/* Prev/Next */}
        <div className="d-flex align-items-center gap-2">
          <div className="next-prev-group">
            <button
              className="btn btn-link p-0 me-2"
              onClick={onPrevChapter}
              title={lang.prev_chapter}
            >
              <i className="bi bi-arrow-left-circle-fill text-primary"></i>
            </button>
            <button
              className="btn btn-link p-0"
              onClick={onNextChapter}
              title={lang.next_chapter}
            >
              <i className="bi bi-arrow-right-circle-fill text-primary"></i>
            </button>
          </div>

          <ShareDropdown
            url={window.location.href}
            text={`${currentRef} | ${versions.join(", ")}`}
            lang={lang}
          />

          <SyncIcon
            isSynced={isScrollSynced}
            onToggle={() => setIsScrollSynced(!isScrollSynced)}
            title={isScrollSynced ? lang.sync_scroll_on : lang.sync_scroll_off}
          />

          <button
            className="btn btn-link p-0 d-none d-sm-inline-block"
            onClick={onNewPanel}
            title={lang.new_panel}
          >
            <i className="bi bi-plus-circle-fill text-success"></i>
          </button>

          <button
            className="btn btn-link p-0 d-none d-sm-inline-block"
            onClick={onCloseColumn}
            title={lang.close_column}
          >
            <i className="bi bi-x-circle-fill text-danger"></i>
          </button>
        </div>
      </div>

      {/* Translation Selector Modal */}
      <TranslationSelector
        isOpen={showTranslationModal}
        onRequestClose={() => setShowTranslationModal(false)}
        lang={lang}
        onSelectVersions={handleVersionsChange}
      />
      {/* <BookSelector
        isOpen={showBookModal}
        onRequestClose={() => setShowBookModal(false)}
        lang={lang}
        versions={versions}
        onSelectRef={(ref) => {
          setCurrentRef(ref);
          setShowBookModal(false);
        }}
      /> */}
      <BookSelector
        isOpen={showBook}
        onRequestClose={() => setShowBook(false)}
        lang={lang}
        versions={versions}
        onSelectBook={(code) => {
          setSelectedBook(code);
          // Знаходимо кількість розділів
          const data = core.json;
          const bookData = data[versions[0].toLowerCase()]?.OldT?.flatMap(
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
