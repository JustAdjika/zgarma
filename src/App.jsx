import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import ArmaZgMain from './pages/armaZgMain.jsx';
import Announcement from './pages/annoucement.jsx';
import DiscordAuthCallback from './pages/discordAuthCallback.jsx'
import Events from './pages/events.jsx'
import PathchesPage from './pages/patches.jsx';
import RulesPage from './pages/rules.jsx';
import Layouts from "./layouts/layout";


import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  window.onerror = function (message, source, lineno, colno, error) {
    if (message.includes("*,:x")) {
        alert("Ошибка: Возможно, одно из расширений браузера мешает работе сайта. Попробуйте отключить расширения и перезагрузить страницу.");
    }
  };

  const [userinfoMenu, setUserinfoMenu] = useState(false)
  const [notices, setNotices] = useState(false)

  return (
      <div className='div-main' onClick={() => { setUserinfoMenu(false); setNotices(false) }}>
        <Layouts setUserinfoMenu={setUserinfoMenu} userinfoMenu={userinfoMenu} notices={notices} setNotices={setNotices}/>
        <Router> 
          <Routes>
            {/* <Route path='/main' element={<ArmaZgMain />} />  */}
            <Route path='/announcement' element={<Announcement />} />
            <Route path='/events' element={<Events />} />
            <Route path='/auth/discord/callback' element={<DiscordAuthCallback />} />
            <Route path='/patches' element={<PathchesPage />} />
            <Route path='/rules' element={<RulesPage />} />
            <Route path="*" element={<h1 style={{ color: '#D9D9D9', margin: '0px', position: 'relative', top: '100px', left: '50px' }}>404. Page not found</h1> }/>
          </Routes>
        </Router>
      </div>
    )
};

export default App;