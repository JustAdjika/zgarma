import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const DiscordCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const host = "https://api.zgarma.ru"

    if (code) {
      axios.get(`${host}/api/developer/account/data/discord?code=${code}`, { withCredentials: true })
        .then((response) => {
          // let tempUserData = response.data.container

          // tempUserData.steam = JSON.parse(tempUserData.steam)
          // Cookies.set('userData', JSON.stringify(tempUserData), { expires: 60 })

          navigate('/announcement')
          window.location.reload(); // Перенаправление после входа
        })
        .catch((err) => console.error("Ошибка авторизации", err));
    }
  }, [navigate]);

  return <></>;
};

export default DiscordCallback;