import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const DiscordCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios.get(`http://localhost:3000/api/developer/account/data/discord?code=${code}`)
        .then((response) => {
            console.log(response.data.container)
            Cookies.set('userData', JSON.stringify(response.data.container), { expires: 60 })
            navigate("/announcement"); // Перенаправление после входа
        })
        .catch((err) => console.error("Ошибка авторизации", err));
    }
  }, [navigate]);

  return <p>Авторизация...</p>;
};

export default DiscordCallback;