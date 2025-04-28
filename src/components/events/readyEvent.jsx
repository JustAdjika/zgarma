import React, { useState } from 'react';

import './Style/readyEvent.css'
import '../../pages/Style/fonts.css'
import triangle from '../../assets/triangle.svg'

const ReadyEvent = ({isAdmin, eventData, setIsModalEventRemote, setModalRemoteEvent}) => {
    const [rotated, setRotated] = useState(true);

    const handleHide = () => {
        setRotated((prev) => !prev)
    }

    return (
        <div className='readyevent-main-container' id={`anchor-${eventData.id}`}>
            <div className='readyevent-header-container'>
                <h2 className='readyevent-title'>{ eventData.title }</h2>
                <div className='readyevent-type' style={{ backgroundColor: eventData.type == 'PVE' ? '#7B370D' : '#30762D' }}>{ eventData.type }</div>
            </div>
            <div className='readyevent-center-container'>
                <img onClick={ handleHide } src={triangle} alt="" width={40} height={40} className='readyevent-button-info-more' style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}/>
                <button style={{ display: isAdmin ? 'block' : 'none' }} onClick={ () => { setModalRemoteEvent(eventData); setIsModalEventRemote(true) } } className='readyevent-button-event-remote'>Управление игрой</button>
            </div>
            <div className='readyevent-info-container' style={{ display: rotated ? 'none' : 'flex' }}>
                <div className='readyevent-info-decorative-line'/>
                <div className='readyevent-more-info-container'>
                    <p className='readyevent-info-date'>Дата проведения { eventData.date } { eventData.time ? `(${eventData.time})` : null }</p>
                    <p className='readyevent-info-metar'>Погодные условия и рельеф: { eventData.metar }</p>
                    <h3 className='readyevent-info-description-title'>Описание миссии</h3>
                    <p className='readyevent-info-description'>{eventData.description}</p>
                    <h3 className='readyevent-info-team-title'>Стороны</h3>
                    <div className='readyevent-team-container'>
                        <div className='readyevent-team-info-container'>
                            <p className='readyevent-info-redteam-title'>Красная команда</p>
                            <div className='readyevent-team-decorative-line'/>
                            <p className='readyevent-info-team-content'>{ eventData.team1 }</p>
                        </div>
                        <div className='readyevent-team-info-container'>
                            <p className='readyevent-info-blueteam-title'>Синяя команда</p>
                            <div className='readyevent-team-decorative-line' style={{ backgroundColor: '#066DA7' }}/>
                            <p className='readyevent-info-team-content'>{ eventData.team2 }</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='readyevent-hide-info-container' style={{ display: rotated ? 'flex' : 'none' }}>
                <div className='readyevent-info-decorative-line'/>
                <div className='readyevent-more-info-container'>
                    <p className='readyevent-info-date'>Дата проведения { eventData.date } { eventData.time ? `(${eventData.time})` : null }</p>
                    <p className='readyevent-hide-info-team-content'>{ eventData.team1 }</p>
                    <p className='readyevent-hide-info-team-content'>{ eventData.team2 }</p>
                </div>
            </div>
        </div>
    );
};

export default ReadyEvent;