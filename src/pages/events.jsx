import React, { useEffect, useState } from 'react';

import './Style/events.css'
import './Style/fonts.css'

import ReadyEvent from '../components/events/readyEvent.jsx';
import axios from 'axios';

const Events = () => {
    const host = 'http://localhost:3000'
    const [events, setEvents] = useState([])

    useEffect(() => {
        const getEvents = async () => {
            const res = await axios.get(`${host}/api/developer/event/data/all`)

            console.log(res)
            setEvents(res.data.container)
        }

        getEvents()
    }, [])

    useEffect(() => {
        console.log(events)
    }, [events])

    return (
        <div className='event-main-container'>
            <div className='event-ready-container'>
                <div className='event-ready-title-container'>
                    <div className='event-ready-title-up-container'>
                        <h1>Анонсы игр</h1>
                        <button className='event-button-create-game'>Создать игру</button>
                    </div>
                    <div className='event-title-decorative-line'></div>
                </div>
                <div className='event-ready-output-container'>
                    { events.map(event => (
                        event.status == 'READY' ?
                        <ReadyEvent key={event.id || index} eventData={event} />
                        :
                        null
                    )) }
                </div>
            </div>
            <div className='event-open-container'>

            </div>
        </div>
    );
};

export default Events;