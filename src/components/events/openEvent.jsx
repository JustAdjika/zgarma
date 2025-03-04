import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/openEvent.css'
import '../../pages/Style/fonts.css'
import triangle from '../../assets/triangle.svg'

const OpenEvent = ({eventData, setErrorMessage, host, eventListUpdate, setIsModalEventRegister, setModalRegisterEvent}) => {
    const [rotated, setRotated] = useState(true);

    const handleHide = () => {
        setRotated((prev) => !prev)
    }

    const vehicle1 = JSON.parse(eventData.vehTeam1)
    const vehicle2 = JSON.parse(eventData.vehTeam2)

    const handleCloseEvent = async () => {
        if(window.confirm('Вы уверены, что хотите закончить событие?')){
            const data = {
                eventId: eventData.id,
                key: JSON.parse(Cookies.get("userData")).key
            }
            
            const res = await axios.post(`${host}/api/developer/event/edit/status/close`, data)
    
            if(res.data.status == 200) {
                eventListUpdate(prev => prev + 1)
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }

    return (
        <div className='openevent-main-container'>
            <div className='openevent-header-container'>
                <h2 className='openevent-title'>{ eventData.title }</h2>
                <div className='openevent-type' style={{ backgroundColor: eventData.type == "PVP" ? '#30762D' : "#7B370D"}}>{ eventData.type }</div>
            </div>
            <div className='openevent-center-container'>
                <img onClick={ handleHide } src={triangle} alt="" width={40} height={40} className='openevent-button-info-more' style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}/>
                <button className='openevent-button-requests-open'>Просмотр заявок</button>
                <span className='openevent-mod-download-container'>Нажмите, чтобы <a href={`${host}/api/developer/event/data/download/modpack/${eventData.id}`} className='openevent-button-mod-download'>скачать сборку</a></span>
            </div>
            <div className='openevent-info-container' style={{ display: rotated ? 'none' : 'flex' }}>
                <div className='openevent-info-decorative-line'/>
                <div className='openevent-more-info-container'>
                    <p className='openevent-info-date'>Дата проведения { eventData.date } { eventData.time ? `(${eventData.time})` : null }</p>
                    <p className='openevent-info-metar'>Погодные условия и рельеф: { eventData.metar }</p>
                    <h3 className='openevent-info-description-title'>Описание миссии</h3>
                    <p className='openevent-info-description'>{eventData.description}</p>
                    <h3 className='openevent-info-team-title'>Стороны</h3>
                    <div className='openevent-team-container'>
                        <div className='openevent-team-info-container'>
                            <p className='openevent-info-redteam-title'>Красная команда</p>
                            <div className='openevent-team-decorative-line'/>
                            <p className='openevent-info-team-content'>{ eventData.team1 }</p>
                            <div className='openevent-info-team-vehicle'>
                                { vehicle1.map(element => (
                                    <p>{ `${element.count}x ${element.title}` }</p>
                                ))}
                            </div>
                        </div>
                        <div className='openevent-team-info-container'>
                            <p className='openevent-info-blueteam-title'>Синяя команда</p>
                            <div className='openevent-team-decorative-line' style={{ backgroundColor: '#066DA7' }}/>
                            <p className='openevent-info-team-content'>{ eventData.team2 }</p>
                            <div className='openevent-info-team-vehicle'>
                                { vehicle2.map(element => (
                                    <p>{ `${element.count}x ${element.title}` }</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className='openevent-button-register' onClick={ () => { setIsModalEventRegister(true); setModalRegisterEvent(eventData) } }>Информация и слоты</button>
                    <button className='openevent-button-close-game' onClick={ handleCloseEvent }>Закончить игру</button>
                </div>
            </div>
            <div className='openevent-hide-info-container' style={{ display: rotated ? 'flex' : 'none' }}>
                <div className='openevent-info-decorative-line'/>
                <div className='openevent-more-info-container' style={{ marginBottom: '30px' }}>
                    <p className='openevent-info-date'>Дата проведения { eventData.date } { eventData.time ? `(${eventData.time})` : null }</p>
                    <p className='openevent-hide-info-team-content'>{ eventData.team1 }</p>
                    <p className='openevent-hide-info-team-content'>{ eventData.team2 }</p>
                </div>
            </div>
        </div>
    );
};

export default OpenEvent;