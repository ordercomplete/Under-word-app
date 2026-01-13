import React, { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import ModalFeedback from "./ModalFeedback";
import ModalAbout from "./ModalAbout";
import ModalAdmin from "./ModalAdmin"; // Додано

const DropdownMenu = ({ lang }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false); // Додано
  const [isClassicUI, setIsClassicUI] = useState(false);

  const handleReset = () => {
    alert(lang.reset_all);
  };

  return (
    <>
      <NavDropdown.Item
        href="/downloads"
        target="_blank"
        className="hidden-touch"
      >
        {lang.download_app}
      </NavDropdown.Item>
      <NavDropdown.Item href="https://www.stepbible.org/videos" target="_blank">
        {lang.videos}
      </NavDropdown.Item>
      <NavDropdown.Item
        href="https://stepbibleguide.blogspot.com"
        target="_blank"
      >
        {lang.user_guide}
      </NavDropdown.Item>
      <NavDropdown.Item
        href="https://stepweb.atlassian.net/wiki/display/SUG/Resources"
        target="_blank"
      >
        {lang.available_bibles}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => setIsClassicUI(!isClassicUI)}>
        {lang.classic_interface}{" "}
        {isClassicUI && (
          <i className="bi bi-check" style={{ fontSize: "11px" }}></i>
        )}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleReset}>
        {lang.reset_all}
      </NavDropdown.Item>
      <NavDropdown.Item
        href="https://stepbibleguide.blogspot.com/p/volunteers.html"
        target="_blank"
      >
        {lang.help_us}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => setShowFeedbackModal(true)}>
        {lang.feedback}
      </NavDropdown.Item>
      <NavDropdown.Item href="/cookies-policy" target="_blank">
        {lang.privacy_policy}
      </NavDropdown.Item>
      <NavDropdown.Item
        href="https://stepbibleguide.blogspot.com/p/copyrights-licences.html"
        target="_blank"
      >
        {lang.copyright}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => setShowAboutModal(true)}>
        {lang.about}
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => setShowAdminModal(true)}>
        {lang.admin}
      </NavDropdown.Item>

      {/* Modals */}
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
    </>
  );
};

export default DropdownMenu;
