import React from 'react';
import './ConfirmationModal.css';
 
 
const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }
 
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <h3 className='sure'>Are you sure you want to submit the form?</h3>
        <p className='sure'>The form will be permanently stored in the database.</p>
        <div className="button-container">
          <button className='cancelButton' onClick={onCancel}>Cancel</button>
          <button className='proceedButton' onClick={onConfirm}>Proceed</button>
        </div>
      </div>
    </div>
  );
};
 
export default ConfirmationModal;