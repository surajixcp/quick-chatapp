import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import toast from 'react-hot-toast'
import EmojiPicker from 'emoji-picker-react'
import ForwardModal from './ForwardModal'
import { SendHorizontal, ImagePlus, Smile, ArrowLeft, Info } from 'lucide-react'

const ChatContainer = ({ setShowRightSidebar, showRightSidebar }) => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [messageToForward, setMessageToForward] = useState(null);


  const handleDelete = (messageId, type) => {
    deleteMessage(messageId, type);
    setSelectedMessageId(null);
  };

  const handleForward = (msg) => {
    setMessageToForward(msg);
    setShowForwardModal(true);
    setSelectedMessageId(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
    setShowEmojiPicker(false);
  }

  const handleCopy = (msg) => {
    if (msg.image) {
      navigator.clipboard.writeText(msg.image);
      toast.success("Image URL copied to clipboard");
    } else {
      navigator.clipboard.writeText(msg.text);
      toast.success("Message copied to clipboard");
    }
    setSelectedMessageId(null);
  };

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser])


  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full flex flex-col relative backdrop-blur-lg overflow-hidden'
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)'
      }}
    >
      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Bubbles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-bubble bg-gradient-to-t from-violet-500/10 to-transparent rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              aspectRatio: '1/1',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      {/* ----------header----------------- */}
      {/* ----------header----------------- */}
      <div className='flex-none flex items-center gap-4 py-5 px-8 mx-4 mt-4 mb-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] relative z-20 shadow-lg'>
        <button onClick={() => setSelectedUser(null)} className='md:hidden p-2 hover:bg-white/10 rounded-full transition-colors'>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="relative">
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-14 h-14 rounded-full object-cover border-[3px] border-white/10 shadow-md transform hover:scale-105 transition-transform duration-300' />
          {onlineUsers.includes(selectedUser._id) && <span className='absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#1a1a1a] shadow-sm'></span>}
        </div>

        <div className='flex-1 flex flex-col gap-0.5'>
          <p className='text-lg text-white font-bold flex items-center gap-2 tracking-wide'>{selectedUser?.fullName}</p>
          <p className={`text-xs font-medium tracking-wider uppercase ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-500'}`}>
            {onlineUsers.includes(selectedUser._id) ? 'Active Now' : 'Offline'}
          </p>
        </div>

        <button onClick={() => setShowRightSidebar(!showRightSidebar)} className='p-3 hover:bg-white/10 rounded-full transition-all duration-300 group border border-transparent hover:border-white/10' title="Chat Info">
          <Info className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/*----------------Chat area---------------------  */}
      <div className='flex-1 overflow-y-auto p-4 pb-6 flex flex-col gap-2 custom-scrollbar'>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end gap-2 justify-end group relative ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}
          >
            {msg.isDeletedForEveryone ? (
              <p className='p-3 px-4 max-w-[200px] md:text-sm font-light rounded-2xl mb-2 italic text-gray-400 bg-white/5 border border-white/5 backdrop-blur-sm'>This message was deleted</p>
            ) : (
              <>
                <div
                  onClick={() => setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id)}
                  className='cursor-pointer relative z-10'
                >
                  {msg.image ? (
                    <img src={msg.image} alt='' className='max-w-[280px] md:max-w-sm border-4 border-white/10 rounded-2xl overflow-hidden mb-2 shadow-2xl hover:scale-[1.01] transition-transform' />
                  ) : (
                    <p className={`p-3 px-5 max-w-[280px] md:max-w-md md:text-[15px] font-normal shadow-lg mb-2 break-words leading-relaxed ${msg.senderId == authUser._id
                      ? 'bg-gradient-to-br from-violet-600/90 to-indigo-900/90 rounded-2xl rounded-tr-none text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-violet-500/20 backdrop-blur-sm'
                      : 'bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl rounded-tl-none text-gray-100 border border-white/10 shadow-lg'
                      }`}>{msg.text}</p>
                  )}
                </div>

                {/* Delete Options */}
                {selectedMessageId === msg._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute top-full mt-1 ${msg.senderId === authUser._id ? 'right-0' : 'left-0'} bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 text-gray-200 text-xs rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1 min-w-[140px] overflow-hidden transform origin-top`}
                  >
                    <button onClick={() => handleCopy(msg)} className='hover:bg-white/10 p-2.5 rounded-lg text-left whitespace-nowrap transition-colors flex items-center gap-2 font-medium'>
                      {msg.image ? "Copy Media" : "Copy Text"}
                    </button>
                    <button onClick={() => handleForward(msg)} className='hover:bg-white/10 p-2.5 rounded-lg text-left whitespace-nowrap transition-colors font-medium'>Forward</button>
                    <button onClick={() => handleDelete(msg._id, 'me')} className='hover:bg-white/10 p-2.5 rounded-lg text-left whitespace-nowrap transition-colors text-red-400 hover:bg-red-500/10 font-medium'>Delete for me</button>
                    {msg.senderId === authUser._id && (
                      <button onClick={() => handleDelete(msg._id, 'everyone')} className='hover:bg-white/10 p-2.5 rounded-lg text-left whitespace-nowrap transition-colors text-red-400 hover:bg-red-500/10 font-medium'>Delete for everyone</button>
                    )}
                  </motion.div>
                )}
              </>
            )}

            <div className='text-center text-[10px] text-gray-400/80 pb-1'>
              {/* Moved time to be more subtle */}
              <span>{formatMessageTime(msg.createdAt)}</span>
            </div>
          </motion.div>
        ))}
        <div ref={scrollEnd}></div>

      </div>

      {/* ---------bottom area-------- */}
      <div className='flex-none flex items-center gap-4 p-6 pb-8 relative z-20'>
        <div className='flex-1 flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 px-3 py-3 rounded-[2rem] relative shadow-lg focus-within:border-white/20 focus-within:bg-black/40 transition-all duration-300 group'>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-24 left-0 z-50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/10 bg-[#1a1a1a]"
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
                skinTonesDisabled
                searchDisabled
                width={320}
                height={380}
              />
            </motion.div>
          )}

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-full transition-all duration-300 ${showEmojiPicker ? 'text-yellow-400 bg-white/10' : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'}`}
          >
            <Smile className="w-6 h-6" />
          </button>

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null}
            type="text"
            placeholder='Type a message...'
            className='flex-1 text-[16px] px-4 py-2 border-none outline-none text-white placeholder-gray-500 bg-transparent font-medium tracking-wide'
          />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor='image' className="p-3 cursor-pointer text-gray-400 hover:text-violet-400 hover:bg-white/5 rounded-full transition-all">
            <ImagePlus className="w-6 h-6" />
          </label>
        </div>
        <button onClick={handleSendMessage} className='p-5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-300 active:scale-95 group border border-white/10 shadow-xl'>
          <SendHorizontal className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>

      {showForwardModal && (
        <ForwardModal
          messageToForward={messageToForward}
          onClose={() => {
            setShowForwardModal(false);
            setMessageToForward(null);
          }}
        />
      )}

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-6 text-gray-500 bg-black/20 backdrop-blur-sm max-md:hidden h-full border-l border-white/5 relative overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/5 rounded-[2rem] mb-4 animate-float shadow-2xl backdrop-blur-md relative z-10'>
        <img src={assets.logo_icon} alt="" className='w-24 opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' />
      </div>
      <div className='text-center space-y-2 relative z-10'>
        <h2 className='text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'>Welcome to Chat App</h2>
        <p className='text-base text-gray-400 font-medium'>Select a connection to start messaging</p>
      </div>
    </div>
  )
}

export default ChatContainer
