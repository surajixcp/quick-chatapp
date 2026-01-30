import React, { useContext, useState } from 'react';
import { GroupContext } from '../../context/GroupContext';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const CreateGroupModal = ({ onClose }) => {
    const { createGroup } = useContext(GroupContext);
    const { users } = useContext(ChatContext);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const toggleMember = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;
        if (selectedMembers.length === 0) return;

        const success = await createGroup(groupName, selectedMembers);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-xl text-white mb-4 font-semibold">Create New Group</h2>

                <input
                    type="text"
                    placeholder="Group Name"
                    className="w-full bg-black/30 text-white p-3 rounded-xl mb-4 outline-none border border-white/5 focus:border-violet-500 transition-all placeholder-gray-500"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="mb-4">
                    <p className="text-gray-400 mb-2 text-sm">Select Members</p>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                        {users.map(user => (
                            <div
                                key={user._id}
                                onClick={() => toggleMember(user._id)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedMembers.includes(user._id) ? 'bg-violet-500/20 border border-violet-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <img src={user.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full object-cover" alt="" />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/30 text-white rounded-xl font-medium transition-all active:scale-95">Create Group</button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
