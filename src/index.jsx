import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from 'styled-components'
import theme from './theme.js'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
)
