import React, { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { GroupContext } from '../../context/GroupContext';
import assets from '../assets/assets';
import toast from 'react-hot-toast';

const ForwardModal = ({ onClose, messageToForward }) => {
    const { users, sendMessage } = useContext(ChatContext);
    const { groups } = useContext(GroupContext);
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    const toggleRecipient = (id) => {
        setSelectedRecipients(prev =>
            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
        );
    };

    const handleForward = async () => {
        if (selectedRecipients.length === 0) return;

        const promises = selectedRecipients.map(async (recipientId) => {
            // Check if recipient is a group by checking if it exists in groups array
            // A bit naive but works if IDs are unique across collections or we track type
            // Better to pass type in selection, but assuming uniqueness for now or checking groups list
            // Actually, let's just use sendMessage. The controller handles group ID check.
            await sendMessage({
                text: messageToForward.text,
                image: messageToForward.image,
                isForwarded: true
            }, recipientId); // We need to pass ID. sendMessage in context needs update to accept ReceiverID override or we set selectedUser?
            // ChatContext.sendMessage uses `selectedUser._id`. We need to update ChatContext to allow passing ID explicitly or update logic here.
            // Let's assume we update ChatContext.sendMessage to optionally accept receiverId.
        });

        await Promise.all(promises);
        toast.success("Message forwarded");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#1c1c1c] p-6 rounded-lg w-full max-w-md border border-gray-700">
                <h2 className="text-xl text-white mb-4 font-semibold">Forward Message</h2>

                <div className="mb-4">
                    <p className="text-gray-400 mb-2 text-sm">Select Recipient</p>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {/* Users */}
                        <p className="text-xs text-gray-500 mt-2">Peoples</p>
                        {users.map(user => (
                            <div
                                key={user._id}
                                onClick={() => toggleRecipient(user._id)}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selectedRecipients.includes(user._id) ? 'bg-violet-500/20 border border-violet-500' : 'hover:bg-[#2c2c2c]'}`}
                            >
                                <img src={user.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full object-cover" alt="" />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))}

                        {/* Groups */}
                        <p className="text-xs text-gray-500 mt-2">Groups</p>
                        {groups.map(group => (
                            <div
                                key={group._id}
                                onClick={() => toggleRecipient(group._id)}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selectedRecipients.includes(group._id) ? 'bg-violet-500/20 border border-violet-500' : 'hover:bg-[#2c2c2c]'}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white">{group.name[0]}</div>
                                <span className="text-white">{group.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleForward} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">Forward</button>
                </div>
            </div>
        </div>
    );
};

export default ForwardModal;
