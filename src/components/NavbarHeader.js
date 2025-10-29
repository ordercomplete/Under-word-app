// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/NavbarHeader.css";

// const NavbarHeader = ({ lang }) => {
//   return (
//     <nav className="navbar sticky-top">
//       <Link to="/" className="navbar-brand">
//         Under-word-app
//       </Link>
//       <div className="navbar-items">
//         <span className="navbar-item icon-copy">{lang.copy}</span>
//         <a
//           href="https://www.stepbible.org/html/reports_by_step.html"
//           target="_blank"
//           className="navbar-item icon-resources"
//         >
//           {lang.resources}
//         </a>
//         <span className="navbar-item icon-analysis">{lang.developing}</span>
//         <span className="navbar-item icon-bookmarks">{lang.bookmarks}</span>
//         <span className="navbar-item icon-font">{lang.font}</span>
//         <span className="navbar-item icon-grammar">{lang.developing}</span>
//         <span className="navbar-item icon-language">{lang.language}</span>
//         <span className="navbar-item icon-feedback">{lang.feedback}</span>
//         <span className="navbar-item icon-faq">{lang.developing}</span>
//         <span className="navbar-item icon-more">{lang.more}</span>
//       </div>
//     </nav>
//   );
// };

// export default NavbarHeader;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
// import Modal from "react-modal";
// import DropdownMenu from "../modals/DropdownMenu";
// import ModalFont from "../modals/ModalFont";
// import ModalLanguage from "../modals/ModalLanguage";
// import ModalFeedback from "../modals/ModalFeedback";
// import ModalAbout from "../modals/ModalAbout"; // Додано
// import "../styles/NavbarHeader.css";

// Modal.setAppElement("#root");

// const NavbarHeader = ({ lang }) => {
//   const [showCopyModal, setShowCopyModal] = useState(false);
//   const [showFontModal, setShowFontModal] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [showAboutModal, setShowAboutModal] = useState(false); // Додано

//   return (
//     <Navbar bg="light" expand="lg" fixed="top" className="navbar-custom">
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/">
//           Under-word-app
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-collapse" />
//         <Navbar.Collapse id="navbar-collapse">
//           <Nav className="ms-auto">
//             <Nav.Link onClick={() => setShowCopyModal(true)}>
//               <i className="bi bi-clipboard"></i> {lang.copy}
//             </Nav.Link>
//             <Nav.Link
//               href="https://www.stepbible.org/html/reports_by_step.html"
//               target="_blank"
//             >
//               <i className="bi bi-list-ul"></i> {lang.resources}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-bar-chart"></i> {lang.analysis}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-bookmark"></i> {lang.bookmarks}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowFontModal(true)}>
//               <span className="font-icon">A</span> {lang.font}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <span className="grammar-icon">G</span> {lang.grammar}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowLanguageModal(true)}>
//               <i className="bi bi-globe"></i> {lang.language}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowFeedbackModal(true)}>
//               <i className="bi bi-envelope"></i> {lang.feedback}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-question-circle"></i> {lang.faq}
//             </Nav.Link>
//             <NavDropdown
//               title={
//                 <>
//                   <i className="bi bi-three-dots-vertical"></i> {lang.more}
//                 </>
//               }
//               id="more-dropdown"
//             >
//               <DropdownMenu lang={lang} />
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>

//       {/* Modals */}
//       <Modal
//         isOpen={showCopyModal}
//         onRequestClose={() => setShowCopyModal(false)}
//       >
//         <h2>{lang.copy}</h2>
//         <p>{lang.developing}</p>
//         <Button onClick={() => setShowCopyModal(false)}>{lang.close}</Button>
//       </Modal>
//       <ModalFont
//         isOpen={showFontModal}
//         onRequestClose={() => setShowFontModal(false)}
//         lang={lang}
//       />
//       <ModalLanguage
//         isOpen={showLanguageModal}
//         onRequestClose={() => setShowLanguageModal(false)}
//         lang={lang}
//       />
//       <ModalFeedback
//         isOpen={showFeedbackModal}
//         onRequestClose={() => setShowFeedbackModal(false)}
//         lang={lang}
//       />
//       <ModalAbout
//         isOpen={showAboutModal}
//         onRequestClose={() => setShowAboutModal(false)}
//         lang={lang}
//       />
//     </Navbar>
//   );
// };

// export default NavbarHeader;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
// import Modal from "react-modal";
// import DropdownMenu from "../modals/DropdownMenu";
// import ModalFont from "../modals/ModalFont";
// import ModalLanguage from "../modals/ModalLanguage";
// import ModalFeedback from "../modals/ModalFeedback";
// import ModalAbout from "../modals/ModalAbout";
// import ModalAdmin from "../modals/ModalAdmin"; // Додано
// import "../styles/NavbarHeader.css";

// Modal.setAppElement("#root");

// const NavbarHeader = ({ lang }) => {
//   const [showCopyModal, setShowCopyModal] = useState(false);
//   const [showFontModal, setShowFontModal] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [showAboutModal, setShowAboutModal] = useState(false);
//   const [showAdminModal, setShowAdminModal] = useState(false); // Додано

//   return (
//     <Navbar bg="light" expand="lg" fixed="top" className="navbar-custom">
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/">
//           Under-word-app
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-collapse" />
//         <Navbar.Collapse id="navbar-collapse">
//           <Nav className="ms-auto me-3">
//             {/* Додано me-3 для відступу справа */}
//             <Nav.Link onClick={() => setShowCopyModal(true)}>
//               <i className="bi bi-clipboard"></i> {lang.copy}
//             </Nav.Link>
//             <Nav.Link
//               href="https://www.stepbible.org/html/reports_by_step.html"
//               target="_blank"
//             >
//               <i className="bi bi-list-ul"></i> {lang.resources}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-bar-chart"></i> {lang.analysis}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-bookmark"></i> {lang.bookmarks}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowFontModal(true)}>
//               <span className="font-icon">A</span> {lang.font}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <span className="grammar-icon">G</span> {lang.grammar}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowLanguageModal(true)}>
//               <i className="bi bi-globe"></i> {lang.language}
//             </Nav.Link>
//             <Nav.Link onClick={() => setShowFeedbackModal(true)}>
//               <i className="bi bi-envelope"></i> {lang.feedback}
//             </Nav.Link>
//             <Nav.Link onClick={() => alert(lang.developing)}>
//               <i className="bi bi-question-circle"></i> {lang.faq}
//             </Nav.Link>
//             <NavDropdown
//               title={
//                 <>
//                   <i className="bi bi-three-dots-vertical"></i> {lang.more}
//                 </>
//               }
//               id="more-dropdown"
//               align="end" // Ключове виправлення!
//             >
//               <DropdownMenu lang={lang} />
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>

//       {/* Modals */}
//       <Modal
//         isOpen={showCopyModal}
//         onRequestClose={() => setShowCopyModal(false)}
//       >
//         <h2>{lang.copy}</h2>
//         <p>{lang.developing}</p>
//         <Button onClick={() => setShowCopyModal(false)}>{lang.close}</Button>
//       </Modal>
//       <ModalFont
//         isOpen={showFontModal}
//         onRequestClose={() => setShowFontModal(false)}
//         lang={lang}
//       />
//       <ModalLanguage
//         isOpen={showLanguageModal}
//         onRequestClose={() => setShowLanguageModal(false)}
//         lang={lang}
//       />
//       <ModalFeedback
//         isOpen={showFeedbackModal}
//         onRequestClose={() => setShowFeedbackModal(false)}
//         lang={lang}
//       />
//       <ModalAbout
//         isOpen={showAboutModal}
//         onRequestClose={() => setShowAboutModal(false)}
//         lang={lang}
//       />
//       <ModalAdmin
//         isOpen={showAdminModal}
//         onRequestClose={() => setShowAdminModal(false)}
//         lang={lang}
//       />
//     </Navbar>
//   );
// };

// export default NavbarHeader;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Navbar,
//   Nav,
//   NavDropdown,
//   Container,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import Modal from "react-modal";
// import DropdownMenu from "../modals/DropdownMenu";
// import ModalFont from "../modals/ModalFont";
// import ModalLanguage from "../modals/ModalLanguage";
// import ModalFeedback from "../modals/ModalFeedback";
// import ModalAbout from "../modals/ModalAbout";
// import ModalAdmin from "../modals/ModalAdmin";
// import { useMediaQuery } from "react-responsive";
// import "../styles/NavbarHeader.css";

// Modal.setAppElement("#root");

// const NavbarHeader = ({ lang }) => {
//   const isDesktop = useMediaQuery({ minWidth: 1432 });

//   const [showCopyModal, setShowCopyModal] = useState(false);
//   const [showFontModal, setShowFontModal] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [showAboutModal, setShowAboutModal] = useState(false);
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   // Tooltip-іконка
//   const IconLink = ({ icon, text, onClick, href, target }) => (
//     <OverlayTrigger placement="bottom" overlay={<Tooltip>{text}</Tooltip>}>
//       <Nav.Link
//         onClick={onClick}
//         href={href}
//         target={target}
//         className="d-flex align-items-center p-2"
//       >
//         <i className={`bi ${icon} fs-5`}></i>
//         {isDesktop && <span className="ms-2">{text}</span>}
//       </Nav.Link>
//     </OverlayTrigger>
//   );
//   const handleLanguageChange = (langCode) => {
//     setLanguage(langCode);
//     // Можна зберегти в localStorage
//     localStorage.setItem("appLanguage", langCode);
//   };

//   return (
//     <Navbar
//       fixed="top"
//       bg="light"
//       expand="lg"
//       className="navbar-custom border-bottom shadow-sm"
//     >
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
//           {isDesktop ? (
//             "Under-word-app"
//           ) : (
//             <OverlayTrigger
//               placement="bottom"
//               overlay={<Tooltip>Under-word-app</Tooltip>}
//             >
//               <i className="bi bi-book fs-4"></i>
//             </OverlayTrigger>
//           )}
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="navbar-collapse" />

//         <Navbar.Collapse id="navbar-collapse">
//           <Nav className="ms-auto gap-1">
//             {/* Copy */}
//             <IconLink
//               icon="bi-clipboard"
//               text={lang.copy}
//               onClick={() => setShowCopyModal(true)}
//             />

//             {/* Resources */}
//             <IconLink
//               icon="bi-list-ul"
//               text={lang.resources}
//               href="https://www.stepbible.org/html/reports_by_step.html"
//               target="_blank"
//             />

//             {/* Analysis */}
//             <IconLink
//               icon="bi-bar-chart"
//               text={lang.analysis}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Bookmarks */}
//             <IconLink
//               icon="bi-bookmark"
//               text={lang.bookmarks}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Font */}
//             <IconLink
//               icon="bi-fonts"
//               text={lang.font}
//               onClick={() => setShowFontModal(true)}
//             />

//             {/* Grammar */}
//             <IconLink
//               icon="bi-body-text"
//               text={lang.grammar}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Language */}
//             <IconLink
//               icon="bi-globe"
//               text={lang.language}
//               onClick={() => setShowLanguageModal(true)}
//             />

//             {/* Feedback */}
//             <IconLink
//               icon="bi-envelope"
//               text={lang.feedback}
//               onClick={() => setShowFeedbackModal(true)}
//             />

//             {/* FAQ */}
//             <IconLink
//               icon="bi-question-circle"
//               text={lang.faq}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* More Dropdown */}
//             <NavDropdown
//               title={
//                 <OverlayTrigger
//                   placement="bottom"
//                   overlay={<Tooltip>{lang.more}</Tooltip>}
//                 >
//                   <i className="bi bi-three-dots-vertical fs-5"></i>
//                 </OverlayTrigger>
//               }
//               align="end"
//               className="more-dropdown"
//             >
//               <DropdownMenu lang={lang} />
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>

//       {/* Modals */}
//       <Modal
//         isOpen={showCopyModal}
//         onRequestClose={() => setShowCopyModal(false)}
//         className="modal"
//       >
//         <h2>{lang.copy}</h2>
//         <p>{lang.developing}</p>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setShowCopyModal(false)}
//         >
//           {lang.close}
//         </button>
//       </Modal>

//       <ModalFont
//         isOpen={showFontModal}
//         onRequestClose={() => setShowFontModal(false)}
//         lang={lang}
//       />
//       <ModalLanguage
//         isOpen={showLanguageModal}
//         onRequestClose={() => setShowLanguageModal(false)}
//         lang={lang}
//       />
//       <ModalFeedback
//         isOpen={showFeedbackModal}
//         onRequestClose={() => setShowFeedbackModal(false)}
//         lang={lang}
//       />
//       <ModalAbout
//         isOpen={showAboutModal}
//         onRequestClose={() => setShowAboutModal(false)}
//         lang={lang}
//       />
//       <ModalAdmin
//         isOpen={showAdminModal}
//         onRequestClose={() => setShowAdminModal(false)}
//         lang={lang}
//       />
//     </Navbar>
//   );
// };

// export default NavbarHeader;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Navbar,
//   Nav,
//   NavDropdown,
//   Container,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import Modal from "react-modal";
// import DropdownMenu from "../modals/DropdownMenu";
// import ModalFont from "../modals/ModalFont";
// import ModalLanguage from "../modals/ModalLanguage";
// import ModalFeedback from "../modals/ModalFeedback";
// import ModalAbout from "../modals/ModalAbout";
// import ModalAdmin from "../modals/ModalAdmin";
// import { useMediaQuery } from "react-responsive";
// import "../styles/NavbarHeader.css";

// Modal.setAppElement("#root");

// const NavbarHeader = ({ lang, language, setLanguage }) => {
//   const isDesktop = useMediaQuery({ minWidth: 1432 });

//   const [showCopyModal, setShowCopyModal] = useState(false);
//   const [showFontModal, setShowFontModal] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [showAboutModal, setShowAboutModal] = useState(false);
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   // Tooltip-іконка
//   const IconLink = ({ icon, text, onClick, href, target }) => (
//     <OverlayTrigger placement="bottom" overlay={<Tooltip>{text}</Tooltip>}>
//       <Nav.Link
//         onClick={onClick}
//         href={href}
//         target={target}
//         className="d-flex align-items-center p-2"
//       >
//         <i className={`bi ${icon} fs-5`}></i>
//         {isDesktop && <span className="ms-2">{text}</span>}
//       </Nav.Link>
//     </OverlayTrigger>
//   );

//   // Обробник зміни мови
//   const handleLanguageChange = (langCode) => {
//     setLanguage(langCode);
//     localStorage.setItem("appLanguage", langCode);
//   };

//   return (
//     <Navbar
//       fixed="top"
//       bg="light"
//       expand="lg"
//       className="navbar-custom border-bottom shadow-sm"
//     >
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
//           {isDesktop ? (
//             "Under-word-app"
//           ) : (
//             <OverlayTrigger
//               placement="bottom"
//               overlay={<Tooltip>Under-word-app</Tooltip>}
//             >
//               <i className="bi bi-book fs-4"></i>
//             </OverlayTrigger>
//           )}
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="navbar-collapse" />

//         <Navbar.Collapse id="navbar-collapse">
//           <Nav className="ms-auto gap-1">
//             {/* Copy */}
//             <IconLink
//               icon="bi-clipboard"
//               text={lang.copy}
//               onClick={() => setShowCopyModal(true)}
//             />

//             {/* Resources */}
//             <IconLink
//               icon="bi-list-ul"
//               text={lang.resources}
//               href="https://www.stepbible.org/html/reports_by_step.html"
//               target="_blank"
//             />

//             {/* Analysis */}
//             <IconLink
//               icon="bi-bar-chart"
//               text={lang.analysis}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Bookmarks */}
//             <IconLink
//               icon="bi-bookmark"
//               text={lang.bookmarks}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Font */}
//             <IconLink
//               icon="bi-fonts"
//               text={lang.font}
//               onClick={() => setShowFontModal(true)}
//             />

//             {/* Grammar */}
//             <IconLink
//               icon="bi-body-text"
//               text={lang.grammar}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* Language */}
//             <IconLink
//               icon="bi-globe"
//               text={lang.language}
//               onClick={() => setShowLanguageModal(true)}
//             />

//             {/* Feedback */}
//             <IconLink
//               icon="bi-envelope"
//               text={lang.feedback}
//               onClick={() => setShowFeedbackModal(true)}
//             />

//             {/* FAQ */}
//             <IconLink
//               icon="bi-question-circle"
//               text={lang.faq}
//               onClick={() => alert(lang.developing)}
//             />

//             {/* More Dropdown */}
//             <NavDropdown
//               title={
//                 <OverlayTrigger
//                   placement="bottom"
//                   overlay={<Tooltip>{lang.more}</Tooltip>}
//                 >
//                   <i className="bi bi-three-dots-vertical fs-5"></i>
//                 </OverlayTrigger>
//               }
//               align="end"
//               className="more-dropdown"
//             >
//               <DropdownMenu lang={lang} />
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>

//       {/* === МОДАЛКИ === */}
//       <Modal
//         isOpen={showCopyModal}
//         onRequestClose={() => setShowCopyModal(false)}
//         className="modal"
//       >
//         <h2>{lang.copy}</h2>
//         <p>{lang.developing}</p>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setShowCopyModal(false)}
//         >
//           {lang.close}
//         </button>
//       </Modal>

//       <ModalFont
//         isOpen={showFontModal}
//         onRequestClose={() => setShowFontModal(false)}
//         lang={lang}
//       />

//       <ModalLanguage
//         isOpen={showLanguageModal}
//         onRequestClose={() => setShowLanguageModal(false)}
//         lang={lang}
//         onSelectLanguage={handleLanguageChange}
//       />

//       <ModalFeedback
//         isOpen={showFeedbackModal}
//         onRequestClose={() => setShowFeedbackModal(false)}
//         lang={lang}
//       />

//       <ModalAbout
//         isOpen={showAboutModal}
//         onRequestClose={() => setShowAboutModal(false)}
//         lang={lang}
//       />

//       <ModalAdmin
//         isOpen={showAdminModal}
//         onRequestClose={() => setShowAdminModal(false)}
//         lang={lang}
//       />
//     </Navbar>
//   );
// };

// export default NavbarHeader;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Modal from "react-modal";
import DropdownMenu from "../modals/DropdownMenu";
import ModalFont from "../modals/ModalFont";
import ModalLanguage from "../modals/ModalLanguage";
import ModalFeedback from "../modals/ModalFeedback";
import ModalAbout from "../modals/ModalAbout";
import ModalAdmin from "../modals/ModalAdmin";
import { useMediaQuery } from "react-responsive";
import "../styles/NavbarHeader.css";

Modal.setAppElement("#root");

const NavbarHeader = ({ lang, onLanguageChange }) => {
  const isDesktop = useMediaQuery({ minWidth: 1432 });

  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [allLangData, setAllLangData] = useState(null);

  // Завантажуємо lang.json один раз
  useEffect(() => {
    fetch("/data/lang.json")
      .then((res) => res.json())
      .then((data) => setAllLangData(data))
      .catch(() => setAllLangData({ ua: lang }));
  }, [lang]);

  const handleLanguageSelect = (langCode) => {
    if (allLangData?.[langCode]) {
      localStorage.setItem("appLanguage", langCode);
      onLanguageChange(allLangData[langCode]);
      setShowLanguageModal(false);
    }
  };

  const IconLink = ({ icon, text, onClick, href, target }) => (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>{text}</Tooltip>}>
      <Nav.Link
        onClick={onClick}
        href={href}
        target={target}
        className="d-flex align-items-center p-2"
      >
        <i className={`bi ${icon} fs-5`}></i>
        {isDesktop && <span className="ms-2">{text}</span>}
      </Nav.Link>
    </OverlayTrigger>
  );

  return (
    <Navbar
      fixed="top"
      bg="light"
      expand="lg"
      className="navbar-custom border-bottom shadow-sm"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {isDesktop ? (
            "Under-word-app"
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Under-word-app</Tooltip>}
            >
              <i className="bi bi-book fs-4"></i>
            </OverlayTrigger>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-collapse" />
        <Navbar.Collapse id="navbar-collapse">
          <Nav className="ms-auto gap-1">
            <IconLink
              icon="bi-clipboard"
              text={lang.copy}
              onClick={() => setShowCopyModal(true)}
            />
            <IconLink
              icon="bi-list-ul"
              text={lang.resources}
              href="https://www.stepbible.org/html/reports_by_step.html"
              target="_blank"
            />
            <IconLink
              icon="bi-bar-chart"
              text={lang.analysis}
              onClick={() => alert(lang.developing)}
            />
            <IconLink
              icon="bi-bookmark"
              text={lang.bookmarks}
              onClick={() => alert(lang.developing)}
            />
            <IconLink
              icon="bi-fonts"
              text={lang.font}
              onClick={() => setShowFontModal(true)}
            />
            <IconLink
              icon="bi-body-text"
              text={lang.grammar}
              onClick={() => alert(lang.developing)}
            />
            <IconLink
              icon="bi-globe"
              text={lang.language}
              onClick={() => setShowLanguageModal(true)}
            />
            <IconLink
              icon="bi-envelope"
              text={lang.feedback}
              onClick={() => setShowFeedbackModal(true)}
            />
            <IconLink
              icon="bi-question-circle"
              text={lang.faq}
              onClick={() => alert(lang.developing)}
            />

            <NavDropdown
              title={
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{lang.more}</Tooltip>}
                >
                  <i className="bi bi-three-dots-vertical fs-5"></i>
                </OverlayTrigger>
              }
              align="end"
              className="more-dropdown"
            >
              <DropdownMenu lang={lang} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* === МОДАЛКИ === */}
      <Modal
        isOpen={showCopyModal}
        onRequestClose={() => setShowCopyModal(false)}
        className="modal"
      >
        <h2>{lang.copy}</h2>
        <p>{lang.developing}</p>
        <button
          className="btn btn-secondary"
          onClick={() => setShowCopyModal(false)}
        >
          {lang.close}
        </button>
      </Modal>

      <ModalFont
        isOpen={showFontModal}
        onRequestClose={() => setShowFontModal(false)}
        lang={lang}
      />

      <ModalLanguage
        isOpen={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
        lang={lang}
        onSelectLanguage={handleLanguageSelect}
        allLangData={allLangData}
      />

      <ModalFeedback
        isOpen={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
        lang={lang}
      />
      <ModalAbout
        isOpen={showAboutModal}
        onRequestClose={() => setShowAboutModal(false)}
        lang={lang}
      />
      <ModalAdmin
        isOpen={showAdminModal}
        onRequestClose={() => setShowAdminModal(false)}
        lang={lang}
      />
    </Navbar>
  );
};

export default NavbarHeader;
