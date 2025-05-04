import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import ReglistSlot from './reglistSlot';

const ReglistSquad = ({ host, setErrorMessage, event, currentRequest, reqests, team, squad, squadIndex, slots, handleLoadChange, handleContextMenu }) => {

    return (
        <div className='reglistSquad-main-container'>
            <div style={{ display: 'flex' }} className='reglist-header-container'>
                <h2 className='reglistSquad-title'>{squad.title}</h2>
                <span style={{ display: squad.hq ? 'flex' : 'none' }} className='reglist-cmdbox'>CMD</span>
            </div>

            { slots[squadIndex].slots.map((slotItem, slotIndex) => {
                return (
                <ReglistSlot 
                    host={host}
                    setErrorMessage={setErrorMessage}
                    event={event}
                    currentRequest={currentRequest}
                    reqests={reqests}
                    type={ slotIndex == 0 ? 'SL' : 'classic' }
                    team={team}
                    squad={squadIndex+1}
                    slot={slotIndex}
                    handleLoadChange={handleLoadChange}
                    handleContextMenu={handleContextMenu}
                />)
            }) }
        </div>
    );
};

export default ReglistSquad;