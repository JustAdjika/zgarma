import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReglistSlot = ({ host, setErrorMessage, event, currentRequest, reqests, type, team, squad, slot }) => {
    const [slotTitle, setSlotTitle] = useState("")
    const [slots, setSlots] = useState([])
    const [style, setStyle] = useState("open")
    const [user, setUser] = useState({})

    const getUser = async (id) => {
        const res = await axios.get(`${host}/api/developer/account/data/id?id=${id}`)

        if(res.data.status == 200) {
            setUser(res.data.container)

            return res.data.container
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => setErrorMessage(""), 3000)
        }
    }

    useEffect(() => {
        if (!event.id) return

        const slots1 = event.slotsTeam1
        const slots2 = event.slotsTeam2
        
        setSlots([slots1, slots2])
    }, [event])

    useEffect(() => {
        if(slots.length < 1) return

        if(type == 'CMD') {
            if( slots[team][0].player != null ) {
                getUser(slots[team][0].player).then(user => setSlotTitle(user.steam.personaname))
                setStyle('close')
            } else {
                setSlotTitle("Командир стороны")
                setStyle('open')
            }
        }

        if(type == 'SL') {
            if( slots[team][squad].slots[0].player != null ) {
                getUser(slots[team][squad].slots[0].player).then(user => setSlotTitle(user.steam.personaname))
                setStyle('close')
            } else {
                setSlotTitle(slots[team][squad].slots[0].title)
                setStyle('open')
            }
        }

        if(type == 'classic') {
            if( slots[team][squad].slots[slot].player != null ) {
                getUser(slots[team][squad].slots[slot].player).then(user => setSlotTitle(user.steam.personaname))
                setStyle('close')
            } else {
                setSlotTitle(slots[team][squad].slots[slot].title)
                setStyle('open')
            }
        }
    }, [slots])

    useEffect(() => {
        if(currentRequest == null) return 

        const teamId = reqests[currentRequest].team == 'Red' ? 0 : 1

        if(type == 'CMD') {
            if(reqests[currentRequest].squad != 0) return
            
            if(teamId == team) {
                setStyle('select')
            } else {
                if(slots[team][0].player != null) setStyle('close')
                else setStyle('open')
            }
        }

        if(type == 'SL') {
            if(reqests[currentRequest].squad != squad ) return
            
            if(teamId == team && reqests[currentRequest].slot == 0) {
                setStyle('select')
            } else {
                if(slots[team][squad].slots[0].player != null) setStyle('close')
                else setStyle('open')
            }
        }

        if(type == 'classic') {
            if(reqests[currentRequest].squad != squad) return
            
            if(teamId == team && reqests[currentRequest].squad == squad && reqests[currentRequest].slot == slot) {
                setStyle('select')
            } else {
                if(slots[team][squad].slots[slot].player != null) setStyle('close')
                else setStyle('open')
            }
        }
    }, [currentRequest])

    return (
        <div className={`reglistSlot-main-container-${style}`}>
            { slotTitle }
        </div>
    );
};

export default ReglistSlot;