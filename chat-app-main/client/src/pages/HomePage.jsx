import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import assets from '../assets/assets'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'
import { ThemeContext } from '../../context/ThemeContext'
import MobileNavbar from '../components/MobileNavbar'
import { AuthContext } from '../../context/AuthContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext);
  const { theme, themes } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('chats'); // 'chats' or 'groups'

  return (
    <div className={`w-full h-screen ${themes[theme] || themes.default} transition-colors duration-500 overflow-hidden relative`}>
      {/* Starry Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-30 animate-pulse"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-0"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full p-2 sm:p-4 md:p-6 lg:p-8 flex gap-4 md:gap-6 wrapper-container max-w-[1920px] mx-auto">

        {/* Sidebar Panel */}
        <div className={`${selectedUser ? 'max-md:hidden' : 'w-full'} md:w-[320px] lg:w-[380px] flex-shrink-0 flex flex-col bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300`}>
          <Sidebar activeTab={activeTab} />
        </div>

        {/* Chat Panel */}
        <div className={`${!selectedUser ? 'max-md:hidden' : 'w-full'} flex-1 flex flex-col relative overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl`}>
          {selectedUser ? <ChatContainer showRightSidebar={showRightSidebar} setShowRightSidebar={setShowRightSidebar} /> : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center justify-center h-full gap-6 text-gray-500 bg-black/20 backdrop-blur-sm'
            >
              <div className="p-8 bg-white/5 rounded-full relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
                <img src={assets.logo_icon} alt="" className='w-20 opacity-60 relative z-10' />
              </div>
              <div className="text-center space-y-2">
                <p className='text-2xl font-bold text-white/90 tracking-tight'>Chat anytime, anywhere</p>
                <p className='text-sm text-gray-400 font-medium'>Select a connection to start messaging</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar Panel */}
        <div className={`
          ${(selectedUser && showRightSidebar) ? 'w-[320px] lg:w-[360px] opacity-100 scale-100' : 'w-0 opacity-0 scale-95 hidden'} 
          max-md:fixed max-md:inset-4 max-md:z-50 max-md:w-auto 
          flex-shrink-0 flex flex-col bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 origin-right
        `}>
          {(selectedUser && showRightSidebar) && <RightSidebar onClose={() => setShowRightSidebar(false)} />}
        </div>
      </div>

      {/* Overlay for mobile right sidebar */}
      {(selectedUser && showRightSidebar) && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowRightSidebar(false)}></div>
      )}

      {/* Mobile Navigation */}
      {!selectedUser && (
        <MobileNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={logout}
        />
      )}
    </div>
  )
}

export default HomePage
