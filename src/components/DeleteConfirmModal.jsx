import React from 'react';
import '../App.css';

const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <h2>Are you sure?</h2>
            <button onClick={onConfirm}>Yes, delete it</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default DeleteConfirmModal;
