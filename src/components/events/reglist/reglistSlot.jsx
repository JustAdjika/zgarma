import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReglistSlot = ({ host, setErrorMessage, event, currentRequest, reqests, type, team, squad, slot, handleLoadChange, handleContextMenu }) => {
    const [slotTitle, setSlotTitle] = useState("")
    const [slots, setSlots] = useState([])
    const [style, setStyle] = useState("open")
    const [user, setUser] = useState({})
    const [slotName, setSlotName] = useState('')

    const [MTL, setMTL] = useState(false)
    const [MSL, setMSL] = useState(false)
    const [BTH, setBTH] = useState(false)


    const getUser = async (id) => {
        handleLoadChange(true)
        const res = await axios.get(`${host}/api/developer/account/data/id?id=${id}`)

        if(res.data.status == 200) {
            setUser(res.data.container)

            handleLoadChange(false)
            
            return res.data.container
        } else {
            setErrorMessage(res.data.err)
            setTimeout(() => setErrorMessage(""), 3000)

            handleLoadChange(false)
        }
    }

    const getMarkers = async (playerid) => {
        handleLoadChange(true)
        const res = await axios.get(`${host}/api/developer/event/request/data/accepted/id?id=${event.id}`)

        if(res.data.status == 200) {
            const playerRequestData = res.data.container.filter(item => item.userId === playerid )
            
            if(playerRequestData.length === 0) return handleLoadChange(false)

            if(playerRequestData[0].maybeTL && playerRequestData[0].maybeSL) setBTH(true)
            else if(playerRequestData[0].maybeTL) setMTL(true)
            else if(playerRequestData[0].maybeSL) setMSL(true)
            
            handleLoadChange(false)
        } else {
            setTimeout(() => setErrorMessage(res.data.err), 3000)
            handleLoadChange(false)
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
            if( slots[team][0].player !== null ) {
                setIsKitOccupied(true)
                getUser(slots[team][0].player).then(user => setSlotTitle(user.steam.personaname))
                getMarkers(slots[team][0].player)
                setStyle('close')
            } else {
                setIsKitOccupied(false)
                setSlotTitle("Командир стороны")
                setStyle('open')
            }

            setSlotName(slots[team][0].title)
        }

        if(type == 'SL') {
            if( slots[team][squad].slots[0].player !== null ) {
                setIsKitOccupied(true)
                getUser(slots[team][squad].slots[0].player).then(user => setSlotTitle(user.steam.personaname))
                getMarkers(slots[team][squad].slots[0].player)
                setStyle('close')
            } else {
                setIsKitOccupied(false)
                setSlotTitle(slots[team][squad].slots[0].title)
                setStyle('open')
            }

            setSlotName(slots[team][squad].slots[0].title)
        }

        if(type == 'classic') {
            if( slots[team][squad].slots[slot].player !== null ) {
                setIsKitOccupied(true)
                getUser(slots[team][squad].slots[slot].player).then(user => setSlotTitle(user.steam.personaname))
                getMarkers(slots[team][squad].slots[slot].player)
                setStyle('close')
            } else {
                setIsKitOccupied(false)
                setSlotTitle(slots[team][squad].slots[slot].title)
                setStyle('open')
            }

            setSlotName(slots[team][squad].slots[slot].title)
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



    const [kitTooltip, setKitTooltip] = useState(false)
    const [isKitOccupied, setIsKitOccupied] = useState(false)
    const timerRef = useRef(null)

    const handleButtonAcceptMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setKitTooltip(true)
        }, 300)
    }

    const handleButtonAcceptMouseLeave = () => {
        clearTimeout(timerRef.current);
        setKitTooltip(false);
    }

    return (
        <div style={{ position: 'relative' }} onContextMenu={ handleContextMenu }>
            <div
                onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                onMouseLeave={ handleButtonAcceptMouseLeave } 
            >
                <div className={`reglistSlot-main-container-${style}`} style={{ justifyContent: 'space-between', paddingRight: '10px' }}>
                    <span style={{ overflow: 'hidden' }}>{ slotTitle }</span>
                    <div style={{ display: BTH || MTL || MSL ? 'flex' : 'none', marginLeft: '5px' }} className={`event-modal-eventreg-slot-marker ${ BTH ? 'bth' : MTL ? 'mtl' : MSL ? 'msl' : '' }`}>{ BTH ? 'BTH' : MTL ? 'MTL' : MSL ? 'MSL' : '' }</div>
                </div>
            </div>
            <div className={`event-modal-eventreg-slot-tooltip${ team == 1 ? '2' : '' } ${kitTooltip ? 'visible' : ''}`}>
                { slotName }
            </div>
        </div>
    );
};

export default ReglistSlot;