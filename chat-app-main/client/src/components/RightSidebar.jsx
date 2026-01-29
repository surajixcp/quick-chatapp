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

      <div className='flex flex-col h-full'>
        <div className='flex-1 overflow-y-auto custom-scrollbar p-6 px-8'>
          <div className='flex flex-col items-center gap-4 text-xs font-light mx-auto pt-4'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-28 h-28 rounded-full object-cover border-[3px] border-white/10 shadow-2xl p-1 bg-white/5' />
            <div className='flex flex-col items-center text-center gap-1'>
              <h1 className='text-xl font-bold flex items-center gap-2 text-white tracking-wide'>
                {selectedUser?.fullName}
                {onlineUsers.includes(selectedUser._id) && <span className='w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'></span>}
              </h1>
              <p className='text-gray-400 text-sm max-w-[220px] leading-relaxed'>{selectedUser.bio || "No bio available"}</p>
            </div>
          </div>

          <div className='h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8'></div>

          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-2 mb-4 text-gray-300'>
                <Image className="w-4 h-4 text-violet-400" />
                <p className='font-bold uppercase tracking-widest text-[11px] text-gray-400'>Shared Media</p>
              </div>
              {msgImages.length > 0 ? (
                <div className='grid grid-cols-3 gap-2 opacity-90'>
                  {msgImages.map((url, index) => (
                    <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded-xl overflow-hidden aspect-square border border-white/5 relative group'>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      <img src={url} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                    </div>
                  ))}
                </div>
              ) : <p className='text-gray-600 text-sm italic pl-2'>No shared media</p>}
            </div>

            <div>
              <div className='flex items-center gap-2 mb-4 text-gray-300'>
                <Link className="w-4 h-4 text-violet-400" />
                <p className='font-bold uppercase tracking-widest text-[11px] text-gray-400'>Shared Links</p>
              </div>
              {msgLinks.length > 0 ? (
                <div className='flex flex-col gap-2.5'>
                  {msgLinks.map((link, index) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className='truncate bg-white/5 hover:bg-white/10 p-3 rounded-xl text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-3 border border-white/5 group'>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                        <Link className="w-4 h-4" />
                      </div>
                      <span className='truncate text-sm font-medium opacity-90'>{link.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ))}
                </div>
              ) : <p className='text-gray-600 text-sm italic pl-2'>No shared links</p>}
            </div>

            <div>
              <p className='mb-4 font-bold text-[11px] text-gray-400 uppercase tracking-widest'>Appearance</p>
              <div className='flex gap-3'>
                {Object.keys(themes).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-9 h-9 rounded-full border-2 ${theme === t ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50 hover:opacity-100'} transition-all duration-300 cursor-pointer relative`}
                    style={{ background: t === 'default' ? '#1e1e2d' : t === 'ocean' ? 'linear-gradient(135deg, #1e3a8a, #155e75)' : t === 'sunset' ? 'linear-gradient(135deg, #312e81, #4c1d95)' : 'linear-gradient(135deg, #111827, #064e3b)' }}
                    title={t.charAt(0).toUpperCase() + t.slice(1)}
                  >
                    {theme === t && <span className="absolute inset-0 rounded-full border border-white/20 animate-ping"></span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className='mb-4 font-bold text-[11px] text-gray-400 uppercase tracking-widest text-center'>Privacy & Support</p>
              <div className='flex flex-col gap-3 items-center'>
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
                  className={`w-full max-w-[240px] py-3 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg ${authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500' : 'bg-gradient-to-r from-red-500/10 to-red-900/20 text-red-400 border border-red-500/20 hover:border-red-500/40 hover:from-red-500/20 hover:to-red-900/30'}`}
                >
                  {authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                  {authUser?.blockedUsers?.some(user => user._id === selectedUser._id || user === selectedUser._id) ? 'Unblock User' : 'Block User'}
                </button>

                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to remove this connection?")) return;
                    try {
                      const { data } = await axios.post('/api/auth/remove-friend', { id: selectedUser._id });
                      if (data.success) {
                        toast.success(data.message);
                        window.location.reload();
                      } else {
                        toast.error(data.message);
                      }
                    } catch (error) {
                      toast.error("Error removing friend");
                    }
                  }}
                  className='w-full max-w-[240px] py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-medium text-sm transition-all text-gray-300 flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 group shadow-md hover:shadow-white/5'
                >
                  <UserX className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                  <span className="group-hover:text-white transition-colors">Remove Connection</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='p-6 border-t border-white/5 bg-[#120f1d]/50 backdrop-blur-md flex justify-center'>
          <button onClick={() => logout()} className='w-full max-w-[240px] flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none text-xs font-bold py-3.5 rounded-full cursor-pointer hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all active:scale-[0.98] tracking-widest uppercase'>
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

    </div>
  ) : null;
}

export default RightSidebar
