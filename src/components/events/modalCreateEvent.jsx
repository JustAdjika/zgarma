import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalCreateEvent.css'

const ModalCreateEvent = ({ isModalEventCreate, host }) => {
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


    return (
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
    );
};

export default ModalCreateEvent;