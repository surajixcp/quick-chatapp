
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const AddFriendModal = ({ onClose }) => {
    const [searchUsername, setSearchUsername] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { axios } = useContext(AuthContext);
    const { getUsers } = useContext(ChatContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;

        setLoading(true);
        try {
            const query = searchUsername.replace('@', '');
            const { data } = await axios.get(`/api/auth/search?username=${query}`);
            if (data.success) {
                setFoundUser(data.user);
            } else {
                setFoundUser(null);
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            setFoundUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async () => {
        if (!foundUser) return;
        try {
            const { data } = await axios.post('/api/auth/add-friend', { friendId: foundUser._id });
            if (data.success) {
                toast.success(data.message);
                getUsers(); // Refresh sidebar list
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#1e1e2d] p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Connection</h2>

                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        placeholder="Enter username (e.g. john1234)"
                        className="flex-1 bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-violet-500 outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? '...' : 'Search'}
                    </button>
                </form>

                {foundUser && (
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={foundUser.profilePic || "/avatar.png"} alt="" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="text-white font-medium">{foundUser.fullName}</p>
                                <p className="text-xs text-gray-400">@{foundUser.username}</p>
                            </div>
                        </div>
                        {foundUser.isFriend ? (
                            <span className="text-green-500 text-sm font-medium px-3 py-1 bg-green-500/10 rounded-full">Connected</span>
                        ) : (
                            <button
                                onClick={handleAddFriend}
                                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm transition-colors shadow-lg hover:shadow-green-500/20"
                            >
                                Add +
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddFriendModal;
