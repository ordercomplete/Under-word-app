import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

const ModalLanguage = ({ isOpen, onRequestClose, lang }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{lang.language}</h2>
      <p>Language selection: Ukrainian, English, Russian</p>
      <Button onClick={onRequestClose}>{lang.close}</Button>
    </Modal>
  );
};

export default ModalLanguage;
