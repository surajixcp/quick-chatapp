import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
import { GroupProvider } from '../context/GroupContext.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'

// Load debug script in development
if (import.meta.env.DEV) {
  import('./debug-chat.js')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <GroupProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </GroupProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)
