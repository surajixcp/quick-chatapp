import React, { useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import { useContext } from 'react'
import { useState } from 'react'

const RightSidebar = () => {


  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
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
    <div className={`text-white w-full h-full relative overflow-y-scroll`}>
      <div className='pt-10 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser?.fullName}
        </h1>
        <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4' />

      <div className='px-5 text-xs'>
        <p className='mb-2 font-medium'>Media ({msgImages.length})</p>
        {msgImages.length > 0 ? (
          <div className='max-h-[150px] overflow-y-auto grid grid-cols-2 gap-2 opacity-80 mb-4'>
            {msgImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded overflow-hidden aspect-square'>
                <img src={url} alt="" className='w-full h-full object-cover rounded-md hover:scale-105 transition-transform' />
              </div>
            ))}
          </div>
        ) : <p className='text-gray-400 mb-4 italic'>No shared media</p>}

        <p className='mb-2 font-medium'>Links ({msgLinks.length})</p>
        {msgLinks.length > 0 ? (
          <div className='max-h-[150px] overflow-y-auto flex flex-col gap-2 opacity-80'>
            {msgLinks.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer" className='truncate bg-white/5 p-2 rounded hover:bg-white/10 text-blue-300'>
                {link}
              </a>
            ))}
          </div>
        ) : <p className='text-gray-400 italic'>No shared links</p>}

      </div>

      <div className='px-5 text-xs group'>
        <p className='mb-2 font-medium'>Themes</p>
        <div className='flex gap-2 mb-4'>
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-6 h-6 rounded-full border-2 ${theme === t ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
              style={{ background: t === 'default' ? '#1e1e2d' : t === 'ocean' ? 'linear-gradient(to bottom right, #1e3a8a, #155e75)' : t === 'sunset' ? 'linear-gradient(to bottom right, #312e81, #4c1d95)' : 'linear-gradient(to bottom right, #111827, #064e3b)' }}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            />
          ))}
        </div>
      </div>

      <div className='flex justify-center mt-4 mb-5'>
        <button onClick={() => logout()} className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-8 rounded-full cursor-pointer hover:shadow-lg transition-all active:scale-95'>
          Logout
        </button>
      </div>

    </div>
  ) : null;
}

export default RightSidebar
