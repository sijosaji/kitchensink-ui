import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../ApiCentral';
import ErrorModal from './ErrorModal'; // Import ErrorModal component
import '../RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for success banner
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // Error state
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Modal control state
    const navigate = useNavigate();

    const roles = ["MEMBERS:READ", "MEMBERS:WRITE", "MEMBERS:DELETE"];

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username) {
            errors.username = "Username (email) is required";
        } else if (!emailRegex.test(username)) {
            errors.username = "Username must be a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        try {
            await register({ username, password, roles });
            setRegistrationSuccess(true); // Set success to true
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after a delay
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMessage(error.response.data.error); // Set error message
                setIsErrorModalOpen(true); // Open modal
            } else {
                console.error('Registration failed', error);
                setErrorMessage('An unexpected error occurred. Please try again.'); // Fallback error message
                setIsErrorModalOpen(true); // Open modal
            }
        }
    };

    const closeModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        <div className="register-container">
            {registrationSuccess && (
                <div className="success-banner">
                    Registration successful! Redirecting to login...
                </div>
            )}
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Username (email)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <div className="error">{errors.username}</div>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="error">{errors.password}</div>}
                <button type="submit">Register</button>
            </form>
            {isErrorModalOpen && (
                <ErrorModal errorMessage={errorMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default RegisterPage;
