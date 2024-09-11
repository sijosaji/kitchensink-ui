import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../ApiCentral';
import ErrorModal from './ErrorModal'; // Import ErrorModal component
import '../LoginPage.css';

const LoginPage = ({ setTokens }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // Error state
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Modal control state
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username) {
            newErrors.username = 'Username is required';
        } else if (!emailRegex.test(username)) {
            newErrors.username = 'Username must be a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const { data } = await login({ username, password });
            setTokens(data.accessToken, data.refreshToken);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && (error.response.status === 403 || error.response.status === 403) ) {
                setErrorMessage('Invalid username or password'); // Set error message for 401
                setIsErrorModalOpen(true); // Open modal
            } else {
                console.error('Login failed', error);
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
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}

                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate('/register')}>Register</button>
            </form>
            {isErrorModalOpen && (
                <ErrorModal errorMessage={errorMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default LoginPage;
