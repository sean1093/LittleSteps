import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize Firebase Analytics
import './lib/firebase'
import { redirectLegacyHash } from './common/navigate'
import { MotionConfig } from 'framer-motion'

// 必須在 App 讀 location.pathname 之前跑，否則舊的 #/ 連結會先渲染成首頁
// 再跳走，使用者會看到一次閃爍。
redirectLegacyHash()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Framer Motion animates from JavaScript, so the reduced-motion rule in
        index.css never reached it: the sheet spring, the staggered lists and
        the tap scale all ran for someone who had asked the system for less
        motion. `user` makes every motion component follow that setting. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
)
