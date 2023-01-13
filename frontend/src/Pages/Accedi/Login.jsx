import React, { useEffect, useState } from 'react'
import './FormLogin.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {Link} from 'react-router-dom';
import Select from 'react-select';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';

import { address } from '../../assets/globalVar'
import { useNavigate } from "react-router-dom";
import ChooseData from './ChooseData';

const options = [
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Ristoratore', label: 'Ristoratore' },
]

const loginLink = `http://${address}:8080/login`;
const loginGoogleLink = `http://${address}:8080/loginGoogle`;
const createClienteUrl = `http://${address}:8080/createCliente`;
const createRistoratoreUrl = `http://${address}:8080/createRistoratore`;

export default function Login(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const [errorLabelActive, setErrorLabelActive] = useState(false);

  const [username, setUsername] = useState("");
  const [tipologia, setTipologia] = useState("");
  const [password, setPassword] = useState("");

  const [googleUsername, setGoogleUsername] = useState("");
  const [nomeGoogle, setNomeGoogle] = useState(""); 
  const [tipologiaGoogle, setTipologiaGoogle] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [email, setEmail] = useState(""); // per login Google
  const [chooseUsernameDivActive, setChooseUsernameDivActive] = useState(false);


  const [cliente, setCliente] = useState("");
  const [ristoratore, setRistoratore] = useState("");
  const [statusCode, setStatusCode] = useState(200);

      
    const navigate = useNavigate();

    const loginOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'tipologia': tipologia,  
          'username': username,
          'password': password,
        }),
    };

    const loginGoogleOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': email,
            'google_id': googleId
        }),
    };

    const completeLoginGoogle = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': googleUsername,
            'nome' : nomeGoogle,
            'tipologia': tipologiaGoogle,
            'email': email,
            'google_id': googleId
        }),
    };

    function parseResult(res) {
        if(res.status === 201) {
          res.json().then((result) => props.setAccessToken(result['key']));
          createCliente();
          navigate("/");
          
        }else if(res.status === 202){
          res.json().then((result) => props.setAccessToken(result['key']));
          createRistoratore();
          navigate("/");
          
        }else if(res.status === 401) {
            showError("Errore! Combinazione di username/password invalida");
        }else if(res.status === 410) {
          showError("Errore! Questo username già esiste");
        } else {
            res.json().then((result) => {
                showError("Errore, perfavore controlla i campi vuoti e riprova!");
            })
        }
    }

    function checkConstraints(){
        if(username === "" || password === ""){
            showError("Errore, ci sono campi vuoti! Perfavore riprova");
            return false;
        }
        return true;
    }

    const doLogin = () => {
        if(!checkConstraints())
            return;
        fetch(loginLink, loginOptions)
          .then((res) => parseResult(res));
    }

    function isCharacterALetter(char) {
        return (/[a-zA-Z]/).test(char)
    }

    function checkUsernameConstraints(ev){
      const key = ev.key;

      if(key === " ") {
          ev.preventDefault();
          return;
      }
      if(key === "."){
          ev.preventDefault();
          return;
      }
      if(isNaN(key) && !isCharacterALetter(key)){
          ev.preventDefault();
          return;
      }
  }

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg) => {
        setErrorLabelActive(true);
        setErrorMessage(msg);
        setTimeout(() => {setErrorLabelActive(false); setErrorMessage("")}, 3500);
    }


    useEffect(() => {
        if (email !== "") 
            doFirstGoogleLogin();
    }, [email])

    const handleLogin = (googleData) => {
        setGoogleId(googleData.getBasicProfile().getId());
        setEmail(googleData.getBasicProfile().getEmail());
    }

    const handleFailureLogin = (googleData) => {
        console.log("no ");
    }

    const parseGoogleResult = res => {
      if(res.status === 201) {
        res.json().then((result) => props.setAccessToken(result['key']));
        console.log("Login cliente effettuato con successo!");
        navigate("/");
        return;
      }else if(res.status === 202){
        res.json().then((result) => props.setAccessToken(result['key']));
        console.log("Login ristoratore effettuato con successo!");
        navigate("/");
        return;
      }else if(res.status === 450) {
          setChooseUsernameDivActive(true);
          return;
      }else if(res.status === 409) {
          showError("Errore! Questa email è già registrata con un account non google!");
      }
      setEmail("");
    }


    const opzioniCliente = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body : JSON.stringify({
          'username': cliente,
  
      }),
    };

    const opzioniRistoratore = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body : JSON.stringify({
          'username': ristoratore,
      }),
    };

    const parseResultUtente = (res) => {
      if(res.status === 200) {
          console.log("Profilo creato con successo!");
      }
      else if(res.status === 5050) {
          console.log("Errore");
      }
  
      setStatusCode(res.status);
  }   

    const createCliente = () => {
      setStatusCode(0);
  
      fetch(createClienteUrl, opzioniCliente)
          .then(res => parseResultUtente(res));
  }

  const createRistoratore = () => {
    setStatusCode(0);

    fetch(createRistoratoreUrl, opzioniRistoratore)
        .then(res => parseResultUtente(res));
  }


    const confirmAccountCreation = () => {
        setChooseUsernameDivActive(false);
        fetch(loginGoogleLink, completeLoginGoogle)
            .then(res => parseResult(res));
    }

    const doFirstGoogleLogin = () => {
        fetch(loginGoogleLink, loginGoogleOptions)
          .then((res) => parseGoogleResult(res));
    }

    function handleSelect(data){
      setTipologia(data.value);
    }


    useEffect(() => {
      const initClient = () => {
          gapi.auth2.init({
          clientId: "645431466583-6u5gb3g4g1lg0ru983nmcrrd42bgidim.apps.googleusercontent.com",
          scope: ''
        });
       };
       gapi.load('client:auth2', initClient);
   });
   
  return (
    <div class="accedi">
        <div class="column-1 box1">
        <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Accedi</h3>
            <div className="text-center">
              Non sei registrato?{" "}
              <span className="link-primary">
                <Link to="/signup" style={{textDecoration:"none"}}>
                  Registrati
                </Link>
              </span>
            </div>
            
            <label className="tipologiaUtente">Tipologia utente: </label>
            <Select options={options} placeholder="Tipologia utente..." onChange={handleSelect} isSearchable={true}/>
            
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="mariorossi"
                onKeyPress={(ev) => checkUsernameConstraints(ev)} onChange={(ev) => setUsername(ev.target.value)}
                onPaste={(ev) => ev.preventDefault()}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <div type="submit" className="button"  style={{backgroundColor: "#854D27", border:"none"}} onClick={doLogin}>
                ACCEDI
              </div>
              <GoogleLogin className='buttonGoogle'
                  clientId="645431466583-6u5gb3g4g1lg0ru983nmcrrd42bgidim.apps.googleusercontent.com"
                  buttonText="ACCEDI CON GOOGLE"
                  onSuccess={handleLogin}
                  onFailure={handleFailureLogin}
                  cookiePolicy={'single_host_origin'}
              />
              {(errorLabelActive === true && <div className={getErrorLabelClassname()}>
                  <p>{errorMessage}</p> 
              </div>)}
    
            </div>
            <div className='PwdAmm'>
              <p className="text-center mt-2">
                Password <Link to="/passwordDimenticata" style={{textDecoration:"none"}}>dimenticata?</Link>
              </p>
              <p className="text-center mt-2">
                Sei un <a href="http://localhost:8080/admin/login" style={{textDecoration:"none"}}>amministratore? </a>
              </p>
            </div>
            {chooseUsernameDivActive && (
            <ChooseData 
              setGoogleUsername={setGoogleUsername}
              setNomeGoogle = {setNomeGoogle}
              setTipologiaGoogle = {setTipologiaGoogle}
              setCliente={setCliente}
              setRistoratore={setRistoratore}
              onConfirm={confirmAccountCreation} 
              onCancel={() => {setGoogleUsername(""); setEmail(""); setNomeGoogle(""); setTipologiaGoogle(""); setChooseUsernameDivActive(false)}}/>
          )}
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}