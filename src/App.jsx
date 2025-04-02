import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ArmaZgMain from './pages/armaZgMain.jsx';
import Announcement from './pages/annoucement.jsx';
import DiscordAuthCallback from './pages/discordAuthCallback.jsx';
import Events from './pages/events.jsx';
import PathchesPage from './pages/patches.jsx';
import RulesPage from './pages/rules.jsx';
import Layouts from "./layouts/layout";

import './App.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function App() {
  const [isAdmin, setIsAdmin] = useState(null); // null — загрузка, false — нет доступа, true — есть доступ
  const [userinfoMenu, setUserinfoMenu] = useState(false);
  const [notices, setNotices] = useState(false);

  const [isDevBranch, setIsDevBranch] = useState(false)

  const pause = false

  useEffect(() => {
    if(!pause) return 

    const checkAdminAccess = async () => {
      if (!Cookies.get("userData")) {
        console.log("Куков нет");
        setIsAdmin(false);
        return;
      }

      try {
        const currentUser = JSON.parse(Cookies.get("userData"));
        console.log("Пользователь:", currentUser);

        const adminCheck = await axios.get(`https://api.zgarma.ru/api/developer/adminlist/remote/isAdmin?id=${currentUser.id}`);
        console.log("Ответ сервера:", adminCheck.data);

        if (adminCheck.data.status === 200 && adminCheck.data.container) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Ошибка проверки прав администратора:", error);
        setIsAdmin(false);
      }
    };

    checkAdminAccess();
  }, []);


  useEffect(() => {
    const devBranch = window.location.hostname === 'dev.zgarma.ru'

    console.log(`DEV BRANCH:`, devBranch)

    setIsDevBranch(devBranch)
  }, [])

  const getDevBranchStatus = () => {
    return window.location.hostname === 'dev.zgarma.ru'
  }



  if (isAdmin === null && pause) {
    return <h1 style={{ color: '#D9D9D9' }}>Загрузка...</h1>; // Пока идет проверка, показываем загрузку
  }

  if (!isAdmin && pause) {
    return <h1 style={{ color: '#D9D9D9' }}>На сайте проходят технические работы. Пожалуйста, подождите</h1>;
  }

  return (
    <div className='div-main' onClick={() => { setUserinfoMenu(false); setNotices(false); }}>
      <Layouts setUserinfoMenu={setUserinfoMenu} userinfoMenu={userinfoMenu} notices={notices} setNotices={setNotices} />
      <div className='devBranch-marker' style={{ display: isDevBranch ? 'flex' : 'none' }}>
        Dev Branch
      </div>
      <Router>
        <Routes>
          <Route path='/announcement' element={<Announcement isDevBranch={getDevBranchStatus()} />} />
          <Route path='/events' element={<Events isDevBranch={getDevBranchStatus()} />} />
          <Route path='/auth/discord/callback' element={<DiscordAuthCallback />} />
          <Route path='/patches' element={<PathchesPage isDevBranch={getDevBranchStatus()} />} />
          <Route path='/rules' element={<RulesPage isDevBranch={isDevBranch} />} />
          <Route path="*" element={<h1 style={{ color: '#D9D9D9', margin: '0px', position: 'relative', top: '100px', left: '50px' }}>404. Page not found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;