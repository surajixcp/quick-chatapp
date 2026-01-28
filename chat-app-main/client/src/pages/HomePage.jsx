import React, { useContext } from 'react'
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
        <div className={`${selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col border-r border-gray-700 bg-[#282142]/30`}>
          <Sidebar activeTab={activeTab} />
        </div>

        {/* ChatContainer */}
        <div className={`${!selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col relative h-full overflow-hidden`}>
          {selectedUser ? <ChatContainer showRightSidebar={showRightSidebar} setShowRightSidebar={setShowRightSidebar} /> : <div className='flex items-center justify-center h-full text-gray-500'>Select a chat to start messaging</div>}
        </div>

        {/* RightSidebar */}
        {(selectedUser && showRightSidebar) && (
          <div className={`border-l border-gray-700 bg-[#282142] max-md:fixed max-md:inset-0 md:max-lg:absolute md:max-lg:right-0 md:max-lg:top-0 md:max-lg:bottom-0 md:max-lg:w-[300px] lg:z-10 max-md:z-50 md:max-lg:z-20 transition-all`}>
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
