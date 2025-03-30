import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import triangle from '../assets/navTriangle.svg'
import "./Style/layout.css"; 

const Layouts = ({ setUserinfoMenu, userinfoMenu, notices, setNotices }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [discordName, setDiscordName] = useState("Loading...")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [steamName, setSteamName] = useState(null)
    
    const [inDiscord, setInDiscord] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isSteam, setIsSteam] = useState(false)

    const [noticeCount, setNoticeCount] = useState(0)
    const [notice, setNotice] = useState([])

    const pause = true

    const host = "https://api.zgarma.ru"
    const STEAM_AUTH_URL = `https://api.zgarma.ru/api/developer/account/auth/steam`

    const CLIENT_ID = "1342587047600328896";
    const REDIRECT_URI = "https://zgarma.ru/auth/discord/callback";
    const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;

    useEffect(() => {
        if(!Cookies.get("userData")) return console.log('куков нет')

        console.log(Cookies.get("userData"))

        setCurrentUser(JSON.parse(Cookies.get("userData")))
    }, [])

    useEffect(() => {
        if(!currentUser.id) return

        console.log(currentUser.steam)
        setDiscordName(currentUser.discord.username)

        setAvatarUrl(currentUser.discord.avatar 
        ? `https://cdn.discordapp.com/avatars/${currentUser.discord.id}/${currentUser.discord.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${currentUser.discord.discriminator % 5}.png`
        )

        if(!currentUser.steam) return

        setIsSteam(true)
    }, [currentUser])

    useEffect(() => {
        if(!currentUser.id) return

        const getNotices = async () => {
            const res = await axios.post(`${host}/api/developer/account/notices/data/all`, {
                key: currentUser.key
            })

            if(res.data.status == 200) {
                setNotice(res.data.container)
                console.log(res.data.container)
            } else {
                console.error(res.data.err)
            }
        }

        getNotices()
    }, [currentUser])


    useEffect(() => {
        const permsCheck = async () => {
            const res = await axios.get(`${host}/api/developer/adminlist/remote/isAdmin?id=${currentUser.id}`)
            setIsAdmin(res.data.container)
        }

        const discordChannelCheck = async () => {
            const res = await axios.get(`${host}/api/developer/bot/members/data/all`)
            if(res.data.container) {
                res.data.container.forEach(element => {
                    if(currentUser.discord.id == element.id) {
                        setInDiscord(true)
                    }
                })
            }
        }

        if(currentUser.id) {
            if(currentUser.steam) {
                setSteamName(currentUser.steam.personaname)
            }
            permsCheck()
            discordChannelCheck()
        }
        
    }, [currentUser])


    useEffect(() => {
        const healthcheck = async () => { 
            try { 
                const res = await axios.get('https://api.zgarma.ru/healthcheck')
            } catch {
                alert('Сервер отключен. Функционал не доступен!')
            }
        }
        healthcheck()   
    })

    const handleLogout = async () => {
        const res = await axios.get('https://api.zgarma.ru/api/developer/account/logout', { withCredentials: true })

        if(res.data.status == 200) {
            window.location.reload()
        } else {
            console.error(res.data.err)
        }
    }

    const pausecheck = async () => {
        console.log(pause)

        if(pause) {
            console.log(currentUser)

            if(!currentUser) return (<h1>На сайте проходят технические работы. Пожалуйста подождите</h1>)

            const adminCheck = await axios.get(`https://api.zgarma.ru/api/developer/adminlist/remote/isAdmin?id=${currentUser.id}`)

            console.log(adminCheck)

            if(adminCheck.data.status == 200) {
                if(!adminCheck.data.container) {
                    return (
                        <h1>На сайте проходят технические работы. Пожалуйста подождите</h1>
                    ) 
                }
            } else {
                return (
                    <h1>На сайте проходят технические работы. Ошибка определения прав администратора</h1>
                )
            }
        }
    }

    pausecheck()

    return (
        <>
            <header className="main-header" onClick={ (e) => e.stopPropagation() }>
                {/* Название проекта в левом углу */}
                <div style={{ display: 'flex' }}>
                <div className="project-title" style={{ marginRight: '130px' }}>ZG <div style={{ width: '6px', height: '40px', borderRadius: '5px', backgroundColor: 'black' }} /> ARMA 3</div>

                    {/* Навигационное меню */}
                    <nav className="nav-menu" style={{ display: 'flex', alignItems: 'center' }}>
                        <ul className="nav-list" style={{ display: 'flex', alignItems: 'center' }}>
                            <a href="/announcement" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">ГЛАВНАЯ</a>
                            <a href="/rules" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">Правила</a>
                            <a href="/patches" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">Патч ноуты</a>
                            <a href="/events" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">СПИСОК ИГР</a>
                        </ul>
                    </nav>
                </div>

                {/* Блок с аватаркой пользователя */}
                { currentUser.id == null ? <a className="nav-login" href={DISCORD_AUTH_URL}>Войти в аккаунт</a> : 
                    <div className="user-info">
                        <div className="nav-notice-count" onClick={() => { setNotices(true); setUserinfoMenu(false) }} style={{ display: noticeCount ? 'flex' : 'none',cursor: 'pointer' }}>2</div>
                        <svg onClick={() => { setNotices(true); setUserinfoMenu(false) }} style={{ cursor: 'pointer', marginRight: '30px', transition: '0.1s' }} className="icon" width="45" height="45" viewBox="-7 -5 30 30">
                            <path style={{transition: '0.2s'}} d="M8.04492 0C7.40917 0 6.89555 0.530664 6.89555 1.1875V1.9C4.27354 2.44922 2.29806 4.84648 2.29806 7.71875V8.41641C2.29806 10.1605 1.67668 11.8453 0.55604 13.1516L0.290247 13.4596C-0.0114629 13.8084 -0.0832987 14.3094 0.0998826 14.7361C0.283064 15.1629 0.69612 15.4375 1.14869 15.4375H14.9412C15.3937 15.4375 15.8032 15.1629 15.99 14.7361C16.1767 14.3094 16.1013 13.8084 15.7996 13.4596L15.5338 13.1516C14.4132 11.8453 13.7918 10.1643 13.7918 8.41641V7.71875C13.7918 4.84648 11.8163 2.44922 9.19429 1.9V1.1875C9.19429 0.530664 8.68067 0 8.04492 0ZM9.672 18.3061C10.103 17.8607 10.3437 17.2559 10.3437 16.625H8.04492H5.74618C5.74618 17.2559 5.98683 17.8607 6.41784 18.3061C6.84885 18.7514 7.43432 19 8.04492 19C8.65553 19 9.24099 18.7514 9.672 18.3061Z" fill="#28272E"/>
                        </svg>
                        <div style={{ display: isAdmin ? 'flex' : 'none' }} className="nav-userinfo-admin">Administrator</div>
                        <div onClick={ () => { setNotices(false); setUserinfoMenu(true) }  } className="nick-name-user" style={{cursor: 'pointer'}}>{ discordName }</div>
                        <div onClick={ () => { setNotices(false); setUserinfoMenu(true) } } className="user-avatar" style={{ cursor: 'pointer', backgroundColor: '#28272E' }}>
                            <img src={avatarUrl} alt="User Avatar" />
                        </div>
                    </div>
                }
            </header>
            <div style={{ display: userinfoMenu ? 'flex': 'none' }} className="nav-userinfo-container" onClick={ (e) => e.stopPropagation() }>
                <h2>Discord</h2>
                <div className="nav-userinfo-decorative-line"/>
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px', maxWidth: '320px', height: '50px' }}>
                        <span>{ discordName }</span>
                        <span style={{ fontSize: '11pt', color: '#787878' }}>{ currentUser?.discord?.id }</span>
                    </div>
                    <div className="user-avatar" style={{ backgroundColor: '#28272E', marginTop: '5px' }}>
                        <img src={avatarUrl} alt="User Avatar" />
                    </div>
                </div>
                { !inDiscord ? <p>Вступите в наш <a href="https://discord.gg/8Z6hEdW3D8" style={{ color: '#0066DB', margin: '0px', fontSize: '12pt', textDecoration: 'none' }}>Discord сервер!</a></p> : null }
                <h2>Steam</h2>
                <div className="nav-userinfo-decorative-line"/>
                { isSteam ? null : <div style={{ display: 'flex' }}><span style={{ margin: '0px', position: 'relative', left: '30px', color: '#D42A00' }}>*</span><p style={{ marginTop: '5px' }}>Авторизируйте свой Steam аккаунт!<a href={STEAM_AUTH_URL} style={{ color: '#0066DB', margin: '0px', fontSize: '10pt', textDecoration: 'none' }}> Привязать</a></p></div> }                
                { steamName ? 
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px', maxWidth: '320px', height: '50px' }}>
                            <span>{ steamName }</span>
                            <span style={{ fontSize: '11pt', color: '#787878' }}>{ currentUser?.steam?.steamid }</span>
                        </div>
                        <div className="user-avatar" style={{ backgroundColor: '#28272E', marginTop: '5px' }}>
                            <img src={currentUser.steam.avatarfull} alt="User Avatar" />
                        </div>
                    </div>
                : null }
                <button className="nav-userinfo-but-exit" onClick={ handleLogout }>Выйти</button>
            </div>
            <div style={{ display: notices ? 'flex': 'none' }} className="nav-notices-container" onClick={ (e) => e.stopPropagation() }>
                <h2>Уведомления</h2>
                <div>
                    { notice.reverse().map(item => (
                        <div className="nav-notice">
                            <p>
                                { item.content }
                                <p style={{ marginBottom: '0px' }}>{ item.date }</p>
                            </p>
                        </div>
                    )) }
                </div>
            </div>
        </>
    );
};

export default Layouts;
