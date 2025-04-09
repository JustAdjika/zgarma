import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalRegList.css'
import '../../pages/Style/fonts.css'

import ReglistItem from './reglistItem';
import ReglistReport from './reglistReport';
import ReglistSquad from './reglistSquad';
import ReglistSlot from './reglistSlot';

const ModalRegList = ({ host, setIsModalReglist, isModalReglist, setEvent, event, setErrorMessage }) => {
    const [reqests, setRequests] = useState([])
    const [slotsRed, setSlotsRed] = useState([])
    const [slotsBlue, setSlotsBlue] = useState([])

    const [selectedRequest, setSelectedRequest] = useState(null)

    const [reason, setReason] = useState("")
    const [isSlotOccupied, setIsSlotOccupied] = useState(false)

    const getRequests = async () => {
        const res = await axios.post(`${host}/api/developer/event/request/data/id`, {
            key: JSON.parse(Cookies.get("userData")).key,
            id: event.id
        })

        if(res.data.status == 200) {
            setRequests(res.data.container)
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => {setErrorMessage("")}, 3000)
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

        console.log(requestInfo)
        console.log(event)

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

    return (
        <div onClick={ () => { setIsModalReglist(false) } } className='event-modal-reglist-main' style={{ display: isModalReglist ? 'flex' : 'none' }}>
            <div onClick={(e) => { e.stopPropagation()}} className='event-modal-reglist-container'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 className='event-modal-reglist-title' style={{ fontSize: event?.title?.length > 23 ? '23px' : '30px'}}>{event.title}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '650px', height: '100%' }}>
                        <div className='event-modal-reglist-req-main-container'>
                            { reqests.map((requestItem, requestIndex) => ( 
                                <ReglistItem 
                                    requestIndex={requestIndex}
                                    requestItem={requestItem}
                                    setSelectedRequest={setSelectedRequest}
                                    selectedRequest={selectedRequest}
                                    host={host}
                                    setErrorMessage={setErrorMessage}
                                    event={event}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '', width: '275px', height: '100%' }}>
                            <ReglistReport 
                                host={host}
                                currentRequest={reqests[selectedRequest]}
                                setErrorMessage={setErrorMessage}
                            />
                            
                            <div style={{ position: 'relative' }}>
                                <div className='event-modal-reglist-report-button-a-wrapper'
                                    onMouseEnter={ isSlotOccupied ? handleButtonAcceptMouseEnter : null } 
                                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                                >
                                    <button className='event-modal-reglist-report-button-a'
                                        disabled={isSlotOccupied} 
                                        style={ isSlotOccupied ? { 
                                            cursor: 'not-allowed', 
                                            opacity: '0.5' 
                                        } : null} 
                                        onClick={ handleRequestAccept }
                                    >
                                        Одобрить заявку
                                    </button>
                                </div>
                                <div className={`event-modal-reglist-report-button-a-alert ${isOccupiedTooltip ? 'visible' : ''}`}>
                                    Слот уже занят!
                                </div>
                            </div>
                            <button className='event-modal-reglist-report-button-r' onClick={ handleRequestReject }>Отклонить заявку</button>
                            <textarea placeholder='Причина' value={ reason } onChange={(e) => { setReason(e.target.value) }} className='event-modal-reglist-report-reason-input'></textarea>
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
                    <div className='event-modal-reglist-slots-main' style={{ overflowX: 'hidden', overflowY: 'scroll' }}>
                        <div className='event-modal-reglist-slots-container' style={{ marginRight: '30px' }}>
                            <ReglistSlot 
                                host={host}
                                setErrorMessage={setErrorMessage}
                                event={event}
                                currentRequest={selectedRequest}
                                reqests={reqests}
                                type={'CMD'}
                                team={0}
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
                                />
                            )) }
                        </div>
                        <div className='event-modal-reglist-slots-container'>
                            <ReglistSlot 
                                host={host}
                                setErrorMessage={setErrorMessage}
                                event={event}
                                currentRequest={selectedRequest}
                                reqests={reqests}
                                type={'CMD'}
                                team={1}
                            />
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