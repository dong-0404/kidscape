import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { ChatWidgetProvider } from './components/chatbot/ChatWidgetContext.jsx'
import 'react-quill-new/dist/quill.snow.css'
import './index.css'
import './motion/motion.css'
import './admin/admin.css'
import './chatbot.css'
import './products.css'
import './blog.css'
import './home.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatWidgetProvider>
          <App />
        </ChatWidgetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
