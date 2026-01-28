import React, { useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import { useContext } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LogOut, Image, Link, Ban, UserX, UserCheck, X } from 'lucide-react'

const RightSidebar = ({ onClose }) => {


  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers, authUser, axios } = useContext(AuthContext);
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const [msgImages, setMsgImages] = useState([]);
  const [msgLinks, setMsgLinks] = useState([]);

  useEffect(() => {
    const images = [];
    const links = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    messages.forEach(msg => {
      if (msg.image) {
        images.push(msg.image);
      }
      if (msg.text) {
        const foundLinks = msg.text.match(urlRegex);
        if (foundLinks) {
          links.push(...foundLinks);
        }
      }
    });

    setMsgImages(images);
    setMsgLinks(links);
  }, [messages]);

  return selectedUser ? (
    <div className={`text-white w-full h-full relative overflow-y-scroll bg-black/40 backdrop-blur-xl`}>
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className='absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full md:hidden z-30 transition-colors'
      >
        <X className='w-5 h-5 text-white' />
      </button>

      <div className='pt-12 flex flex-col items-center gap-4 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-24 aspect-[1/1] rounded-full object-cover border-4 border-white/5 shadow-2xl' />
        <div className='flex flex-col items-center'>
          <h1 className='text-xl font-semibold flex items-center gap-2'>
            {selectedUser?.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className='w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'></span>}
          </h1>
          <p className='text-gray-400 mt-1 max-w-[200px] text-center'>{selectedUser.bio || "No bio available"}</p>
        </div>
      </div>
      <hr className='border-gray-700/50 my-6 mx-5' />

      <div className='px-5 text-xs'>
        <div className='flex items-center gap-2 mb-3 text-gray-300'>
          <Image className="w-4 h-4" />
          <p className='font-medium uppercase tracking-wide'>Media ({msgImages.length})</p>
        </div>
        {msgImages.length > 0 ? (
          <div className='max-h-[150px] overflow-y-auto grid grid-cols-3 gap-2 opacity-80 mb-6'>
            {msgImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded-lg overflow-hidden aspect-square border border-white/5'>
                <img src={url} alt="" className='w-full h-full object-cover hover:scale-110 transition-transform duration-300' />
              </div>
            ))}
          </div>
        ) : <p className='text-gray-500 mb-6 italic pl-6'>No shared media</p>}

        <div className='flex items-center gap-2 mb-3 text-gray-300'>
          <Link className="w-4 h-4" />
          <p className='font-medium uppercase tracking-wide'>Links ({msgLinks.length})</p>
        </div>
        {msgLinks.length > 0 ? (
          <div className='max-h-[150px] overflow-y-auto flex flex-col gap-2 opacity-80 mb-6'>
            {msgLinks.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer" className='truncate bg-white/5 p-2 rounded hover:bg-white/10 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2'>
                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                {link}
              </a>
            ))}
          </div>
        ) : <p className='text-gray-500 mb-6 italic pl-6'>No shared links</p>}

      </div>

      <div className='px-5 text-xs group'>
        <p className='mb-3 font-medium text-gray-300 uppercase tracking-wide'>Themes</p>
        <div className='flex gap-3 mb-6'>
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-8 h-8 rounded-full border-2 ${theme === t ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'} transition-all duration-300 cursor-pointer`}
              style={{ background: t === 'default' ? '#1e1e2d' : t === 'ocean' ? 'linear-gradient(135deg, #1e3a8a, #155e75)' : t === 'sunset' ? 'linear-gradient(135deg, #312e81, #4c1d95)' : 'linear-gradient(135deg, #111827, #064e3b)' }}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            />
          ))}
        </div>

        <p className='mb-3 font-medium text-gray-300 uppercase tracking-wide'>Actions</p>
        <div className='flex flex-col gap-3 mb-4'>
          {/* Block/Unblock Button */}
          <button
            onClick={async () => {
              try {
                const isBlocked = authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id);
                const endpoint = isBlocked ? '/api/auth/unblock' : '/api/auth/block';
                const { data } = await axios.post(endpoint, { id: selectedUser._id });

                if (data.success) {
                  toast.success(data.message);
                  window.location.reload();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error updating block status");
              }
            }}
            className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'}`}
          >
            {authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            {authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? 'Unblock User' : 'Block User'}
          </button>

          {/* Remove Friend Button */}
          <button
            onClick={async () => {
              if (!window.confirm("Are you sure you want to remove this connection?")) return;
              try {
                const { data } = await axios.post('/api/auth/remove-friend', { id: selectedUser._id });
                if (data.success) {
                  toast.success(data.message);
                  window.location.reload(); // Refresh to update sidebar list
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error removing friend");
              }
            }}
            className='w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 font-medium transition-all text-gray-300 flex items-center justify-center gap-2 border border-white/5'
          >
            <UserX className="w-4 h-4" />
            Remove Connection
          </button>
        </div>
      </div>

      <div className='flex justify-center mt-6 mb-8'>
        <button onClick={() => logout()} className='flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none text-sm font-medium py-2.5 px-8 rounded-full cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95'>
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </div>
  ) : null;
}

export default RightSidebar
