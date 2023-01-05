import React, { useEffect, useState, useContext } from 'react'
import { SessionContext } from '../../contexts/Session.ctx'
import './styles.scss'


const CookiesAlert = () =>{
  const { Session } = useContext(SessionContext);
  const user = JSON.parse(localStorage.getItem("USER"));
  const [path, setPath] = useState('');
  const [linkText, setLinkText] = useState('');
  const [visible, setVisible] = useState(false);

  function setCookie(cname, cvalue, exdays) {

    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    setVisible(false);
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false
  }

  async function checkCookie() {
    var coockieName = await getCookie("acceptCookies");
    if (!coockieName && coockieName !== null) {

      const { user } = Session;

      if(user?.network?.level === 'master' || user?.roles[0]?.name === 'ambassador'){
        setPath('/mais/politica-privacidade');
        setLinkText('Política de Privacidade da marca e Termos de Uso da Plataforma');
      }

      if(user?.roles[0]?.name === 'admin' || user?.is_super_admin === 1){
        setPath('/configs/politicas-privacidade');
        setLinkText('Política de Privacidade e Termos de Uso da Plataforma');
      }
      setVisible(true);

    }
  }

  useEffect(()=>{
    if(Session){
      checkCookie();
    }
    //user?.roles[0]?.name === "admin"
  },[Session]);

  return visible ? (
    <div className="cookieAlert">
      <div>
        Utilizamos cookies e tecnologias semelhantes para entender e melhorar sua experiência na nossa plataforma. Ao seguir, você concorda com a <a href={path}>{linkText}</a>.
      </div>
      <div>
        <button type="button" onClick={() => setCookie("acceptCookies", true, 365)}>OK</button>
      </div>
    </div>
  ): null;
}

export { CookiesAlert };
