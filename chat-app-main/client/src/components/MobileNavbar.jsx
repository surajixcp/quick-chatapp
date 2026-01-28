import React from 'react';
import { MessageSquare, Users, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileNavbar = ({ activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#282142]/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around py-3 px-6 z-50">
            <button
                onClick={() => setActiveTab('chats')}
                className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'chats' ? 'text-violet-400' : 'text-gray-400'}`}
            >
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px] font-medium">Chats</span>
            </button>

            <button
                onClick={() => setActiveTab('groups')}
                className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'groups' ? 'text-violet-400' : 'text-gray-400'}`}
            >
                <Users className="w-6 h-6" />
                <span className="text-[10px] font-medium">Groups</span>
            </button>

            <button
                onClick={() => navigate('/profile')}
                className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-violet-400' : 'text-gray-400'}`}
            >
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">Profile</span>
            </button>

            <button
                onClick={onLogout}
                className="flex flex-col items-center gap-1 text-red-400/80 transition-colors"
            >
                <LogOut className="w-6 h-6" />
                <span className="text-[10px] font-medium">Logout</span>
            </button>
        </div>
    );
};

export default MobileNavbar;
