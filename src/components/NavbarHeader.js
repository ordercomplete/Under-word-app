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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import Modal from "react-modal";
import DropdownMenu from "../modals/DropdownMenu";
import ModalFont from "../modals/ModalFont";
import ModalLanguage from "../modals/ModalLanguage";
import ModalFeedback from "../modals/ModalFeedback";
import ModalAbout from "../modals/ModalAbout";
import ModalAdmin from "../modals/ModalAdmin"; // Додано
import "../styles/NavbarHeader.css";

Modal.setAppElement("#root");

const NavbarHeader = ({ lang }) => {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false); // Додано

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Under-word-app
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-collapse" />
        <Navbar.Collapse id="navbar-collapse">
          <Nav className="ms-auto me-3">
            {/* Додано me-3 для відступу справа */}
            <Nav.Link onClick={() => setShowCopyModal(true)}>
              <i className="bi bi-clipboard"></i> {lang.copy}
            </Nav.Link>
            <Nav.Link
              href="https://www.stepbible.org/html/reports_by_step.html"
              target="_blank"
            >
              <i className="bi bi-list-ul"></i> {lang.resources}
            </Nav.Link>
            <Nav.Link onClick={() => alert(lang.developing)}>
              <i className="bi bi-bar-chart"></i> {lang.analysis}
            </Nav.Link>
            <Nav.Link onClick={() => alert(lang.developing)}>
              <i className="bi bi-bookmark"></i> {lang.bookmarks}
            </Nav.Link>
            <Nav.Link onClick={() => setShowFontModal(true)}>
              <span className="font-icon">A</span> {lang.font}
            </Nav.Link>
            <Nav.Link onClick={() => alert(lang.developing)}>
              <span className="grammar-icon">G</span> {lang.grammar}
            </Nav.Link>
            <Nav.Link onClick={() => setShowLanguageModal(true)}>
              <i className="bi bi-globe"></i> {lang.language}
            </Nav.Link>
            <Nav.Link onClick={() => setShowFeedbackModal(true)}>
              <i className="bi bi-envelope"></i> {lang.feedback}
            </Nav.Link>
            <Nav.Link onClick={() => alert(lang.developing)}>
              <i className="bi bi-question-circle"></i> {lang.faq}
            </Nav.Link>
            <NavDropdown
              title={
                <>
                  <i className="bi bi-three-dots-vertical"></i> {lang.more}
                </>
              }
              id="more-dropdown"
              align="end" // Ключове виправлення!
            >
              <DropdownMenu lang={lang} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Modals */}
      <Modal
        isOpen={showCopyModal}
        onRequestClose={() => setShowCopyModal(false)}
      >
        <h2>{lang.copy}</h2>
        <p>{lang.developing}</p>
        <Button onClick={() => setShowCopyModal(false)}>{lang.close}</Button>
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
