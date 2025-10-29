import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

const ModalFont = ({ isOpen, onRequestClose, lang }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{lang.font}</h2>
      <p>Font settings placeholder</p>
      <Button onClick={onRequestClose}>{lang.close}</Button>
    </Modal>
  );
};

export default ModalFont;
