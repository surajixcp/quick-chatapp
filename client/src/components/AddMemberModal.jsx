import React, { useContext, useState } from 'react';
import { GroupContext } from '../../context/GroupContext';
import { ChatContext } from '../../context/ChatContext';
import { X } from 'lucide-react';
import assets from '../assets/assets';

const AddMemberModal = ({ group, onClose }) => {
    const { addMemberToGroup } = useContext(GroupContext);
    const { users } = useContext(ChatContext);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Filter out users who are already members
    const availableUsers = users.filter(user => !group.members.some(member => member._id === user._id));

    const toggleMember = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        if (selectedMembers.length === 0) return;

        // Add members one by one (could be optimized to bulk add in backend later if needed)
        for (const userId of selectedMembers) {
            await addMemberToGroup(group._id, userId);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#1c1c1c] p-6 rounded-lg w-full max-w-md border border-gray-700 animate-fade-in-up relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl text-white mb-4 font-semibold">Add Members</h2>

                {availableUsers.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
                        {availableUsers.map(user => (
                            <div
                                key={user._id}
                                onClick={() => toggleMember(user._id)}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedMembers.includes(user._id) ? 'bg-violet-500/20 border border-violet-500' : 'hover:bg-[#2c2c2c]'}`}
                            >
                                <img src={user.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full object-cover" alt="" />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center mb-6">No new users to add.</p>
                )}

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedMembers.length === 0}
                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Selected
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
