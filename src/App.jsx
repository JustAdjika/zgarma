import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import ArmaZgMain from './pages/armaZgMain.jsx';
import Announcement from './pages/annoucement.jsx';
import DiscordAuthCallback from './pages/discordAuthCallback.jsx'
import Events from './pages/events.jsx'


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='div-main'>
      <Router> 
        <Routes>
          <Route path='/main' element={<ArmaZgMain />} />
          <Route path='/announcement' element={<Announcement />} />
          <Route path='/events' element={<Events />} />
          <Route path='/auth/discord/callback' element={<DiscordAuthCallback />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;