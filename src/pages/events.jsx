import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/events.css'
import './Style/fonts.css'

import ReadyEvent from '../components/events/readyEvent.jsx';
import OpenEvent from '../components/events/openEvent.jsx';
import ModalEventRemote from '../components/events/modalEventRemote.jsx';
import ModalCreateEvent from '../components/events/modalCreateEvent.jsx';
import ModalRegister from '../components/events/modalRegister.jsx';
import ModalRegList from '../components/events/modalRegList.jsx';

const Events = ({isDevBranch}) => {
    const host = 'https://api.zgarma.ru'
    const [events, setEvents] = useState([])
    const [eventList, eventListUpdate] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isAccount, setIsAccount] = useState(false)

    // MODAL STATE
    const [isModalEventCreate, setIsModalEventCreate] = useState(false) // Состояние модального окна - Создание ивента
    const [isModalEventRemote, setIsModalEventRemote] = useState(false) // Состояние модального окна - Управление ивентом
    const [isModalEventRegister, setIsModalEventRegister] = useState(false) // Состояние модального окна - Регистрация на ивент
    const [isModalEventReglist, setIsModalEventReglist] = useState(false)
    
    const [modalRemoteEvent, setModalRemoteEvent] = useState({}) // Ивент, которым управляют в данный момент
    const [modalRegisterEvent, setModalRegisterEvent] = useState({}) // Ивент, на который регистрируются в данный момент
    const [modalReglistEvent, setModalReglistEvent] = useState({})
    
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const accountCheck = async () => {
            if(!JSON.parse(Cookies.get("userData"))) {
                setIsAccount(false)
            } else {
                if(!JSON.parse(Cookies.get("userData")).steam) { setIsAccount(false) }
                else { setIsAccount(true) } 
            }
        }
        const getEvents = async () => {
            const res = await axios.get(`${host}/api/developer/event/data/all`)
            console.log(isDevBranch)
            setEvents(res.data.container.filter(event => event.devBranch == isDevBranch))
        }
        const adminCheck = async () => {
            if(!JSON.parse(Cookies.get("userData"))) return
            const res = await axios.get(`${host}/api/developer/adminlist/remote/isAdmin?id=${JSON.parse(Cookies.get('userData')).id}`)

            if(res.data.status == 200) {
                setIsAdmin(res.data.container)
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => setErrorMessage(""), 3000)
            }
        }

        accountCheck()
        getEvents()
        adminCheck()
    }, [])

    useEffect(() => {
        const getEvents = async () => {
            const res = await axios.get(`${host}/api/developer/event/data/all`)
            setEvents(res.data.container.filter(event => event.devBranch == isDevBranch))
        }

        getEvents()
    }, [eventList])


    return (
        <>
            <ModalRegList 
                host={host} 
                setIsModalReglist={setIsModalEventReglist}
                isModalReglist={isModalEventReglist}
                setEvent={setModalReglistEvent}
                event={modalReglistEvent}
                setErrorMessage={setErrorMessage}
            />

            <ModalRegister 
                host={host} 
                setIsModalEventRegister={setIsModalEventRegister}
                setModalRegisterEvent={setModalRegisterEvent}
                modalRegisterEvent={modalRegisterEvent}
                isModalEventRegister={isModalEventRegister}
                setErrorMessage={setErrorMessage}
                isAccount={isAccount}
            />

            <ModalEventRemote 
                host={host} 
                setIsModalEventRemote={setIsModalEventRemote} 
                isModalEventRemote={isModalEventRemote} 
                modalRemoteEvent={modalRemoteEvent} 
                setModalRemoteEvent={setModalRemoteEvent} 
                setErrorMessage={setErrorMessage}
                isDevBranch={isDevBranch}
            />
            
            <ModalCreateEvent 
                isModalEventCreate={isModalEventCreate} 
                setIsModalEventCreate={setIsModalEventCreate}
                host={host} 
                setErrorMessage={setErrorMessage}
                isDevBranch={isDevBranch}
            />
            <div className='event-main-container'>
                <div className='event-ready-container'>
                    <div className='event-ready-title-container'>
                        <div className='event-ready-title-up-container'>
                            <h1>Анонсы игр</h1>
                            <button className='event-button-create-game' style={{ alignItems: 'center', justifyContent: 'center', display: isAdmin ? 'flex' : 'none' }} onClick={ () => { setIsModalEventCreate(true) } }>Создать игру</button>
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
                                isAdmin={isAdmin} 
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
                            <OpenEvent 
                                key={event.id || index} 
                                isAdmin={isAdmin}
                                eventData={event} 
                                setErrorMessage={setErrorMessage} 
                                host={host} 
                                eventListUpdate={eventListUpdate} 
                                setModalRegisterEvent={setModalRegisterEvent} 
                                setIsModalEventRegister={setIsModalEventRegister}
                                setIsModalEventReglist={setIsModalEventReglist}
                                isDevBranch={isDevBranch}
                                setModalReglistEvent={setModalReglistEvent}/>
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