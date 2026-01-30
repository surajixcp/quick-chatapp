
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative animate-fade-in-up">
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
                        className="flex-1 bg-black/30 text-white p-3 rounded-xl border border-white/10 focus:border-violet-500 outline-none transition-colors placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 transition-all font-medium active:scale-95"
                    >
                        {loading ? '...' : 'Search'}
                    </button>
                </form>

                {foundUser && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
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
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-green-500/30 text-sm transition-all active:scale-95"
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
