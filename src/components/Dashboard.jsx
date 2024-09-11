import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMember, listMembers } from '../ApiCentral';
import MemberTable from './MemberTable';
import ErrorModal from './ErrorModal';
import '../App.css';

const Dashboard = ({ tokens }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [members, setMembers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const hasFetchedMembers = useRef(false);

    const fetchMembers = useCallback(async () => {
        try {
            const { data } = await listMembers();
            setMembers(data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else if (error.response.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                setErrorMessage(`Backend Servers are Overwhelmed right now retry after ${retryAfter} seconds`);
                setIsErrorModalOpen(true);
            }
            
            console.error('Failed to fetch members', error);
        }
    }, [navigate]);

    useEffect(() => {
        if (!hasFetchedMembers.current) {
            fetchMembers();
            hasFetchedMembers.current = true;
        }
    }, [fetchMembers]);

    const validateForm = () => {
        const errors = {};
        const nameRegex = /^[^0-9]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,12}$/;

        if (!name || name.length < 1 || name.length > 25 || !nameRegex.test(name)) {
            errors.name = 'Name must be between 1 and 25 characters and must not contain numbers';
        }

        if (!email || !emailRegex.test(email)) {
            errors.email = 'Email must be a valid email address and not empty';
        }

        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            errors.phoneNumber = 'Phone number must be between 10 and 12 digits';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await createMember({ name, email, phoneNumber });
            setName('');
            setEmail('');
            setPhoneNumber('');
            setValidationErrors({}); 
            fetchMembers(); // Call fetchMembers again after creating a member
        } catch (error) {
            if (error.response && (error.response.status === 409 || error.response.status === 400)) {
                const errorFromResponse = error.response.data.email || error.response.data.name || error.response.data.error;
                setErrorMessage(errorFromResponse);
                setIsErrorModalOpen(true);
            } else if (error.response.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                setErrorMessage(`Backend Servers are Overwhelmed right now retry after ${retryAfter} seconds`);
                setIsErrorModalOpen(true);
            }
            
            else if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                console.error('Failed to create member', error);
            }
        }
    };

    const closeModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="header">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                
                <input
                    type="text"
                    placeholder="Phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                {validationErrors.phoneNumber && <div className="error">{validationErrors.phoneNumber}</div>}
                
                <button type="submit">Add Member</button>
            </form>
            <MemberTable members={members} fetchMembers={fetchMembers} tokens={tokens} />
            {isErrorModalOpen && (
                <ErrorModal errorMessage={errorMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default Dashboard;
