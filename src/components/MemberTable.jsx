import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditMemberModal from './EditMemberModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteMember, getMember, updateMember } from '../ApiCentral';
import ErrorModal from './ErrorModal';
import '../App.css';

const MemberTable = ({ members, fetchMembers, tokens }) => {
    const [editingMember, setEditingMember] = useState(null);
    const [deletingMemberId, setDeletingMemberId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleApiError = (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                navigate('/login');
            } else if (status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                setErrorMessage(`Backend Servers are Overwhelmed right now, retry after ${retryAfter} seconds`);
                setIsErrorModalOpen(true);
            } else if (status === 409 || status === 400) {
                const errorFromResponse = error.response.data.email || error.response.data.error;
                setErrorMessage(errorFromResponse);
                setIsErrorModalOpen(true);
            } else {
                console.error('API error:', error);
            }
        } else {
            console.error('Failed to connect to API:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await getMember(id);
            setEditingMember(data);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMember(id);
            setDeletingMemberId(null);
            fetchMembers();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSaveEdit = async (id, updatedMember) => {
        try {
            await updateMember(id, updatedMember);
            setEditingMember(null);
            fetchMembers();
        } catch (error) {
            handleApiError(error);
        }
    };

    const closeModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.phoneNumber}</td>
                            <td className="actions">
                                <button onClick={() => handleEdit(member.id)}>Edit</button>
                                <button onClick={() => setDeletingMemberId(member.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingMember && (
                <EditMemberModal
                    member={editingMember}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingMember(null)}
                />
            )}
            {deletingMemberId && (
                <DeleteConfirmModal
                    onConfirm={() => handleDelete(deletingMemberId)}
                    onCancel={() => setDeletingMemberId(null)}
                />
            )}
            {isErrorModalOpen && (
                <ErrorModal errorMessage={errorMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default MemberTable;
