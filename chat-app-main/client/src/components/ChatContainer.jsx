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
    <div className='h-full flex flex-col relative overflow-hidden'>
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
      <div className='flex-none flex items-center gap-4 py-3 px-6 mx-4 mt-4 mb-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] relative z-20 shadow-lg'>
        <button onClick={() => setSelectedUser(null)} className='md:hidden p-2 hover:bg-white/10 rounded-full transition-colors'>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="relative">
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-11 h-11 rounded-full object-cover border-2 border-white/10 shadow-md transform hover:scale-105 transition-transform duration-300' />
          {onlineUsers.includes(selectedUser._id) && <span className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a1a1a] shadow-sm'></span>}
        </div>

        <div className='flex-1 flex flex-col gap-0.5 min-w-0'>
          <p className='text-base text-white font-bold flex items-center gap-2 tracking-wide truncate'>{selectedUser?.fullName}</p>
          <p className={`text-[10px] font-medium tracking-wider uppercase ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-500'}`}>
            {onlineUsers.includes(selectedUser._id) ? 'Active Now' : 'Offline'}
          </p>
        </div>

        <button onClick={() => setShowRightSidebar(!showRightSidebar)} className='p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 group border border-transparent hover:border-white/10' title="Chat Info">
          <Info className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/*----------------Chat area---------------------  */}
      <div className='flex-1 overflow-y-auto p-4 px-6 pb-6 flex flex-col gap-3 custom-scrollbar'>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end gap-2 justify-end group relative ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}
          >
            {msg.isDeletedForEveryone ? (
              <p className='p-3 px-4 max-w-[200px] text-xs md:text-sm font-light rounded-2xl mb-1 italic text-gray-400 bg-white/5 border border-white/5 backdrop-blur-sm'>This message was deleted</p>
            ) : (
              <>
                <div
                  onClick={() => setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id)}
                  className='cursor-pointer relative z-10'
                >
                  {msg.image ? (
                    <img src={msg.image} alt='' className='max-w-[200px] sm:max-w-[240px] border-4 border-white/10 rounded-2xl overflow-hidden mb-1 shadow-xl hover:scale-[1.01] transition-transform' />
                  ) : (
                    <p className={`p-3 px-5 max-w-[240px] sm:max-w-[320px] md:max-w-[420px] text-sm font-normal shadow-lg mb-1 break-words leading-relaxed ${msg.senderId == authUser._id
                      ? 'bg-gradient-to-br from-violet-600/90 to-indigo-900/90 rounded-2xl rounded-tr-none text-white shadow-[0_5px_15px_rgba(124,58,237,0.2)] border border-violet-500/20 backdrop-blur-sm'
                      : 'bg-[#1a1a1a]/90 backdrop-blur-md rounded-2xl rounded-tl-none text-gray-200 border border-white/10 shadow-lg'
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

            <div className='text-center text-[10px] text-gray-500/80 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>
              <span>{formatMessageTime(msg.createdAt)}</span>
            </div>
          </motion.div>
        ))}
        <div ref={scrollEnd}></div>

      </div>

      {/* ---------bottom area-------- */}
      <div className='flex-none p-4 pb-5 relative z-20 flex justify-center'>
        <div className='w-full max-w-3xl flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 px-3 py-2 rounded-[2rem] relative shadow-lg focus-within:border-white/20 focus-within:bg-black/40 transition-all duration-300 group'>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-16 left-0 z-50 shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#1a1a1a]"
              >
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
                  skinTonesDisabled
                  searchDisabled
                  width={300}
                  height={350}
                />
              </motion.div>
            )}

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2.5 rounded-full transition-all duration-300 ${showEmojiPicker ? 'text-yellow-400 bg-white/10' : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'}`}
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null}
              type="text"
              placeholder='Type a message...'
              className='flex-1 text-sm px-3 py-2 border-none outline-none text-white placeholder-gray-500 bg-transparent font-medium tracking-wide'
            />
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor='image' className="p-2.5 cursor-pointer text-gray-400 hover:text-violet-400 hover:bg-white/5 rounded-full transition-all">
              <ImagePlus className="w-5 h-5" />
            </label>
          </div>
          <button onClick={handleSendMessage} className='p-3.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 transition-all duration-300 active:scale-95 group border border-white/10 shadow-xl flex-shrink-0'>
            <SendHorizontal className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
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
  ) : null;
}

export default ChatContainer
