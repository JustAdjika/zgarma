import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const ReglistReport = ({ host, currentRequest, setErrorMessage }) => {
    const [steamName, setSteamName] = useState("Undefined")
    const [discordName, setDiscordName] = useState("Undefined")
    const [discordid, setDiscordid] = useState("Undefined")
    const [regDate, setRegDate] = useState("Undefined")

    useEffect(() => {
        if(!currentRequest) return
        
        const getUser = async () => {
            const res = await axios.get(`${host}/api/developer/account/data/id?id=${currentRequest.userId}`)
            
            if(res.data.status == 200) {
                setSteamName(JSON.parse(res.data.container.steam).personaname)
                setDiscordName(JSON.parse(res.data.container.discord).username)
                setDiscordid(JSON.parse(res.data.container.discord).id)
                setRegDate(res.data.container.date)
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => { setErrorMessage("") }, 3000)
            }
        }

        getUser()

    }, [currentRequest])

    return (
        <div className='event-modal-reglist-report-container'>
            <h2>Сводка аккаунта</h2>
            <div />
            <h3>Ник Steam</h3>
            <span>{ steamName }</span>
            <h3>Ник Discord</h3>
            <span> { discordName } </span>
            <h3>DiscordID</h3>
            <span>{ discordid }</span>
            <h3>Часы в ARMA</h3>
            <span>-Не реализовано-</span>
            <h3>Дата регистрации</h3>
            <span>{ regDate }</span>
            <h3>Unit</h3>
            <span>-Не реализовано-</span>
        </div>
    );
};

export default ReglistReport;