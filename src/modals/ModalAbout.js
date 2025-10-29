import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

const ModalAbout = ({ isOpen, onRequestClose, lang }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{lang.about}</h2>
      <p>About page placeholder</p>
      <Button onClick={onRequestClose}>{lang.close}</Button>
    </Modal>
  );
};

export default ModalAbout;
