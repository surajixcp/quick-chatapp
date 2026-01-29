import React, { useEffect, useState, useContext } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { GroupContext } from '../../context/GroupContext'
import CreateGroupModal from './CreateGroupModal'
import AddFriendModal from './AddFriendModal'
import { Search, UserPlus, Users, MoreVertical, Settings } from 'lucide-react'

const Sidebar = ({ activeTab }) => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers, authUser, socket } = useContext(AuthContext);
  const { groups } = useContext(GroupContext);
  const [input, setInput] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
  const filteredGroups = input ? groups.filter((group) => group.name.toLowerCase().includes(input.toLowerCase())) : groups;

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, onlineUsers])

  return (
    <div className={`h-full flex flex-col overflow-hidden text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='p-6 pb-0 flex-1 overflow-y-auto custom-scrollbar'>
        <div className='pb-6'>
          <div className='flex justify-between items-center mb-6 pl-2'>
            <img src={assets.logo} alt="" className='max-w-36 hover:opacity-90 transition-opacity cursor-pointer' />
            <div className='flex items-center gap-2'>
              <button onClick={() => setShowAddFriend(true)} className='p-2.5 hover:bg-white/10 rounded-full transition-all hover:scale-110' title="Add Connection">
                <UserPlus className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <button onClick={() => setShowCreateGroup(true)} className='p-2.5 hover:bg-white/10 rounded-full transition-all hover:scale-110' title="Create Group">
                <Users className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <div onClick={() => navigate('/profile')} className='relative group cursor-pointer ml-2'>
                <div className="absolute inset-0 bg-violet-500 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-violet-400 transition-all relative z-10' title="My Profile" />
              </div>
              <div className='relative py-2 group ml-1'>
                <MoreVertical className='w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition-colors' />
                <div className='absolute top-full right-0 z-50 w-40 p-2 rounded-2xl bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/10 shadow-xl text-gray-100 hidden group-hover:block overflow-hidden origin-top-right transform transition-all'>
                  <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm font-medium p-3 hover:bg-white/10 rounded-xl transition-colors'>Edit Profile</p>
                  <div className='h-[1px] bg-white/10 mx-2 my-1'></div>
                  <p onClick={() => logout()} className='cursor-pointer text-sm font-medium p-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-400'>Logout</p>
                </div>
              </div>
            </div>
          </div>


          <div className='bg-white/5 backdrop-blur-sm rounded-2xl flex items-center gap-4 py-3.5 px-5 mt-6 border border-white/5 focus-within:border-violet-500/50 focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(124,58,237,0.1)] transition-all duration-300'>
            <Search className='w-5 h-5 text-gray-400' />
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className='bg-transparent border-none outline-none text-white text-base placeholder-gray-500 flex-1 font-medium tracking-wide'
              placeholder='Search Chat...'
            />
          </div>

        </div>

        <div className='flex flex-col gap-6 pb-6'>
          {/* Groups Section */}
          {(activeTab === 'groups' || window.innerWidth >= 768) && filteredGroups.length > 0 && (
            <div className="px-2">
              <p className="text-gray-500 text-xs mb-4 pl-3 uppercase font-bold tracking-widest leading-loose">Groups</p>
              <div className="space-y-3">
                {filteredGroups.map((group) => (
                  <div
                    onClick={() => { setSelectedUser(group); }} // Treating group as user for selection
                    key={group._id}
                    className={`relative flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 group max-sm:text-sm ${selectedUser?._id === group._id
                      ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border border-violet-500/20 shadow-lg'
                      : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-2 shadow-inner transition-transform duration-300 overflow-hidden ${selectedUser?._id === group._id
                      ? 'bg-violet-600 border-violet-400 scale-105'
                      : 'bg-white/10 border-transparent group-hover:scale-105'
                      }`}>
                      {group.name[0]}
                    </div>
                    <div className='flex flex-col gap-0.5'>
                      <p className={`font-semibold text-base ${selectedUser?._id === group._id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{group.name}</p>
                      <p className='text-xs text-gray-500 group-hover:text-gray-400 transition-colors'>{group.members.length} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Section */}
          {(activeTab === 'chats' || window.innerWidth >= 768) && (
            <div className="px-2">
              <p className="text-gray-500 text-xs mb-4 pl-3 uppercase font-bold tracking-widest leading-loose">Connections</p>
              {filteredUsers.length > 0 ? (
                <div className="space-y-3">
                  {filteredUsers.map((user, index) => (
                    <div
                      onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                      key={index}
                      className={`relative flex items-center gap-4 p-3.5 rounded-3xl cursor-pointer transition-all duration-300 group max-sm:text-sm border border-transparent ${selectedUser?._id === user._id
                        ? 'bg-white/10 border-white/5 shadow-lg backdrop-blur-md'
                        : 'hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                      <div className="relative">
                        <img
                          src={user?.profilePic || assets.avatar_icon}
                          alt=""
                          className={`w-11 h-11 rounded-full object-cover border-2 shadow-sm transition-transform duration-300 ${selectedUser?._id === user._id ? 'border-violet-400 scale-105' : 'border-transparent group-hover:scale-105'}`}
                        />
                        {onlineUsers.includes(user._id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#100b21] rounded-full shadow-sm"></span>
                        )}
                      </div>

                      <div className='flex flex-col flex-1 min-w-0 gap-0.5'>
                        <div className="flex justify-between items-center">
                          <p className={`font-semibold text-[15px] truncate ${selectedUser?._id === user._id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{user.fullName}</p>
                          {onlineUsers.includes(user._id) && selectedUser?._id !== user._id && (
                            <span className="text-[10px] items-center gap-1 text-green-400 font-medium hidden group-hover:flex">
                              On
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${selectedUser?._id === user._id ? 'text-violet-200' : 'text-gray-500 group-hover:text-gray-400'}`}>
                          {user.bio || "Available"}
                        </p>
                      </div>

                      {unseenMessages[user._id] > 0 && (
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 min-w-[22px] h-[22px] px-1.5 flex justify-center items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[11px] text-white font-bold shadow-lg ring-2 ring-black'>
                          {unseenMessages[user._id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center text-gray-500 mt-12 text-sm flex flex-col items-center gap-4'>
                  <div className="p-4 bg-white/5 rounded-full">
                    <Users className="w-8 h-8 opacity-50" />
                  </div>
                  <p>No connections yet.</p>
                  <button onClick={() => setShowAddFriend(true)} className="flex items-center gap-2 text-white bg-violet-600 hover:bg-violet-700 cursor-pointer px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-violet-900/20 active:scale-95 text-xs font-semibold uppercase tracking-wide">
                    <UserPlus className="w-4 h-4" />
                    <span>Add someone</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Developer Details Footer */}
      <div className="p-4 border-t border-white/5 bg-black/10 backdrop-blur-sm text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Developer</p>
        <p className="text-sm font-medium text-violet-300">Suraj Giri</p>
        <p className="text-[10px] text-gray-400">Senior Software Developer</p>
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showAddFriend && <AddFriendModal onClose={() => setShowAddFriend(false)} />}
    </div >
  )
}

export default Sidebar
