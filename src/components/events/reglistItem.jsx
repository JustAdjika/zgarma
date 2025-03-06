import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReglistItem = ({ host, requestIndex, selectedRequest, setSelectedRequest, requestItem, setErrorMessage, event }) => {
    const [user, setUser] = useState({})
    const [team, setTeam] = useState("")
    const [squad, setSquad] = useState("")
    const [slot, setSlot] = useState("")

    const [MTL, setMTL] = useState(false)
    const [MSL, setMSL] = useState(false)

    useEffect(() => {
        if(!requestItem.id) return
        if(!event.id) return

        const getUser = async () => {
            const res = await axios.get(`${host}/api/developer/account/data/id?id=${requestItem.userId}`)
            
            if(res.data.status == 200) {
                setUser(JSON.parse(res.data.container.steam))
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => { setErrorMessage("") }, 3000)
            }
        }

        getUser()

        setTeam(requestItem.team == 'Red' ? 0 : 1)

        setMSL(requestItem.maybeSL)
        setMTL(requestItem.maybeTL)

        if( requestItem.squad == 0 ) {
            setSquad("Командир стороны")
            return
        }

        if( requestItem.team == 'Red' ) {
            const slots = JSON.parse(event.slotsTeam1)
            setSquad(slots[requestItem.squad].title)
            setSlot(slots[requestItem.squad].slots[requestItem.slot].title)
        } else {
            const slots = JSON.parse(event.slotsTeam2)
            setSquad(slots[requestItem.squad].title)
            setSlot(slots[requestItem.squad].slots[requestItem.slot].title)
        }
    }, [requestItem])

    return (
        <div onClick={() => { setSelectedRequest(requestIndex) }} className='event-modal-reglist-req-container' style={{ backgroundColor: selectedRequest == requestIndex ? '#222222' : '#363636' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2>{user.personaname}</h2>
                <div className='event-modal-reglist-req-marker' style={{backgroundColor: MTL ? "#FF9F1A" : "#424242" }} />
                <div className='event-modal-reglist-req-marker' style={{backgroundColor: MSL ? "#30762D" : "#424242" }} />
            </div>
            <div style={{ width: '100%', marginBottom: '10px', height: '5px', backgroundColor: '#D9D9D9' }} />
            <span style={{ color: team == 0 ? '#C0392B' : '#0B94E0' }}>{ team == 0 ? 'Красная сторона' : 'Синяя сторона' }</span>
            <span>{squad}</span>
            <span>{slot}</span>
        </div>
    );
};

export default ReglistItem;