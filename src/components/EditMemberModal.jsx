import React, { useState } from 'react';
import '../App.css';

const EditMemberModal = ({ member, onSave, onClose }) => {
    const [name, setName] = useState(member.name || '');
    const [email, setEmail] = useState(member.email || '');
    const [phoneNumber, setPhone] = useState(member.phoneNumber || '');
    const [errors, setErrors] = useState({});

    const validateName = (name) => {
        if (name && (name.length < 1 || name.length > 25)) return "Name must be between 1 and 25 characters";
        if (/\d/.test(name)) return "Name must not contain numbers";
        return null;
    };

    const validateEmail = (email) => {
        if (email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) return "Invalid email format";
        }
        return null;
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (phoneNumber && (phoneNumber.length < 10 || phoneNumber.length > 12)) return "Phone number must be between 10 and 12 digits";
        if (phoneNumber && !/^\d+$/.test(phoneNumber)) return "Phone number must contain only digits";
        return null;
    };

    const validateForm = () => {
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const phoneNumberError = validatePhoneNumber(phoneNumber);

        const newErrors = {
            name: nameError,
            email: emailError,
            phoneNumber: phoneNumberError,
        };

        setErrors(newErrors);
        return !nameError && !emailError && !phoneNumberError;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(member.id, { name, email, phoneNumber });
        }
    };

    return (
        <div className="modal">
            <h2>Edit Member</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="error-message">{errors.name}</div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error-message">{errors.email}</div>
            <input
                type="text"
                placeholder="Phone"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
            />
            <div className="error-message">{errors.phoneNumber}</div>
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default EditMemberModal;
