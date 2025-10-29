import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

const ModalAdmin = ({ isOpen, onRequestClose, lang }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{lang.admin}</h2>
      <p>Admin panel placeholder</p>
      <Button onClick={onRequestClose}>{lang.close}</Button>
    </Modal>
  );
};

export default ModalAdmin;
