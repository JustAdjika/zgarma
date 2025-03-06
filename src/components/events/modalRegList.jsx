import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalRegList.css'
import '../../pages/Style/fonts.css'

const ModalRegList = ({ host, setIsModalReglist, isModalReglist, setEvent, event, setErrorMessage }) => {
    return (
        <div onClick={ () => { setIsModalReglist(false) } } className='event-modal-reglist-main' style={{ display: isModalReglist ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-reglist-container'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 className='event-modal-reglist-title' style={{ fontSize: event?.title?.length > 23 ? '23px' : '30px'}}>{event.title}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '650px', height: '100%' }}>
                        <div className='event-modal-reglist-req-main-container'>
                            <div className='event-modal-reglist-req-container'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h2>Adjika</h2>
                                    <div className='event-modal-reglist-req-marker' style={{backgroundColor:"#FF9F1A"}} />
                                    <div className='event-modal-reglist-req-marker' style={{backgroundColor:"#30762D"}} />
                                </div>
                                <div style={{ width: '100%', marginBottom: '10px', height: '5px', backgroundColor: '#D9D9D9' }} />
                                <span style={{ color: '#C0392B' }}>Красный отряд</span>
                                <span >Пехота</span>
                                <span >Командир отряда</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '', width: '275px', height: '100%' }}>
                            <div className='event-modal-reglist-report-container'>
                                <h2>Сводка аккаунта</h2>
                                <div />
                                <h3>Ник Steam</h3>
                                <span>Adjika</span>
                                <h3>Ник Discord</h3>
                                <span>justadjika</span>
                                <h3>DiscordID</h3>
                                <span>596738020065935360</span>
                                <h3>Часы в ARMA</h3>
                                <span>700ч</span>
                                <h3>Дата регистрации</h3>
                                <span>06.03.25</span>
                                <h3>Unit</h3>
                                <span>Нет</span>
                            </div>
                            <button className='event-modal-reglist-report-button-a'>Одобрить заявку</button>
                            <button className='event-modal-reglist-report-button-r'>Отклонить заявку</button>
                            <textarea placeholder='Причина' className='event-modal-reglist-report-reason-input'></textarea>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>

                </div>
            </div>
        </div>
    );
};

export default ModalRegList;