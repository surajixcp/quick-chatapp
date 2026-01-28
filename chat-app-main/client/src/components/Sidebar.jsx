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
    <div className={`bg-[#8185B2]/10 h-full flex flex-col rounded-r-xl overflow-hidden text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='p-5 pb-0 flex-1 overflow-y-auto custom-scrollbar'>
        <div className='pb-5'>
          <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="" className='max-w-40' />
            <div className='flex items-center gap-2'>
              <button onClick={() => setShowAddFriend(true)} className='p-2 hover:bg-white/10 rounded-full transition-colors' title="Add Connection">
                <UserPlus className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
              <button onClick={() => setShowCreateGroup(true)} className='p-2 hover:bg-white/10 rounded-full transition-colors' title="Create Group">
                <Users className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
              <div onClick={() => navigate('/profile')} className='relative group cursor-pointer ml-1'>
                <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-violet-500 transition-all' title="My Profile" />
              </div>
              <div className='relative py-2 group'>
                <MoreVertical className='w-5 h-5 cursor-pointer text-gray-300 hover:text-white' />
                <div className='absolute top-full right-0 z-20 w-32 p-1 rounded-lg bg-[#282142] border border-gray-700 shadow-xl text-gray-100 hidden group-hover:block overflow-hidden'>
                  <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm p-3 hover:bg-white/5 transition-colors'>Edit Profile</p>
                  <div className='h-[1px] bg-gray-700 mx-2'></div>
                  <p onClick={() => logout()} className='cursor-pointer text-sm p-3 hover:bg-white/5 transition-colors text-red-400'>Logout</p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5 border border-transparent focus-within:border-violet-500/50 transition-all'>
            <Search className='w-4 h-4 text-gray-400' />
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1'
              placeholder='Search Connections...'
            />
          </div>

        </div>

        <div className='flex flex-col gap-4'>
          {/* Groups Section */}
          {(activeTab === 'groups' || window.innerWidth >= 768) && filteredGroups.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs mb-2 pl-4 uppercase font-semibold tracking-wider">Groups</p>
              {filteredGroups.map((group) => (
                <div
                  onClick={() => { setSelectedUser(group); }} // Treating group as user for selection
                  key={group._id}
                  className={`relative flex items-center gap-3 p-2 pl-4 rounded-lg cursor-pointer transition-colors max-sm:text-sm ${selectedUser?._id === group._id ? 'bg-violet-600' : 'hover:bg-white/5'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white border border-indigo-400/30">{group.name[0]}</div>
                  <div className='flex flex-col leading-5'>
                    <p className='font-medium'>{group.name}</p>
                    <p className='text-xs text-gray-400 group-hover:text-gray-300'>{group.members.length} members</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users Section */}
          {(activeTab === 'chats' || window.innerWidth >= 768) && (
            <div>
              <p className="text-gray-400 text-xs mb-2 pl-4 uppercase font-semibold tracking-wider">Connections</p>
              {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                <div
                  onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
                  key={index}
                  className={`relative flex items-center gap-3 p-2 pl-4 rounded-lg cursor-pointer transition-colors max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-violet-600' : 'hover:bg-white/5'}`}
                >
                  <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover border border-white/10' />
                  <div className='flex flex-col leading-5'>
                    <p className='font-medium'>{user.fullName}</p>
                    <div className='flex items-center gap-2'>
                      {onlineUsers.includes(user._id) ? (
                        <>
                          <span className='w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]'></span>
                          <span className={`text-xs ${selectedUser?._id === user._id ? 'text-green-200' : 'text-green-400'}`}>Online</span>
                        </>
                      ) : (
                        <>
                          <span className='w-2 h-2 rounded-full bg-gray-500'></span>
                          <span className='text-gray-400 text-xs'>Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                  {unseenMessages[user._id] > 0 && (
                    <p className='absolute top-1/2 -translate-y-1/2 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-red-500 text-white font-bold shadow-md'>
                      {unseenMessages[user._id]}
                    </p>
                  )}
                </div>
              )) : (
                <div className='text-center text-gray-400 mt-10 text-sm flex flex-col items-center gap-2'>
                  <p>No connections yet.</p>
                  <button onClick={() => setShowAddFriend(true)} className="flex items-center gap-2 text-violet-400 hover:text-violet-300 cursor-pointer px-4 py-2 rounded-full hover:bg-white/5 transition-colors">
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
      <div className="p-4 border-t border-white/5 bg-[#282142]/30 backdrop-blur-sm text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Developer</p>
        <p className="text-sm font-medium text-violet-300">Suraj Giri</p>
        <p className="text-[10px] text-gray-400">Senior Software Developer</p>
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showAddFriend && <AddFriendModal onClose={() => setShowAddFriend(false)} />}
    </div>
  )
}

export default Sidebar
