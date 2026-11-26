import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize Firebase Analytics
import './lib/firebase'
import { redirectLegacyHash } from './common/navigate'
import { installJoinLinkCapture } from './common/joinLink'
import { MotionConfig } from 'framer-motion'

// 必須在 App 讀 location.pathname 之前跑，否則舊的 #/ 連結會先渲染成首頁
// 再跳走，使用者會看到一次閃爍。
redirectLegacyHash()

// 分享連結的代碼在 /join#代碼 的 fragment 裡。第一次渲染之前就把它從網址列
// 拿掉：Analytics 每送一個事件都會讀整串網址當 page_location。見 common/joinLink。
installJoinLinkCapture()

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
