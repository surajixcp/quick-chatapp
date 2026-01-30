import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import toast from 'react-hot-toast'
import EmojiPicker from 'emoji-picker-react'
import ForwardModal from './ForwardModal'
import { SendHorizontal, ImagePlus, Smile, ArrowLeft, Info, Paperclip, MapPin, FileText, X } from 'lucide-react'

const ChatContainer = ({ setShowRightSidebar, showRightSidebar }) => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [messageToForward, setMessageToForward] = useState(null);
  const [attachment, setAttachment] = useState(null); // { type: 'image' | 'file', url: string, name: string }


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
    if (input.trim() === "" && !attachment) return null;

    const messageData = { text: input.trim() };
    if (attachment) {
      if (attachment.type === 'image') {
        messageData.image = attachment.url;
      } else if (attachment.type === 'file') {
        messageData.file = attachment.url;
      }
    }

    await sendMessage(messageData);

    // Cleanup
    setInput("");
    setAttachment(null);
    setShowEmojiPicker(false);
  }

  // Handle selecting a generic file (preview first)
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        type: 'file',
        url: reader.result,
        name: file.name
      });
      e.target.value = ""; // Reset input so same file can be selected again
    }
    reader.readAsDataURL(file);
  }

  // Handle sending location
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        toast.dismiss();
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        await sendMessage({ location });
      },
      (error) => {
        toast.dismiss();
        toast.error("Unable to retrieve location");
        console.error(error);
      }
    );
  }

  const handleCopy = (msg) => {
    if (msg.image) {
      navigator.clipboard.writeText(msg.image);
      toast.success("Image URL copied to clipboard");
    } else if (msg.fileUrl) {
      navigator.clipboard.writeText(msg.fileUrl);
      toast.success("File URL copied to clipboard");
    } else if (msg.location) {
      navigator.clipboard.writeText(`https://www.google.com/maps?q=${msg.location.latitude},${msg.location.longitude}`);
      toast.success("Location URL copied to clipboard");
    } else {
      navigator.clipboard.writeText(msg.text);
      toast.success("Message copied to clipboard");
    }
    setSelectedMessageId(null);
  };

  // Handle selecting an image (preview first)
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        type: 'image',
        url: reader.result,
        name: file.name
      });
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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If popup is open, close it
      if (selectedMessageId) {
        setSelectedMessageId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedMessageId]);


  return selectedUser ? (
    <div className='h-full flex flex-col relative backdrop-blur-lg overflow-hidden'>
      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Bubbles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-bubble bg-gradient-to-t from-white/5 to-transparent rounded-full blur-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              aspectRatio: '1/1',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
        {/* Floating Emojis */}
        <div className="absolute inset-0 opacity-[0.03] flex justify-around items-end pb-20">
          <span className="text-8xl animate-float" style={{ animationDelay: '0s' }}>💬</span>
          <span className="text-9xl animate-float" style={{ animationDelay: '2s' }}>🌊</span>
          <span className="text-8xl animate-float" style={{ animationDelay: '4s' }}>✨</span>
        </div>
      </div>

      {/* ----------header----------------- */}
      <div className='flex-none flex items-center gap-3 py-3 mx-4 border-b border-white/10 relative z-10'>
        <button onClick={() => setSelectedUser(null)} className='md:hidden p-2 hover:bg-white/10 rounded-full transition-colors'>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover border border-white/20' />
        <p className='flex-1 text-lg text-white font-medium flex items-center gap-2'>{selectedUser?.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'></span>}
        </p>

        <button onClick={() => setShowRightSidebar(!showRightSidebar)} className='p-2 hover:bg-white/10 rounded-full transition-colors' title="Chat Info">
          <Info className="w-6 h-6 text-white/90" />
        </button>
      </div>

      {/*----------------Chat area---------------------  */}
      <div className='flex-1 overflow-y-auto p-3 pb-6 flex flex-col min-h-0'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end group relative ${(msg.senderId?._id || msg.senderId).toString() !== authUser._id.toString() && 'flex-row-reverse'} animate-fade-in-up`}
          >
            {msg.isDeletedForEveryone ? (
              <div
                className='relative group cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id);
                }}
              >
                <p className='p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 italic text-gray-400 bg-gray-800 border border-gray-700'>This message was deleted</p>

                {/* Delete Options Popup for Deleted Message */}
                {selectedMessageId === msg._id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute top-8 ${(msg.senderId?._id || msg.senderId).toString() === authUser._id.toString() ? 'right-0' : 'left-0'} bg-white text-black text-xs rounded shadow-lg z-50 p-1 flex flex-col gap-1 min-w-[120px]`}
                  >
                    <button onClick={() => handleDelete(msg._id, 'me')} className='hover:bg-gray-200 p-2 rounded text-left whitespace-nowrap text-red-500'>Delete for me</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id);
                  }}
                  className='cursor-pointer relative'
                >
                  {msg.image && (
                    <img src={msg.image} alt='' className='max-w-[70vw] sm:max-w-[300px] md:max-w-[400px] border border-gray-700 rounded-lg overflow-hidden mb-2' />
                  )}
                  {msg.fileUrl && (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 p-3 bg-gray-800 rounded-lg mb-2 border border-gray-700 hover:bg-gray-700 transition-colors'>
                      <div className="bg-violet-500/20 p-2 rounded-full">
                        <FileText className="w-5 h-5 text-violet-400" />
                      </div>
                      <span className="text-sm underline text-blue-400">View Document</span>
                    </a>
                  )}
                  {msg.location && (
                    <a
                      href={`https://www.google.com/maps?q=${msg.location.latitude},${msg.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mb-2 rounded-lg overflow-hidden border border-gray-700"
                    >
                      <div className="bg-gray-800 p-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-300">Shared Location</span>
                      </div>
                      <div className="bg-gray-900 p-2 text-xs text-center text-gray-500">
                        Click to view on map
                      </div>
                    </a>
                  )}
                  {msg.text && (
                    <p className={`p-3 max-w-[75vw] sm:max-w-[350px] md:max-w-[500px] text-sm md:text-base font-light rounded-2xl rounded-tr-none mb-2 break-words bg-violet-500/30 text-white ${(msg.senderId?._id || msg.senderId).toString() === authUser._id.toString() ? 'rounded-br-none rounded-tr-2xl' : 'rounded-bl-none rounded-tl-2xl'}`}>{msg.text}</p>
                  )}

                  {/* Delete Options Popup */}
                  {selectedMessageId === msg._id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute top-0 ${(msg.senderId?._id || msg.senderId).toString() === authUser._id.toString() ? 'right-full mr-2' : 'left-full ml-2'} bg-white text-black text-xs rounded shadow-lg z-50 p-1 flex flex-col gap-1 min-w-[120px]`}
                    >
                      <button onClick={() => handleCopy(msg)} className='hover:bg-gray-200 p-2 rounded text-left whitespace-nowrap'>{msg.image ? "Copy Media" : "Copy Text"}</button>
                      <button onClick={() => handleForward(msg)} className='hover:bg-gray-200 p-2 rounded text-left whitespace-nowrap'>Forward</button>
                      <button onClick={() => handleDelete(msg._id, 'me')} className='hover:bg-gray-200 p-2 rounded text-left whitespace-nowrap'>Delete for me</button>
                      {(msg.senderId?._id || msg.senderId).toString() === authUser._id.toString() && (
                        <button onClick={() => handleDelete(msg._id, 'everyone')} className='hover:bg-gray-200 p-2 rounded text-left whitespace-nowrap'>Delete for everyone</button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className='text-center text-xs'>
              <img src={(msg.senderId?._id || msg.senderId).toString() === authUser._id.toString() ? authUser?.profilePic || assets.avatar_icon : (msg.senderId?.profilePic || selectedUser?.profilePic || assets.avatar_icon)} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>

      </div>

      {/* ---------bottom area-------- */}
      <div className='flex-none p-3 md:p-4 relative z-10' style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>

        {/* Attachment Preview */}
        {attachment && (
          <div className='mb-2 flex items-center gap-3 bg-gray-800/80 backdrop-blur-md p-2 rounded-xl border border-white/10 w-fit relative animate-fade-in-up'>
            <button onClick={() => setAttachment(null)} className='translate-x-1/2 -translate-y-1/2 absolute top-0 right-0 p-1 bg-gray-600 rounded-full hover:bg-red-500 transition-colors z-20'>
              <X className="w-3 h-3 text-white" />
            </button>

            {attachment.type === 'image' ? (
              <img src={attachment.url} alt="Preview" className='h-16 w-16 object-cover rounded-lg border border-white/10' />
            ) : (
              <div className='flex items-center gap-2 p-2'>
                <div className="bg-violet-500/20 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-sm text-gray-200 max-w-[150px] truncate">{attachment.name}</span>
              </div>
            )}
          </div>
        )}

        <div className='flex items-center gap-2 md:gap-3'>
          {selectedUser?.restrictedUsers?.some(u => u._id === authUser._id) ? (
            <div className='flex-1 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-center text-sm font-medium'>
              Only admins can send messages in this group.
            </div>
          ) : (
            <>
              <div className='flex-1 flex items-center bg-gray-900/40 backdrop-blur-md border border-white/10 px-3 md:px-4 py-2 rounded-full relative shadow-lg min-w-0'>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-xl overflow-hidden border border-white/10">
                    <EmojiPicker
                      theme="dark"
                      onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
                    />
                  </div>
                )}

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="mr-3 text-gray-400 hover:text-yellow-400 hover:scale-110 transition-all"
                >
                  <Smile className="w-6 h-6" />
                </button>

                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null}
                  type="text"
                  placeholder='Type a message...'
                  className='flex-1 text-sm p-1 border-none outline-none text-white placeholder-gray-400 bg-transparent'
                />

                {/* File Upload */}
                <input onChange={handleFileSelect} type="file" id='file-upload' className='hidden' />
                <label htmlFor='file-upload' className="ml-2 cursor-pointer text-gray-400 hover:text-emerald-400 hover:scale-110 transition-all" title="Attach File">
                  <Paperclip className="w-5 h-5" />
                </label>

                {/* Location Share */}
                <button onClick={handleSendLocation} className="ml-2 cursor-pointer text-gray-400 hover:text-red-400 hover:scale-110 transition-all" title="Share Location">
                  <MapPin className="w-5 h-5" />
                </button>

                {/* Image Upload */}
                <input onChange={handleImageSelect} type="file" id='image' accept='image/*' hidden />
                <label htmlFor='image' className="ml-2 cursor-pointer text-gray-400 hover:text-blue-400 hover:scale-110 transition-all" title="Send Image">
                  <ImagePlus className="w-6 h-6" />
                </label>
              </div>
              <button onClick={handleSendMessage} className='p-3 bg-violet-600 rounded-full hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95'>
                <SendHorizontal className="w-5 h-5 text-white" />
              </button>
            </>
          )}
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

      {/* Closes main container */}
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
