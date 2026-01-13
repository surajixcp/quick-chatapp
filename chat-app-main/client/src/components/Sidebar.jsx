import React, { useEffect, useState, useContext } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { GroupContext } from '../../context/GroupContext'
import CreateGroupModal from './CreateGroupModal'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers, authUser, socket } = useContext(AuthContext);
  const { groups } = useContext(GroupContext);
  const [input, setInput] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
  const filteredGroups = input ? groups.filter((group) => group.name.toLowerCase().includes(input.toLowerCase())) : groups;

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="" className='max-w-40' />
          <div className='flex items-center gap-2'>
            <button onClick={() => setShowCreateGroup(true)} className='p-2 hover:bg-[#282142] rounded-full' title="Create Group">
              <span className="text-xl">+</span>
            </button>
            <div onClick={() => navigate('/profile')} className='relative group cursor-pointer'>
              <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-violet-500 transition-all' title="My Profile" />
            </div>
            <div className='relative py-2 group'>
              <img src={assets.menu_icon} alt="" className='max-h-5 cursor-pointer' />
              <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                <hr className='my-2 border-t border-gray-500' />
                <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search User/Group...'
          />
        </div>

      </div>

      <div className='flex flex-col gap-4'>
        {/* Groups Section */}
        {filteredGroups.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs mb-2 pl-4">Groups</p>
            {filteredGroups.map((group) => (
              <div
                onClick={() => { setSelectedUser(group); }} // Treating group as user for selection
                key={group._id}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === group._id && 'bg-[#282142]/50'}`}
              >
                <div className="w-[35px] aspect-[1/1] rounded-full bg-violet-600 flex items-center justify-center text-white">{group.name[0]}</div>
                <div className='flex flex-col leading-5'>
                  <p>{group.name}</p>
                  <p className='text-xs text-gray-400'>{group.members.length} members</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Section */}
        <div>
          <p className="text-gray-400 text-xs mb-2 pl-4">Peoples</p>
          {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
            <div
              onClick={() => { setSelectedUser(user); setUnseenMessages(prev => ({ ...prev, [user._id]: 0 })) }}
              key={index}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
            >
              <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
              <div className='flex flex-col leading-5'>
                <p>{user.fullName}</p>
                <div className='flex items-center gap-2'>
                  {onlineUsers.includes(user._id) ? (
                    <>
                      <span className='w-2 h-2 rounded-full bg-green-500'></span>
                      <span className='text-green-400 text-xs'>Online</span>
                    </>
                  ) : (
                    <>
                      <span className='w-2 h-2 rounded-full bg-gray-500'></span>
                      <span className='text-neutral-400 text-xs'>Offline</span>
                    </>
                  )}
                </div>
              </div>
              {unseenMessages[user._id] > 0 && (
                <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          )) : (
            <div className='text-center text-gray-400 mt-2 text-sm'>
              No users found
            </div>
          )}
        </div>
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </div>
  )
}

export default Sidebar
