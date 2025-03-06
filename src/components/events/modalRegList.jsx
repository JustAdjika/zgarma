import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalRegList.css'
import '../../pages/Style/fonts.css'

import ReglistItem from './reglistItem';
import ReglistReport from './reglistReport';

const ModalRegList = ({ host, setIsModalReglist, isModalReglist, setEvent, event, setErrorMessage }) => {
    const [reqests, setRequests] = useState([])

    const [selectedRequest, setSelectedRequest] = useState(null)

    const [reason, setReason] = useState("")

    const getRequests = async () => {
        const res = await axios.post(`${host}/api/developer/event/request/data/all`, {
            key: JSON.parse(Cookies.get("userData")).key
        })

        if(res.data.status == 200) {
            setRequests(res.data.container)
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => {setErrorMessage("")}, 3000)
        }
    }

    useEffect(() => {
        getRequests()
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
                slotTitle = JSON.parse(event.slotsTeam1)[thisRequest.squad].slots[thisRequest.slot].title
            } else {
                slotTitle = JSON.parse(event.slotsTeam2)[thisRequest.squad].slots[thisRequest.slot].title
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

    return (
        <div onClick={ () => { setIsModalReglist(false) } } className='event-modal-reglist-main' style={{ display: isModalReglist ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-reglist-container'>
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
                            
                            <button className='event-modal-reglist-report-button-a' onClick={ handleRequestAccept }>Одобрить заявку</button>
                            <button className='event-modal-reglist-report-button-r' onClick={ handleRequestReject }>Отклонить заявку</button>
                            <textarea placeholder='Причина' value={ reason } onChange={(e) => { setReason(e.target.value) }} className='event-modal-reglist-report-reason-input'></textarea>
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