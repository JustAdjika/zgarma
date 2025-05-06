import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon'
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalRegList.css'
import '../../pages/Style/fonts.css'

import ReglistItem from './reglist/reglistItem.jsx';
import ReglistReport from './reglist/reglistReport.jsx';
import ReglistSquad from './reglist/reglistSquad.jsx';
import ReglistSlot from './reglist/reglistSlot.jsx';

import { faCircleInfo, faUserMinus, faRetweet, faShare } from '@fortawesome/free-solid-svg-icons';

const ModalRegList = ({ host, setIsModalReglist, isModalReglist, setEvent, event, setErrorMessage }) => {
    const [reqests, setRequests] = useState([])
    const [slotsRed, setSlotsRed] = useState([])
    const [slotsBlue, setSlotsBlue] = useState([])

    const [selectedRequest, setSelectedRequest] = useState(null)

    const [reason, setReason] = useState("")
    const [isCancelMenu, setIsCancelMenu] = useState(false)
    const [isSlotOccupied, setIsSlotOccupied] = useState(false)

    const [loadCount, setLoadCount] = useState(0)
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const [isNoticeMenu, setIsNoticeMenu] = useState(false)

    const handleContextMenu = (e) => {
        setMenuVisible(!menuVisible);
        setIsNoticeMenu(false)
        e.preventDefault();
        if(!menuVisible) setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
        if (menuVisible) setMenuVisible(false);
        if (isNoticeMenu) setIsNoticeMenu(false)
        setNoticeText('')
    };

    const getRequests = async () => {
        handleLoadChange(true)
        const res = await axios.post(`${host}/api/developer/event/request/data/id`, {
            key: JSON.parse(Cookies.get("userData")).key,
            id: event.id
        })

        if(res.data.status == 200) {
            setRequests(res.data.container.filter((item) => item.status == true))
            handleLoadChange(false)
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => {setErrorMessage("")}, 3000)
            handleLoadChange(false)
        }
    }

    const updateEvent = async () => {
        const res = await axios.get(`${host}/api/developer/event/data/all`)

        if(res.data.status == 200) {
            const events = res.data.container
            
            setEvent(events.filter(item => item.id == event.id)[0])
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => {setErrorMessage("")}, 3000)
        }
    }

    useEffect(() => {
        if(!isModalReglist) return

        getRequests()

        if(!event.id) return

        setSlotsRed(event.slotsTeam1.filter((item, index) => index != 0))
        setSlotsBlue(event.slotsTeam2.filter((item, index) => index != 0))
    }, [event])

    useEffect(() => {
        if(selectedRequest !== null) setIsContextmenuReport(false)
    }, [selectedRequest])

    const handleRequestAccept = async () => {

        if(selectedRequest == null) return

        const thisRequest = reqests[selectedRequest] 
        let slotTitle

        if(thisRequest.slot == 0) {
            if(thisRequest.team == 'Red') {
                slotTitle = 'Командир красной стороны'
            }else {
                slotTitle = 'Командир синей стороны'
            }
        } else {
            if(thisRequest.team == 'Red') {
                slotTitle = event.slotsTeam1[thisRequest.squad].slots[thisRequest.slot].title
            } else {
                slotTitle = event.slotsTeam2[thisRequest.squad].slots[thisRequest.slot].title
            }
        }


        const res = await axios.post(`${host}/api/developer/event/request/accept`, {
            key: JSON.parse(Cookies.get("userData")).key,
            requestId: thisRequest.id,
            dest: thisRequest.userId,
            eventSlot: slotTitle,
            eventTitle: event.title
        })

        if(res.data.status == 200) {
            setSelectedRequest(null)
            getRequests()
            updateEvent()
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => { setErrorMessage("") }, 3000)
        }
    }

    const handleRequestReject = async () => {
        if(selectedRequest == null) return
        const thisRequest = reqests[selectedRequest] 

        const res = await axios.post(`${host}/api/developer/event/request/cancel`, {
            key: JSON.parse(Cookies.get("userData")).key,
            requestId: thisRequest.id,
            dest: thisRequest.userId,
            reason: reason
        })

        if(res.data.status == 200) {
            setSelectedRequest(null)
            getRequests()
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => { setErrorMessage("") }, 3000)
        }

    }


    useEffect(() => {
        setSelectedRequest(null)
    }, [event])

    useEffect(() => {
        if(selectedRequest === null) return
        const requestInfo = reqests[selectedRequest]

        const isDefault = requestInfo.squad === 0 ? false : true

        if(requestInfo.team == 'Red') {
            if(isDefault) {
                if(event.slotsTeam1[requestInfo.squad].slots[requestInfo.slot].player !== null) setIsSlotOccupied(true)
                else setIsSlotOccupied(false)
            } else {
                if(event.slotsTeam1[requestInfo.squad].player !== null) setIsSlotOccupied(true)
                else setIsSlotOccupied(false)
            }
        } else {
            if(isDefault) {
                if(event.slotsTeam2[requestInfo.squad].slots[requestInfo.slot].player !== null) setIsSlotOccupied(true)
                else setIsSlotOccupied(false)
            } else {
                if(event.slotsTeam2[requestInfo.squad].player !== null) setIsSlotOccupied(true)
                else setIsSlotOccupied(false)
            }
        }
    }, [selectedRequest])

    
    const [isOccupiedTooltip, setIsOccupiedTooltip] = useState(false)
    const timerRef = useRef(null)

    const handleButtonAcceptMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setIsOccupiedTooltip(true)
        }, 550)
    }

    const handleButtonAcceptMouseLeave = () => {
        clearTimeout(timerRef.current);
        setIsOccupiedTooltip(false);
    }

    const handleLoadChange = (isLoading) => {
        setLoadCount(prev => isLoading ? prev + 1 : prev - 1)
    }

    const [contextUserid, setContextUserid] = useState(null)

    const handleSlotFreeup = async () => {
        handleClick()

        handleLoadChange(true)
        console.log(contextUserid)
        const res = await axios.patch(`${host}/api/developer/event/edit/squad/slots/freeup/force`, {
            key: JSON.parse(Cookies.get("userData")).key,
            eventId: event.id,
            userId: contextUserid
        })

        if(res.data.status == 200) {
            const eventsRes = await axios.get(`${host}/api/developer/event/data/all`)

            if(eventsRes.data.status == 200) {
                try {
                    updateEvent()
                } catch (e) {
                    setErrorMessage(e)
                    setTimeout(() => setErrorMessage(""), 3000)
                }
            } else {
                setErrorMessage(eventsRes.data.err)
                setTimeout(() => setErrorMessage(""), 3000)
            }
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => setErrorMessage(""), 3000)
        }

        handleLoadChange(false)
    } 


    const [contextUserInfo, setContextUserInfo] = useState(null)
    const [isContextmenuReport, setIsContextmenuReport] = useState(false)

    const handleShowInfo = async () => {
        handleClick()
        setSelectedRequest(null)
        setIsContextmenuReport(true)

        const res = await axios.get(`${host}/api/developer/account/data/id?id=${contextUserid}`)

        if(res.data.status == 200) {
            const preData = {
                steamName: res.data.container.steam.personaname,
                discordName: res.data.container.discord.username,
                discordid: res.data.container.discord.id,
                regDate: null,
            }

            setContextUserInfo(preData)

            try {
                const moscowDate = res.data.container.date
                const parts = moscowDate.match(/(\d{2})\.(\d{2})\.(\d{2}) \((\d{2}):(\d{2})\)/)

                if(parts) {
                    const [_, day, month, year, hour, minute] = parts;

                    const fullYear = 2000 + parseInt(year);

                    const ISOmoscowDate = DateTime.fromObject(
                        {
                        day: parseInt(day),
                        month: parseInt(month),
                        year: fullYear,
                        hour: parseInt(hour),
                        minute: parseInt(minute),
                        },
                        { zone: 'Europe/Moscow' }
                    );

                    const localDate = ISOmoscowDate.setZone(DateTime.local().zoneName);
                    const displayTime = localDate.toFormat('dd.MM.yy (HH:mm)');

                    setContextUserInfo(prev => ({...prev, regDate: displayTime}))
                }
            } catch (e) {
                console.error(e)
            }

            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => { setErrorMessage("") }, 3000)
        }
    }

    const [ noticeText, setNoticeText ] = useState('')

    const handleSendNotice = () => {
        axios.post(`${host}/api/developer/account/notices/add`, {
            key: JSON.parse(Cookies.get("userData")).key,
            dest: contextUserid,
            content: noticeText
        })

        setNoticeText('')
        handleClick()
    }

    return (
        <div onClick={ () => { setIsModalReglist(false); handleClick() } } className='event-modal-reglist-main' style={{ display: isModalReglist ? 'flex' : 'none' }}>
            <div onClick={(e) => { e.stopPropagation(); handleClick()}} className='event-modal-reglist-container'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={`event-contextmenu-noticemenu-container ${isNoticeMenu ? 'visible' : ''}`} style={{
                        position: "absolute",
                        top: menuPosition.y,
                        left: menuPosition.x + 50,
                        listStyle: "none",
                        margin: 0,
                        zIndex: 45,
                        width: '250px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                    }} onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                        <textarea className='event-contextmenu-noticemenu-textarea' value={ noticeText } onChange={ (e) => setNoticeText(e.target.value) } placeholder='Введите текст оповещения' type="text" />
                        <button className='event-contextmenu-noticemenu-but' onClick={ handleSendNotice }>Отправить</button>
                    </div>
                    <ul
                        className={`event-contextmenu ${menuVisible ? 'visible' : ''}`}
                        style={{
                            position: "absolute",
                            top: menuPosition.y,
                            left: menuPosition.x,
                            listStyle: "none",
                            margin: 0,
                            zIndex: 40,
                            width: '250px',
                            paddingTop: '10px',
                            paddingBottom: '10px'
                        }}
                    >
                        <li className='event-reglist-contextmenu-li-container' onClick={ (e) => {e.preventDefault(); e.stopPropagation(); handleShowInfo() } }>
                            <div className='event-reglist-contextmenu-icon-container'>
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </div>
                            Показать информацию
                        </li>
                        <li className='event-reglist-contextmenu-li-container' onClick={ null }>
                            <div className='event-reglist-contextmenu-icon-container'>
                                <FontAwesomeIcon icon={faRetweet} />
                            </div>
                            Переназначить
                        </li>
                        <li className='event-reglist-contextmenu-li-container' onClick={ (e) => {e.preventDefault(); e.stopPropagation(); handleClick(); setIsNoticeMenu(true) } }>
                            <div className='event-reglist-contextmenu-icon-container'>
                                <FontAwesomeIcon icon={faShare} />
                            </div>
                            Отправить уведомление
                        </li>
                        <li className='event-reglist-contextmenu-li-container' onClick={ (e) => {e.preventDefault(); e.stopPropagation(); handleSlotFreeup() } } style={{ color: '#c0392b' }} >
                            <div className='event-reglist-contextmenu-icon-container'>
                                <FontAwesomeIcon icon={faUserMinus} />
                            </div>
                            Убрать со слота
                        </li>
                    </ul>

                    <h2 className='event-modal-reglist-title' style={{ fontSize: event?.title?.length > 23 ? '23px' : '30px'}}>{event.title}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '650px', height: '100%' }}>
                        <div className='event-modal-reglist-req-main-container'>
                            <div class="loader" style={{ marginLeft: '100px', marginTop: '220px', display: loadCount > 0 ? 'block' : 'none' }}></div>
                            { reqests.map((requestItem, requestIndex) => ( 
                                <div style={{ display: loadCount > 0 ? 'none' : 'block' }}>
                                    <ReglistItem 
                                        requestIndex={requestIndex}
                                        requestItem={requestItem}
                                        setSelectedRequest={setSelectedRequest}
                                        selectedRequest={selectedRequest}
                                        host={host}
                                        setErrorMessage={setErrorMessage}
                                        event={event}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '', width: '275px', height: '100%' }}>
                            <ReglistReport 
                                host={host}
                                currentRequest={ !isContextmenuReport ? reqests[selectedRequest] : contextUserInfo}
                                setErrorMessage={setErrorMessage}
                                isContextmenu={ isContextmenuReport }
                            />
                            

                            { !isCancelMenu ? (
                                <>
                                    <div style={{ position: 'relative' }}>
                                        <div className='event-modal-reglist-report-button-a-wrapper'
                                            onMouseEnter={ isSlotOccupied || selectedRequest === null ? handleButtonAcceptMouseEnter : null } 
                                            onMouseLeave={ handleButtonAcceptMouseLeave } 
                                        >
                                            <button className='event-modal-reglist-report-button-a'
                                                disabled={isSlotOccupied || selectedRequest === null} 
                                                style={ isSlotOccupied || selectedRequest === null ? { 
                                                    cursor: 'not-allowed', 
                                                    opacity: '0.5' 
                                                } : null} 
                                                onClick={ handleRequestAccept }
                                            >
                                                Одобрить заявку
                                            </button>
                                        </div>
                                        <div style={{ top: '15px', left: '280px' }} className={`event-modal-reglist-report-button-a-alert ${isOccupiedTooltip ? 'visible' : ''}`}>
                                            { selectedRequest === null ? 'Выберите слот!' : isSlotOccupied ? 'Слот уже занят!' : null }
                                        </div>
                                    </div>
                                    <div className='event-modal-reglist-report-button-a-wrapper'
                                        onMouseEnter={ selectedRequest === null ? handleButtonAcceptMouseEnter : null } 
                                        onMouseLeave={ handleButtonAcceptMouseLeave } 
                                    >
                                        <button 
                                            className='event-modal-reglist-report-button-r' 
                                            onClick={ () => setIsCancelMenu(true) }
                                            disabled={selectedRequest === null} 
                                            style={selectedRequest === null ? { 
                                                cursor: 'not-allowed', 
                                                opacity: '0.5' 
                                            } : null} 
                                        >
                                            Отклонить заявку
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center' }}>
                                    <textarea placeholder='Причина' value={ reason } onChange={(e) => { setReason(e.target.value) }} className='event-modal-reglist-report-reason-input'></textarea>
                                    <div className={`event-modal-reglist-report-button-a-alert ${isOccupiedTooltip ? 'visible' : ''}`}>
                                        { selectedRequest === null ? 'Выберите слот!' : reason.length < 1 ? 'Введите причину' : null }
                                    </div>
                                    <div className='event-modal-reglist-report-button-a-wrapper'
                                        onMouseEnter={ selectedRequest === null || reason < 1 ? handleButtonAcceptMouseEnter : null } 
                                        onMouseLeave={ handleButtonAcceptMouseLeave } 
                                    >
                                        <button 
                                            className='event-modal-reglist-report-button-r' 
                                            onClick={ handleRequestReject }
                                            disabled={selectedRequest === null || reason < 1} 
                                            style={selectedRequest === null || reason < 1 ? { 
                                                cursor: 'not-allowed', 
                                                opacity: '0.5' 
                                            } : null} 
                                        >
                                            Подтвердить
                                        </button>
                                    </div>
                                    <button 
                                        className='event-modal-reglist-report-button-r-cancel' 
                                        onClick={ () => setIsCancelMenu(false) }
                                    >
                                            Отменить
                                    </button>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '660px', height: '800px', marginRight: '30px' }}>
                    <div style={{ display: 'flex', height: '40px', marginBottom: '13px' }}>
                        <div className='event-modal-reglist-slots-header' style={{ marginRight: '30px' }}>
                            <h2 style={{color:'#C0392B'}}>Красная сторона</h2>
                            <div style={{backgroundColor: '#C0392B'}}/>
                        </div>
                        <div className='event-modal-reglist-slots-header'>
                            <h2 style={{color:'#0B94E0'}}>Синяя сторона</h2>
                            <div style={{backgroundColor: '#0B94E0'}}/>
                        </div>
                    </div>
                    <div className="loader" style={{ marginLeft: '290px', marginTop: '250px', display: loadCount > 0 ? 'block' : 'none' }}></div>


                    <div className='event-modal-reglist-slots-main' style={{ display: loadCount > 0 ? 'none' : 'flex' }}>
                        <div className='event-modal-reglist-slots-container' style={{ marginRight: '30px' }}>
                            <ReglistSlot 
                                host={host}
                                setErrorMessage={setErrorMessage}
                                event={event}
                                currentRequest={selectedRequest}
                                reqests={reqests}
                                type={'CMD'}
                                team={0}
                                handleLoadChange={handleLoadChange}
                                handleContextMenu={handleContextMenu}
                                setContextUserid={setContextUserid}
                            />
                            { slotsRed.map((squadItem, squadIndex ) => (
                                <ReglistSquad 
                                    host={host}
                                    setErrorMessage={setErrorMessage}
                                    event={event}
                                    currentRequest={selectedRequest}
                                    reqests={reqests}
                                    team={0}
                                    squad={squadItem}
                                    squadIndex={squadIndex}
                                    slots={slotsRed}
                                    handleLoadChange={handleLoadChange}
                                    handleContextMenu={handleContextMenu}
                                    setContextUserid={setContextUserid}
                                />
                            )) }
                        </div>
                        <div className='event-modal-reglist-slots-container'>
                            { event.type == 'PVP' ? (
                                <ReglistSlot 
                                    host={host}
                                    setErrorMessage={setErrorMessage}
                                    event={event}
                                    currentRequest={selectedRequest}
                                    reqests={reqests}
                                    type={'CMD'}
                                    team={1}
                                    handleLoadChange={handleLoadChange}
                                    handleContextMenu={handleContextMenu}
                                    setContextUserid={setContextUserid}
                                />
                            ) : null}
                            { slotsBlue.map((squadItem, squadIndex ) => (
                                <ReglistSquad 
                                    host={host}
                                    setErrorMessage={setErrorMessage}
                                    event={event}
                                    currentRequest={selectedRequest}
                                    reqests={reqests}
                                    team={1}
                                    squad={squadItem}
                                    squadIndex={squadIndex}
                                    slots={slotsBlue}
                                    handleLoadChange={handleLoadChange}
                                    handleContextMenu={handleContextMenu}
                                    setContextUserid={setContextUserid}
                                />
                            )) }
                        </div>
                    </div>


                    
                </div>
            </div>
        </div>
    );
};

export default ModalRegList;