import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './Style/events.css'
import './Style/fonts.css'

import ReadyEvent from '../components/events/readyEvent.jsx';
import OpenEvent from '../components/events/openEvent.jsx';
import ModalEventRemote from '../components/events/modalEventRemote.jsx';
import ModalCreateEvent from '../components/events/modalCreateEvent.jsx';

const Events = () => {
    const host = 'http://localhost:3000'
    const [events, setEvents] = useState([])
    const [eventList, eventListUpdate] = useState(0)

    // MODAL STATE
    const [isModalEventCreate, setIsModalEventCreate] = useState(false)
    const [isModalEventRemote, setIsModalEventRemote] = useState(false)
    const [modalRemoteEvent, setModalRemoteEvent] = useState({})
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getEvents = async () => {
            const res = await axios.get(`${host}/api/developer/event/data/all`)
            setEvents(res.data.container)
        }

        getEvents()
    }, [])

    useEffect(() => {
        const getEvents = async () => {
            const res = await axios.get(`${host}/api/developer/event/data/all`)
            setEvents(res.data.container)
        }

        getEvents()
    }, [eventList])



    return (
        <>
            <ModalEventRemote host={host} setIsModalEventRemote={setIsModalEventRemote} isModalEventRemote={isModalEventRemote} modalRemoteEvent={modalRemoteEvent} setModalRemoteEvent={setModalRemoteEvent} setErrorMessage={setErrorMessage}/>
            
            <ModalCreateEvent isModalEventCreate={isModalEventCreate} host={host} />
            <div className='event-main-container'>
                <div className='event-ready-container'>
                    <div className='event-ready-title-container'>
                        <div className='event-ready-title-up-container'>
                            <h1>Анонсы игр</h1>
                            <button className='event-button-create-game' onClick={ () => { setIsModalEventCreate(true) } }>Создать игру</button>
                        </div>
                        <div className='event-title-decorative-line'></div>
                    </div>
                    <div className='event-ready-output-container'>
                        { events.reverse().map(event => (
                            event.status == 'READY' ?
                            <ReadyEvent 
                                key={event.id || index} 
                                eventData={event} 
                                setIsModalEventRemote={setIsModalEventRemote} 
                                setModalRemoteEvent={setModalRemoteEvent} />
                            :
                            null
                        )) }
                    </div>
                </div>
                <div className='event-open-container'>
                    <div className='event-open-title-container'>
                        <div className='event-open-title-up-container'>
                            <h1>Игры открытые для регистрации</h1>
                        </div>
                        <div className='event-title-decorative-line'></div>
                    </div>
                    <div className='event-open-output-container'>
                        { events.reverse().map(event => (
                            event.status == 'OPEN' ?
                            <OpenEvent key={event.id || index} eventData={event} setErrorMessage={setErrorMessage} host={host} eventListUpdate={eventListUpdate} />
                            :
                            null
                        )) }
                    </div>
                </div>
            </div>
            {errorMessage && (
                <div className="error-message" style={{ zIndex: '1' }}>
                    {errorMessage}
                </div>
            )}
        </>
    );
};

export default Events;