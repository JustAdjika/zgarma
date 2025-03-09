import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import ReglistSlot from './reglistSlot';

const ReglistSquad = ({ host, setErrorMessage, event, currentRequest, reqests, team, squad, squadIndex, slots }) => {

    return (
        <div className='reglistSquad-main-container'>
            <h2>{squad.title}</h2>
            
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
                />)
            }) }
        </div>
    );
};

export default ReglistSquad;