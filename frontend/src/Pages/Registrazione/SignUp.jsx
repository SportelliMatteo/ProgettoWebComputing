import React, { useEffect, useState } from 'react'
import './FormSignup.css';
import {Link } from 'react-router-dom';
import Select from 'react-select';
import { address } from '../../assets/globalVar.js';
import { useNavigate } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import {informationCircleOutline} from 'ionicons/icons';

const options = [
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Ristoratore', label: 'Ristoratore' },
]

const signupAddress = `http://${address}:8080/registration`;
const createClienteUrl = `http://${address}:8080/createCliente`;
const createRistoratoreUrl = `http://${address}:8080/createRistoratore`;

export default function Registrazione(props) {

    const [username, setUsername] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipologia, setTipologia] = useState("");

    const [passwordInfoActive, setPasswordInfoActive] = useState(false);

    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [cliente, setCliente] = useState("");
    const [ristoratore, setRistoratore] = useState("");
    const [statusCode, setStatusCode] = useState(200);
    const navigate = useNavigate();

    const [nomeRegistrazione, setNomeRegistrazione] = useState("Nome:");

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const signUpOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': username,
            'nome': nome,
            'email' : email,
            'password': password,
            'tipologia': tipologia,
        }),
    };

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

    const parseResult = (res) => {
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
          .then(res => parseResult(res));
  }

  const createRistoratore = () => {
    setStatusCode(0);

    fetch(createRistoratoreUrl, opzioniRistoratore)
        .then(res => parseResult(res));
  }

    const parseResponse = res => {
        if(res.status === 201) {
          navigate("/login");
          createCliente(); 
        }else if(res.status === 202){
          navigate("/login");  
          createRistoratore();
        }
        else if(res.status === 203){
          navigate("/login");  
        }
        else if(res.status === 409) 
            showError("Questa email esiste già!"); 
        else if(res.status === 403)
            showError("Errore! Perfavore controlla i campi e riprova");
        else {
            console.log("Errore durante la registrazione");
            res.json().then(result => console.log(result));
        }
    }

    function signupConstraints(){
        if( tipologia === "" || username === "" ||nome === "" || email === "" || password === ""){
            showError("Errore! Alcuni campi sono vuoti")
            return false;
        }
        if(!password.match(/^(?=.*\d)(?=.*[@.?#$%^&+=!])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
        {
            showError("Errore! Perfavore controlla i campi e riprova");
            return false;
        }
        return true;
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

    const doSignup = () => {
        if(!signupConstraints())
            return;
    
        fetch(signupAddress, signUpOptions)
            .then(res => parseResponse(res))
    }

    function isCharacterALetter(char) {
        return (/[a-zA-Z]/).test(char)
    }

    function checkEmailConstraints(ev){
        const key = ev.key;
        const total = ev.target.value;

        if(key === " ") {
            ev.preventDefault();
            return;
        }

        if(key === '@'){
            if(total.includes("@")) {
                ev.preventDefault();
                return;
            }
        }

        if(isNaN(key) && !isCharacterALetter(key) && key !== '@' && key !== '.'){
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

    function handleSelect(data){
      setTipologia(data.value);
      if(data.value == "Ristoratore"){
        setNomeRegistrazione("Nome ristorante: ");
      }else{
          setNomeRegistrazione("Nome: ");
      }
    }

    function PasswordInfo(props){
      return(
          <div className={"passwordInfo " + props.class}>
              <div className="requirements" style={{padding:'5px', paddingLeft:'10px', paddingRight:'10px'}}>
                  <div className="pass-requirement">Almeno <span style={{color:'#854D27'}}>1 lettera maiuscola</span> </div>
                  <div className="pass-requirement">Almeno <span style={{color:'#854D27'}}>1 lettera minuscola</span> </div>
                  <div className="pass-requirement">Almeno <span style={{color:'#854D27'}}>1 carattere speciale</span> (@ . ? # $ % ^ & + = !)</div>
                  <div className="pass-requirement">Almeno <span style={{color:'#854D27'}}>8 caratteri</span></div>
                  <div className="pass-requirement">Al massimo <span style={{color:'#854D27'}}>40 caratteri</span></div>
              </div>
          </div>
      )
  } 

 
  return (
    <div class="registrazione">
      <div class="column-1 box1">
        <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Registrati</h3>
            <div className="text-center">
              Sei già registrato?{" "}
              <span className="link-primary">
              <Link to="/login">
                  Accedi
                </Link>
              </span>
            </div>

            <label className="tipologiaUtente">Tipologia utente: </label>
            <Select id="tipologiaUtenteSelect" options={options} placeholder="Seleziona tipologia..."
              onChange={handleSelect} isSearchable={true}
            ></Select>

            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="mariorossi"
                onKeyPress={(ev) => checkUsernameConstraints(ev)} onChange={(ev) => {setUsername(ev.target.value); setCliente(ev.target.value); setRistoratore(ev.target.value)}}
                onPaste={(ev) => ev.preventDefault()}
              />
            </div>
            <div className="form-group mt-3">
              <label>{nomeRegistrazione}</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Mario Rossi"
                onChange={(ev) => setNome(ev.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Email"
                onKeyPress={(ev) => checkEmailConstraints(ev)} onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <div className='passwordBox'>
                  <label>Password</label>
                  <IonIcon icon={informationCircleOutline} className="informationIcon"
                    onClick={() => setPasswordInfoActive(!passwordInfoActive)}/> 
                    {
                        passwordInfoActive && (
                            <PasswordInfo class={passwordInfoActive ? "active-info" : ""}/>
                        )
                    }   
              </div>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                onChange={(ev) => setPassword(ev.target.value)} onPaste={(ev) => ev.preventDefault()}
              />
              
            </div>

            {errorLabelActive === true && (
                <div className={getErrorLabelClassname()}>
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="d-grid gap-2 mt-3">
              <div className="btn btn-primary"  style={{backgroundColor: "#854D27", border:"none"}} onClick={doSignup}>
                REGISTRATI
              </div>

            </div>
            <p className="text-center mt-2">
              Password <Link to="/passwordDimenticata">dimenticata?</Link>
            </p>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}