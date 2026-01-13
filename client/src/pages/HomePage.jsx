import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import PageContainer from '../components/PageContainer'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { ThemeContext } from '../../context/ThemeContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext);
  const { theme, themes } = useContext(ThemeContext);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);

  return (
    <PageContainer className={`${themes[theme] || themes.default} transition-colors duration-500`}>
      <div className={`h-full grid grid-cols-1 overflow-hidden relative ${selectedUser ? (showRightSidebar ? 'lg:grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr]' : 'lg:grid-cols-[1fr_3fr] md:grid-cols-[1fr_2fr]') : 'md:grid-cols-[1fr_2fr]'}`}>

        {/* Sidebar - specialized visibility logic handled inside Sidebar component or here */}
        <div className={`${selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col border-r border-gray-700 bg-[#282142]/30`}>
          <Sidebar />
        </div>

        {/* ChatContainer */}
        <div className={`${!selectedUser ? 'max-md:hidden' : 'w-full'} flex flex-col relative h-full overflow-hidden`}>
          {selectedUser ? <ChatContainer showRightSidebar={showRightSidebar} setShowRightSidebar={setShowRightSidebar} /> : <div className='flex items-center justify-center h-full text-gray-500'>Select a chat to start messaging</div>}
        </div>

        {/* RightSidebar */}
        {(selectedUser && showRightSidebar) && (
          <div className={`border-l border-gray-700 bg-[#282142]/30 max-lg:absolute max-lg:right-0 max-lg:top-0 max-lg:bottom-0 max-lg:w-[300px] max-lg:z-20 transition-all`}>
            <RightSidebar onClose={() => setShowRightSidebar(false)} />
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default HomePage
