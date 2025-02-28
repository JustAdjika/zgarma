import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import './Style/events.css'
import './Style/fonts.css'

import ReadyEvent from '../components/events/readyEvent.jsx';
import OpenEvent from '../components/events/openEvent.jsx';

const Events = () => {
    const host = 'http://localhost:3000'
    const [events, setEvents] = useState([])
    const [eventList, eventListUpdate] = useState(0)

    // MODAL STATE
    const [isModalEventCreate, setIsModalEventCreate] = useState(false)
    const [isModalEventRemote, setIsModalEventRemote] = useState(false)
    const [modalRemoteEvent, setModalRemoteEvent] = useState({})
    const [errorMessage, setErrorMessage] = useState("");

    // EVENT REMOTE MODAL
    const [eventRemoteTitle, setEventRemoteTitle] = useState("")
    const [eventRemoteMetar, setEventRemoteMetar] = useState("")
    const [eventRemoteDescription, setEventRemoteDescription] = useState("")
    const [eventRemoteIsImg, setEventRemoteIsImg] = useState(false)
    const [eventRemoteIsMod, setEventRemoteIsMod] = useState(false)
    const [eventRemoteDate, setEventRemoteDate] = useState("")
    const [eventRemoteTimeM, setEventRemoteTimeM] = useState("")
    const [eventRemoteTimeH, setEventRemoteTimeH] = useState("")

    useEffect(() => {
        setEventRemoteTitle(modalRemoteEvent.title)
        setEventRemoteMetar(modalRemoteEvent.metar)
        setEventRemoteDescription(modalRemoteEvent.description)
        setEventRemoteDate(modalRemoteEvent.date)
        
        if(modalRemoteEvent.time) {
            const [hours, minutes] = modalRemoteEvent.time.split(":")
            setEventRemoteTimeM(minutes)
            setEventRemoteTimeH(hours)
        }
        
    }, [modalRemoteEvent])

    // EVENT CREATE MODAL
    const [eventCreateType, setEventCreateType] = useState('PVP')
    const [eventCreateTitle, setEventCreateTitle] = useState("")
    const [eventCreateDay, setEventCreateDay] = useState("")
    const [eventCreateMonth, setEventCreateMonth] = useState("")
    const [eventCreateYear, setEventCreateYear] = useState("")
    const [eventCreateMetar, setEventCreateMetar] = useState("")
    const [eventCreateDescription, setEventCreateDescription] = useState("")
    const [eventCreateTeamRed, setEventCreateTeamRed] = useState("")
    const [eventCreateTeamBlue, setEventCreateTeamBlue] = useState("")
    const [eventCreateStatus, setEventCreateStatus] = useState(false)

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


    const eventRemoteImgChange = async (e) => {
        const file = e.target.files[0]

        if(file) {
            setEventRemoteIsImg(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("key", JSON.parse(Cookies.get("userData")).key)
            formData.append("eventId", modalRemoteEvent.id)

            const res = await axios.post(`${host}/api/developer/event/edit/imgupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if(res != 200) {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }


    const eventRemoteModChange = async (e) => {
        const file = e.target.files[0]

        if(file) {
            setEventRemoteIsMod(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("key", JSON.parse(Cookies.get("userData")).key)
            formData.append("eventId", modalRemoteEvent.id)

            const res = await axios.post(`${host}/api/developer/event/edit/modsupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if(res != 200) {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }


    const handleCreateEvent = async () => {
        const newEventData = {
            type: eventCreateType,
            title: eventCreateTitle,
            metar: eventCreateMetar,
            description: eventCreateDescription,
            team1: eventCreateTeamRed,
            team2: eventCreateTeamBlue,
            date: `${eventCreateDay}.${eventCreateMonth}.${eventCreateYear}`,
            key: JSON.parse(Cookies.get("userData")).key
        }
        

        const res = await axios.post(`${host}/api/developer/event/add`, newEventData)

        if(res.data.status == 200) {
            setEventCreateStatus(true)
            setTimeout(() => { setEventCreateStatus(false) }, 5000)
            window.location.reload()
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => {setErrorMessage("")}, 3000)
            console.log(res.data.err)
        }
    }


    const handleOpenEvent = async () => {
        if(window.confirm('Вы уверены, что хотите открыть событие?')){
            const res = await axios.post(`${host}/api/developer/event/edit/status/open`, {
                eventId: modalRemoteEvent.id,
                key: JSON.parse(Cookies.get("userData")).key
            })

            if(res.data.status == 200) {
                window.location.reload()
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }

    const handleDeleteEvent = async () => {
        if(window.confirm('Вы уверены, что хотите удалить событие?')){
            console.log(JSON.parse(Cookies.get("userData")).key)
            const res = await axios.delete(`${host}/api/developer/event/edit/delete`, {
                data: {
                    eventId: modalRemoteEvent.id,
                    key: JSON.parse(Cookies.get("userData")).key
                }
            })

            if(res.data.status == 200) {
                window.location.reload()
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }


    return (
        <>
            <div onClick={ () => { setIsModalEventRemote(false) } } className='event-modal-eventremote-main' style={{ display: isModalEventRemote ? 'flex' : 'none' }}>
                <div onClick={(e) => e.stopPropagation()} className='event-modal-eventremote-container'>
                    <div className='event-modal-eventremote-info-container'>



                        <input 
                            onBlur={() => { 
                                axios.patch(`${host}/api/developer/event/edit/info`, { 
                                    key: JSON.parse(Cookies.get("userData")).key, 
                                    eventId: modalRemoteEvent.id,  
                                    title: eventRemoteTitle 
                                }) 
                            }} 
                            type="text" 
                            className='event-modal-eventremote-info-title' 
                            onChange={(e) => { setEventRemoteTitle(e.target.value) }} 
                            value={eventRemoteTitle}
                            maxLength={25}
                        />


                        <input 
                            type="file" 
                            accept="image/*" 
                            className='event-modal-eventremote-inputfile' 
                            id='event-modal-eventremote-inputfile-img' 
                            onChange={eventRemoteImgChange} 
                            style={{ display: 'none' }}
                        />


                        <div className='event-modal-eventremote-inputfile-container'>
                        <label 
                            htmlFor="event-modal-eventremote-inputfile-img" 
                            className='event-modal-eventremote-inputfile-label'
                        >
                            Добавить изображение
                        </label>
                            <span 
                                style={{ 
                                    display: eventRemoteIsImg ? 'flex' : 'none', 
                                    marginLeft: '20px', 
                                    fontSize: '15pt', 
                                    color: '#D9D9D9' 
                                }}
                            >
                                Файл загружен
                            </span>
                        </div>


                        <input 
                            onBlur={() => { 
                                axios.patch(`${host}/api/developer/event/edit/info`, { 
                                    key: JSON.parse(Cookies.get("userData")).key, 
                                    eventId: modalRemoteEvent.id,  
                                    metar: eventRemoteMetar
                                }) 
                            }} 
                            type="text" 
                            className='event-modal-eventremote-info-metar' 
                            onChange={(e) => { setEventRemoteMetar(e.target.value) }} 
                            value={eventRemoteMetar}
                            maxLength={40}
                        />


                        <textarea
                            onBlur={() => { 
                                axios.patch(`${host}/api/developer/event/edit/info`, { 
                                    key: JSON.parse(Cookies.get("userData")).key, 
                                    eventId: modalRemoteEvent.id,  
                                    description: eventRemoteDescription
                                }) 
                            }} 
                            type="text" 
                            className='event-modal-eventremote-info-description' 
                            onChange={(e) => { setEventRemoteDescription(e.target.value) }} 
                            value={eventRemoteDescription}
                        />


                        <input 
                            type="file" 
                            className='event-modal-eventremote-inputfile' 
                            id='event-modal-eventremote-inputfile-mods' 
                            onChange={eventRemoteModChange} 
                            style={{ display: 'none' }}
                        />


                        <div className='event-modal-eventremote-inputfile-container' style={{ marginTop: '40px' }}>
                            <label 
                                htmlFor="event-modal-eventremote-inputfile-mods" 
                                className='event-modal-eventremote-inputfile-label'
                            >
                                Загрузить сборку модов
                            </label>
                            <span 
                                style={{ 
                                    display: eventRemoteIsMod ? 'flex' : 'none', 
                                    marginLeft: '20px', 
                                    fontSize: '15pt', 
                                    color: '#D9D9D9' 
                                }}
                            >
                                Файл загружен
                            </span>
                        </div>


                        <div className='event-modal-eventremote-td-info-container'>
                            <div className='event-modal-eventremote-date-container'>
                                <span className='event-modal-eventremote-td-info-title'>Дата проведения</span>
                                <input 
                                    className='event-modal-eventremote-td-input' 
                                    maxLength={8}
                                    style={{ 
                                        width: '90px', 
                                        marginLeft: '45px',
                                        textAlign: 'left',
                                    }} 
                                    onChange={(e) => { setEventRemoteDate(e.target.value) }}
                                    value={ eventRemoteDate }
                                    placeholder='дд.мм.гг'
                                    onBlur={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/info`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            date: eventRemoteDate
                                        }) 
                                    }} 
                                />
                            </div>
                            <div className='event-modal-eventremote-time-container'>
                                <span className='event-modal-eventremote-td-info-title'>Время проведения</span>
                                <span style={{color: '#D9D9D9', marginLeft: '28px'}}>
                                    <input 
                                        className='event-modal-eventremote-td-input' 
                                        maxLength={2} 
                                        minLength={2} 
                                        type="text" 
                                        placeholder='--' 
                                        value={eventRemoteTimeH}
                                        onChange={(e) => { setEventRemoteTimeH(e.target.value) }}
                                        onBlur={() => { 
                                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                                key: JSON.parse(Cookies.get("userData")).key, 
                                                eventId: modalRemoteEvent.id,  
                                                time: `${eventRemoteTimeH}:${eventRemoteTimeM}`
                                            }) 
                                        }} 
                                    />
                                    :
                                    <input 
                                        className='event-modal-eventremote-td-input' 
                                        maxLength={2} 
                                        minLength={2} 
                                        type="text" 
                                        placeholder='--' 
                                        value={eventRemoteTimeM}
                                        onChange={(e) => { setEventRemoteTimeM(e.target.value) }}
                                        onBlur={() => { 
                                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                                key: JSON.parse(Cookies.get("userData")).key, 
                                                eventId: modalRemoteEvent.id,  
                                                time: `${eventRemoteTimeH}:${eventRemoteTimeM}`
                                            }) 
                                        }} 
                                    />
                                </span>
                            </div>
                        </div>

                        
                        <button className='event-modal-eventremote-button-openEvent' onClick={ handleOpenEvent }>
                            Открыть миссию
                        </button>
                        <p style={{ color: '#ffffff50', width: '400px', margin: '0px' }}>Отменить действие будет нельзя, придется удалять миссию и создавать заново.</p>
                        <button className='event-modal-eventremote-button-deleteEvent' onClick={ handleDeleteEvent }>
                            Удалить миссию
                        </button>
                    </div>
                    <div className='event-modal-eventremote-slots-container'>
                            
                    </div>
                </div>
            </div>
            <div onClick={ () => { setIsModalEventCreate(false) } } className='event-modal-eventcreate-main' style={{ display: isModalEventCreate ? 'flex' : 'none' }}>
                <div onClick={(e) => e.stopPropagation()} className='event-modal-eventcreate-container'>
                    <input type="text" onChange={ (e) => { setEventCreateTitle(e.target.value) } } placeholder='Название миссии' maxLength={25} className='event-modal-eventcreate-title' />
                    <div className='event-modal-eventcreate-date-container'>
                        <span className='event-modal-eventcreate-date-title'>Дата проведения</span>
                        <input type="text" onChange={ (e) => { setEventCreateDay(e.target.value) } } className='event-modal-eventcreate-date-input' placeholder='дд' maxLength={2} />
                        <span>.</span>
                        <input type="text" onChange={ (e) => { setEventCreateMonth(e.target.value) } } className='event-modal-eventcreate-date-input' placeholder='мм' maxLength={2} />
                        <span>.</span>
                        <input type="text" onChange={ (e) => { setEventCreateYear(e.target.value) } } className='event-modal-eventcreate-date-input' placeholder='гг' maxLength={2} />
                    </div>
                    <input type="text" onChange={ (e) => { setEventCreateMetar(e.target.value) } } className='event-modal-eventcreate-metar-input' placeholder='Погода и рельеф' maxLength={40} />
                    <textarea type="text" onChange={ (e) => { setEventCreateDescription(e.target.value) } } className='event-modal-eventcreate-description-input' placeholder='Описание' />
                    <div className='event-modal-eventcreate-type-container'>
                        <button onClick={ () => { setEventCreateType('PVP') } } className='event-modal-eventcreate-button-type-pvp' style={{ backgroundColor: eventCreateType == 'PVP' ? '#30762D' : '#2E2E2E' }}>PVP</button>
                        <button onClick={ () => { setEventCreateType('PVE') } } className='event-modal-eventcreate-button-type-pve' style={{ backgroundColor: eventCreateType == 'PVE' ? '#AD521E' : '#2E2E2E' }}>PVE</button>
                    </div>
                    <div className='event-modal-eventcreate-teams-container'>
                        <div className='event-modal-eventcreate-team-container'>
                            <span style={{ color: '#C0392B', fontFamily: 'My Open Sans', fontSize: '23pt' }}>Красная сторона</span>
                            <div style={{ backgroundColor: '#C0392B' }} className='event-modal-eventcreate-team-decorative-line'/>
                            <textarea onChange={ (e) => { setEventCreateTeamRed(e.target.value) } } maxLength={60} type="text" placeholder='Красная команда' className='event-modal-eventcreate-team-input'/>
                        </div>
                        <div className='event-modal-eventcreate-team-container'>
                            <span style={{ color: '#0B94E0', fontFamily: 'My Open Sans', fontSize: '23pt' }}>Красная сторона</span>
                            <div style={{ backgroundColor: '#0B94E0' }} className='event-modal-eventcreate-team-decorative-line'/>
                            <textarea onChange={ (e) => { setEventCreateTeamBlue(e.target.value) } } maxLength={60} className='event-modal-eventcreate-team-input' type="text" placeholder='Синяя команда' />
                        </div>
                    </div>
                    <button className='event-modal-eventcreate-button-publish' onClick={ handleCreateEvent }>Объявить</button>
                    <span style={{ marginTop: '10px', color: '#0B94E0', fontSize: '13pt', display: eventCreateStatus ? 'flex' : 'none' }}>Событие успешно объявлено</span>
                </div>
            </div>
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