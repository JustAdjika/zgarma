import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import ArmaZgMain from './pages/armaZgMain.jsx';
import Announcement from './pages/annoucement.jsx';
import DiscordAuthCallback from './pages/discordAuthCallback.jsx'
import Events from './pages/events.jsx'
import PathchesPage from './pages/patches.jsx';
import RulesPage from './pages/rules.jsx';
import Layouts from "./layouts/layout";


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  window.onerror = function (message, source, lineno, colno, error) {
    if (message.includes("*,:x")) {
        alert("Ошибка: Возможно, одно из расширений браузера мешает работе сайта. Попробуйте отключить расширения и перезагрузить страницу.");
    }
  };

  const [userinfoMenu, setUserinfoMenu] = useState(false)

  return (
      <div className='div-main' onClick={() => setUserinfoMenu(false)}>
        <Layouts setUserinfoMenu={setUserinfoMenu} userinfoMenu={userinfoMenu} />
        <Router> 
          <Routes>
            <Route path='/main' element={<ArmaZgMain />} /> 
            <Route path='/announcement' element={<Announcement />} />
            <Route path='/events' element={<Events />} />
            <Route path='/auth/discord/callback' element={<DiscordAuthCallback />} />
            <Route path='/patches' element={<PathchesPage />} />
            <Route path='/rules' element={<RulesPage />} />
          </Routes>
        </Router>
      </div>
    )
};

export default App;