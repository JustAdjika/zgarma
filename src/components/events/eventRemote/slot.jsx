import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Slot = ({ slotItem, slotIndex, squadIndex, settingsKitsChange, settingConfig, teamIndex, modalRemoteEvent, host }) => {
    const onChange = (e) => {
        const newState = [...settingConfig.slots[teamIndex]]; 
        newState[squadIndex].slots[slotIndex] = { 
            ...newState[squadIndex].slots[slotIndex], 
            title: e.target.value 
        }; 

        settingsKitsChange('slots', teamIndex, newState)
    } 

    const onBlur = () => {
        axios.patch(`${host}/api/developer/event/edit/squad/slots/rename`, { 
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            squadId: squadIndex+1,
            slotId: slotIndex,
            team: teamIndex === 0 ? "Red" : "Blue",
            title: slotItem.title
        })
    }

    const handleDelete = () => {
        axios.delete(`${host}/api/developer/event/edit/squad/slots/delete`, { 
            data: {
                key: JSON.parse(Cookies.get("userData")).key, 
                eventId: modalRemoteEvent.id,  
                squadId: squadIndex+1,
                slotId: slotIndex,
                team: teamIndex === 0 ? "Red" : "Blue",
            }
        })

        let newState = [...settingConfig.slots[teamIndex]]
        let newSquad = newState[squadIndex]

        newSquad.slots = newSquad.slots.filter((_, i) => i != slotIndex)

        newState[squadIndex] = newSquad

        settingsKitsChange('slots', teamIndex, newState)
    }

    return (
        <div className='event-modal-eventremote-kit-container'>
            <input 
                type="text" 
                className='event-modal-eventremote-kit-input' 
                placeholder='Кит' 
                value={slotItem.title}
                onChange={(e) => { onChange(e) }}
                onBlur={ onBlur }
            />
            { slotIndex !== 0 ? <button onClick={ handleDelete } /> : null }
        </div>
    );
};

export default Slot;