import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

const ModalFeedback = ({ isOpen, onRequestClose, lang }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{lang.feedback}</h2>
      <p>Feedback form placeholder</p>
      <Button onClick={onRequestClose}>{lang.close}</Button>
    </Modal>
  );
};

export default ModalFeedback;
