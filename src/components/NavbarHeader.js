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
  const isDesktop = useMediaQuery({ minWidth: 576 });

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
      .catch(() => setAllLangData({ uk: lang }));
  }, [lang]);

  // const handleLanguageSelect = (langCode) => {
  //   if (allLangData?.[langCode]) {
  //     localStorage.setItem("appLanguage", langCode);
  //     onLanguageChange(allLangData[langCode]);
  //     setShowLanguageModal(false);
  //   }
  // };

  // src/components/NavbarHeader.js - фрагмент для handleLanguageSelect (замінити існуючий)
  const handleLanguageSelect = (langCode) => {
    if (allLangData) {
      const langObj = {};
      Object.keys(allLangData).forEach((key) => {
        langObj[key] = allLangData[key][langCode] || allLangData[key].uk || "";
      });
      localStorage.setItem("appLanguage", langCode);
      onLanguageChange(langObj);
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
      expand="sm"
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
