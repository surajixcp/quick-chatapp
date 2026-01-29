import React, { useContext } from 'react'
import { motion } from 'framer-motion'
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
    <div className={`w-full h-screen ${themes[theme] || themes.default} transition-colors duration-500 flex flex-col`}>
      <div className={`flex-1 grid grid-cols-1 overflow-hidden relative ${selectedUser ? (showRightSidebar ? 'lg:grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr]' : 'lg:grid-cols-[1fr_3fr] md:grid-cols-[1fr_2fr]') : 'md:grid-cols-[1fr_2fr]'}`}>

        {/* Sidebar - specialized visibility logic handled inside Sidebar component or here */}
        {/* Sidebar */}
        <div className={`${selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl`}>
          <Sidebar activeTab={activeTab} />
        </div>

        {/* ChatContainer */}
        <div className={`${!selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col relative h-full overflow-hidden`}>
          {selectedUser ? <ChatContainer showRightSidebar={showRightSidebar} setShowRightSidebar={setShowRightSidebar} /> : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center justify-center h-full gap-4 text-gray-500 bg-black/20 backdrop-blur-sm transition-all'
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className='p-6 bg-white/5 rounded-full mb-2'
              >
                <img src={assets.logo_icon} alt="" className='max-w-16 opacity-50' />
              </motion.div>
              <p className='text-xl font-medium text-white/80 tracking-wide'>Chat anytime, anywhere</p>
              <p className='text-sm text-gray-500'>Select a connection to start messaging</p>
            </motion.div>
          )}
        </div>

        {/* RightSidebar */}
        {(selectedUser && showRightSidebar) && (
          <div className={`border-l border-white/10 bg-black/40 backdrop-blur-xl max-md:fixed max-md:inset-0 md:max-lg:absolute md:max-lg:right-0 md:max-lg:top-0 md:max-lg:bottom-0 md:max-lg:w-[300px] lg:z-10 max-md:z-50 md:max-lg:z-20 transition-all`}>
            <RightSidebar onClose={() => setShowRightSidebar(false)} />
          </div>
        )}
      </div>

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
