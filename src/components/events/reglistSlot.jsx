import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReglistSlot = ({ host, setErrorMessage, event, currentRequest, reqests, type, team }) => {
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

        const slots1 = JSON.parse(event.slotsTeam1)
        const slots2 = JSON.parse(event.slotsTeam2)
        
        setSlots([slots1, slots2])
    }, [event])

    useEffect(() => {
        if(slots.length < 1) return

        if(type == 'CMD') {
            if( slots[team][0].player != null ) {
                getUser(slots[team][0].player).then(user => setSlotTitle(JSON.parse(user.steam).personaname))
                setStyle('close')
            } else {
                setSlotTitle("Командир стороны")
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