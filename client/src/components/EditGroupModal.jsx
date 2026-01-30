import React, { useState, useContext } from 'react';
import { GroupContext } from '../../context/GroupContext';
import { Camera, X } from 'lucide-react';
import assets from '../assets/assets';

const EditGroupModal = ({ group, onClose }) => {
    const { updateGroup } = useContext(GroupContext);
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || "");
    const [image, setImage] = useState(null); // Base64 string for preview/upload
    const [previewImage, setPreviewImage] = useState(group.image || assets.avatar_icon);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateGroup(group._id, name, image, description); // image passed only if changed
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#1c1c1c] p-6 rounded-lg w-full max-w-md border border-gray-700 relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl text-white mb-6 font-semibold">Edit Group Info</h2>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer">
                        <img
                            src={previewImage || assets.avatar_icon}
                            alt="Group Icon"
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#2c2c2c] group-hover:border-violet-500 transition-colors"
                        />
                        <label htmlFor="group-image" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-8 h-8 text-white" />
                        </label>
                        <input type="file" id="group-image" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Click to change group icon</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Group Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#2c2c2c] text-white p-3 rounded-lg outline-none border border-gray-600 focus:border-violet-500"
                            placeholder="Enter group name"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#2c2c2c] text-white p-3 rounded-lg outline-none border border-gray-600 focus:border-violet-500 resize-none h-24"
                            placeholder="Enter group description"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditGroupModal;
