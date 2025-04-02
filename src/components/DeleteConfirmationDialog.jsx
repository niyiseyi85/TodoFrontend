import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmationDialog = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this todo?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationDialog;