import React ,  { useRef, useEffect, useState } from "react";
import './Restaurant.css'
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {IonIcon} from '@ionic/react';
import {heart, heartOutline, navigate} from 'ionicons/icons';
import CardRecensioni from '../../Components/CardRecensioni/CardRecensioni'; 
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Select from 'react-select';
import { useLocation} from "react-router-dom";
import { address } from '../../assets/globalVar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TextArea } from "semantic-ui-react";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useNavigate } from "react-router-dom";
import scaleImage from '../ProfiloRistoratore/ImageConverter.js';
import { Typography } from "@mui/material";
import Rating from '@mui/material/Rating';

//Owl Carousel Settings
const options = {
  margin: 30,
  responsiveClass: true,
  nav: true,
  autoplay: false,
  smartSpeed: 1000,
  responsive: {
      0: {
          items: 1,
      },
      200: {
          items: 1,
      },
      600:{
          items: 1,
      },
      700: {
          items: 2,
      },
      1080: {
          items: 1,
      },
      1500:{
        items: 2,
      },
      1920: {
        items: 2,
    }
  },
};

const starRecensione = [
  { value: '1', label: '1 stella' },
  { value: '2', label: '2 stelle' },
  { value: '3', label: '3 stelle' },
  { value: '4', label: '4 stelle' },
  { value: '5', label: '5 stelle' },
]

const orari = [
  { value: '11:30-12:30', label: '11:30-12:30' },
  { value: '12:30-13:30', label: '12:30-13:30' },
  { value: '13:30-14:30', label: '13:30-14:30' },
  { value: '18:30-19:30', label: '18:30-19:30' },
  { value: '19:30-20:30', label: '19:30-20:30' },
  { value: '20:30-21:30', label: '20:30-21:30' },
]

const getRistoratoreUrl = `http://${address}:8080/getRistoranteFromUsername`;
const createNewPrenotazioneUrl = `http://${address}:8080/insertPrenotazione`;
const createPreferitoUrl = `http://${address}:8080/createPreferito`;
const deletePreferitoUrl = `http://${address}:8080/eliminaPreferito`;
//const isPreferitoUrl = `http://${address}:8080/isPreferito`;
const sendRecensioneUrl = `http://${address}:8080/createRecensione`;
const getRecensioniUrl = `http://${address}:8080/getRecensioni`;
const getPreferitoUrl = `http://${address}:8080/getPreferito`;

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGVvc3BvcnRlbGxpIiwiYSI6ImNsYXYzMmJqbDAxdXQzcm1wZjBkbW53ZHcifQ.4xFih1yVT6FkB5q3f-cJKQ';

const Strumenti = (props) => {


  useEffect(() => { 
    props.getRecensioni()
  }, []);

 
  const getProfilePic = (im) => {
    if(im === null)
        return null
    else
        return "data:image/png;base64," + im;
  }
  
  return(
    <div className="strumenti">
    <button className="buttonMenu" onClick={props.apriMenu}> Apri menù </button>
    <label className="intolleranzeLabel"> Intolleranze: </label>
    <p style={{marginTop:"10px"}}> {props.ristorante.intolleranze}</p>
    <div className="cardRecensioni">
    <label style={{color:"black"}}> Recensioni </label>
      <div className='item-container'>
        {props.recensioni.length != 0 && (
      <OwlCarousel className="owl-theme" {...options}
        items={3}      
        nav  
        margin={-120}> 
        {props.recensioni.map((recensione) => (
          
          <CardRecensioni testo={recensione.recensione} userLogged={props.userLogged.username} ristoratore={props.usernameRistoratore} 
                          voto={recensione.voto} immagine={getProfilePic(recensione.immagine)} utente={recensione.utente} ristorante={recensione.ristorante} 
                          accessToken={props.accessToken} getRecensioni={props.getRecensioni}/>
          ))}
          
      </OwlCarousel>
      )}
      </div>
    </div>
  </div>
  );
}

const Preferito = (props) =>{

  return(
    <div class="column-2 box2">
              {props.isPreferito === false &&
                (<button className="heartButton" onClick={props.createPreferito}> <IonIcon id="cuore" className="heart1" icon={heartOutline}> </IonIcon> </button>)
              }
              {props.isPreferito === true &&
                (<button className="heartButton" onClick={props.deletePreferito}> <IonIcon id="cuorePieno" className="heart2" icon={heart}> </IonIcon> </button>)
              }
          
            <p className="titleRestaurant"> <b> {props.ristorante.nome} </b></p>
            <p className="descriptionRestaurantTitle"> <b> <i> Chi siamo? </i> </b> </p>
            <p className="descriptionRestaurant"> {props.ristorante.descrizione} </p>
            <div className="contatti">
              <p> <b>CONTATTI: </b></p>
                <div className="contatti2">
                  <p className="telefono" id="telefono">Telefono: {props.ristorante.numero}</p>
                  <p className="indirizzo" id="indirizzo"> Indirizzo: {props.ristorante.indirizzo}</p>
                    {props.ristorante.indirizzo !== "" &&
                     <div className='map-container' ref={props.mapContainerRef} /> }
                </div>
            </div>
          </div>
  );
}

const Restaurant = (props) => {

    const [startDate, setStartDate] = useState(new Date());
    const [confermaPrenotazioneEditable, setPrenotazioneEditable] = useState(false);
    const [ristorante, setRistorante] = useState({});
    const [tipoligiaTavolo, setTipologiaTavolo] = useState(false);
    const [orario, setOrario] = useState(false);
    const [data, setData] = useState(false);
    const [nomeRistorante, setNomeRistorante] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [formErrorLabelActive, setFormErrorLabelActive] = useState(false);
    const [popupErrorLabelActive, setPopupErrorLabelActive] = useState(false);
    const [formConfirmLabelActive, setFormConfirmLabelActive] = useState(false);
    const [popupConfirmLabelActive, setPopupConfirmLabelActive] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");

    const [image, setImage] = useState(null);
    const [dropdownImageActive, setDropdownImageActive] = useState(false);
    const inputImage = useRef(null);
    const [testoRecensione,setTestoRecensione]= useState("");
    const [voto,setVoto]=useState(0);

    const [recensioni, setRecensioni] = useState([]);

    const [preferito, setPreferito] = useState({});

    const getErrorLabelClassname = () => {
        if(formErrorLabelActive || popupErrorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg, label) => {
        if(label === "form") {
            setFormErrorLabelActive(true);
            setErrorMessage(msg);
            setTimeout(() => {setFormErrorLabelActive(false); setErrorMessage("")}, 3500);
        }
        else if(label === "popup") {
            setPopupErrorLabelActive(true);
            setErrorMessage(msg);
            setTimeout(() => {setPopupErrorLabelActive(false); setErrorMessage("")}, 3500);
        } 
    }

    const getConfirmLabelClassname = () => {
        if(formConfirmLabelActive || popupConfirmLabelActive)
            return "confirm-label label-active";
        else
            return "confirm-label";
    }

    const showConfirm = (msg, label) => {
        if(label === "form") {
            setFormConfirmLabelActive(true);
            setConfirmMessage(msg);
            setTimeout(() => {setFormConfirmLabelActive(false); setConfirmMessage("")}, 3500);
        }
        else if(label === "popup") {
            setPopupConfirmLabelActive(true);
            setConfirmMessage(msg);
            setTimeout(() => {setPopupConfirmLabelActive(false); setConfirmMessage("")}, 3500);
        } 
    }

    function riepilogoPrenotazione(tip){
      setData(document.getElementById("dataPicker").value);
      setOrario(document.getElementById("orarioSelect").textContent);
      setTipologiaTavolo(tip);
      setNomeRistorante(ristorante.nome);
    }

    const mapContainerRef = useRef(null);
    const [zoom, setZoom] = useState(14.2);

    const location = useLocation();
    const usernameRistoratore = location.state[0];
    const nomeRistoranteRecensione = location.state[1];

    const abilitaPrenotazioneDa2 = () => {
      if(ristorante.tavolo2 > 0){
        setPrenotazioneEditable(true);
        disabledScroll();
      }else{
        showError("Disponibilità terminata!", 'form');
      }
    }
    const abilitaPrenotazioneDa5 = () => {
      if(ristorante.tavolo5 > 0){
        setPrenotazioneEditable(true);
        disabledScroll(); 
      }else{
        showError("Disponibilità terminata!", 'form');
      }
    }
    const abilitaPrenotazioneDa10 = () => {
      if(ristorante.tavolo10 > 0){
        setPrenotazioneEditable(true);
        disabledScroll();
      }
      else{
        showError("Disponibilità terminata!", 'form');
      }
    }

    const disabilitaPrenotazione = () => {
      setPrenotazioneEditable(false);
    }

  const parseResponseRistoratore = res => {
    if(res.status === 200) {
      res.json().then(result => {
      let map;

    if(result['ristoratore'].indirizzo !== ""){

        const indirizzo = result['ristoratore'].indirizzo.split(";")[0].split(" ");
        const via = result['ristoratore'].indirizzo.split(";")[1];
        
        map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/matteosportelli/clav4qklj005m14nkhjdwekur',
          center: [indirizzo[1], indirizzo[0]],
          zoom: zoom
        });
  
        const marker = new mapboxgl.Marker().setLngLat([indirizzo[1], indirizzo[0]]).addTo(map);
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        result['ristoratore'].indirizzo = via;
      }
        setRistorante(result['ristoratore']);
        
        if(result['ristoratore'].indirizzo !== undefined){
          return () => map.remove();
        }
      });
    }
    else {
        console.log("Errore durante caricamento dati ristoratore");
            res.json().then(result => console.log(result));
    }
  }

  const opzioniRistoratore = {
      method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': usernameRistoratore
        }
    };

  useEffect(() => {
    fetch(getRistoratoreUrl, opzioniRistoratore)
      .then(res => parseResponseRistoratore(res));

    getPreferito();

  }, [props.userLogged]);  

  function apriMenu(){
    window.open(ristorante.linkMenu)
  }

  function disabledScroll(){
    disableBodyScroll(document);
  }

  //Crea preferito
  const createPreferitoOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : props.accessToken
    },

    body: JSON.stringify({
        'usernameRistoratore' : ristorante.usernameRistoratore,
        'nome' : ristorante.nome,
        'copertina' : ristorante.copertina,
    })
  }

  const navigate = useNavigate();
  const [isPreferito, setIsPreferito] = useState(false);

  const createPreferito = () => {
    if(props.accessToken != null){
      fetch(createPreferitoUrl, createPreferitoOptions)
        .then(res => {
            if(res.status === 200) {
                console.log("Preferito aggiunto con successo!", 'popup');
                setIsPreferito(true);
            }
            if(res.status === 500)
                console.log("Errore server! Per favore riprova più tardi", 'popup');;
        });
    }else{
      navigate("/login");
    }
  }

    //Elimina preferito
    const deletePreferitoOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization' : props.accessToken
      },

      body: JSON.stringify({
          'usernameRistoratore' : ristorante.usernameRistoratore,
          'nome' : ristorante.nome,
      })
    }

    const deletePreferito = () => {
      if(props.userLogged.username != null){
        setIsPreferito([]);
        fetch(deletePreferitoUrl, deletePreferitoOptions)
          .then(res => {
              if(res.status === 200) {
                  console.log("Preferito eliminato con successo!", 'popup');
                  setIsPreferito(false);
              }
              if(res.status === 500)
                  console.log("Errore server! Per favore riprova più tardi", 'popup');;
          });
      }else{
        navigate("/login");
      }
    }

     /*//Is preferito
     const isPreferitoOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization' : props.accessToken
      },

      body: JSON.stringify({
          'usernameRistoratore' : ristorante.usernameRistoratore,
      })
    }*/

    //Get preferiti
    const getPreferitoOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : props.accessToken
        },
        body: JSON.stringify({
          'nomeRistorante' : nomeRistoranteRecensione,
      })
    }

    const getPreferito = () => {
      fetch(getPreferitoUrl, getPreferitoOptions)
      .then((res) => {
        if(res.status === 200) {
          setIsPreferito(true);
        }
      });
  }


    //RECENSIONI
    const handleOnChange = (e) => {  
      if(e.target.files && e.target.files[0]) {
          convertToBase64(e.target.files[0]);
      }
      setDropdownImageActive(false);
    }

    const convertToBase64 = (file) => { 
      scaleImage(file, setImage, () => props.showError("Impossibile caricare l'immagine, per favore riprova!", "form"));
    }

    const insertRecensioneoptions = { 
      method : 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization':props.accessToken
      },
      body: JSON.stringify({
        'ristorante': nomeRistoranteRecensione,
        'recensione' : testoRecensione,
        'voto': voto.toString(),
        'immagine' : image,
        'usernameRistoratore' : ristorante.usernameRistoratore
    }),
    }


  const getRecensionioptions = { 
      method : 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'usernameRistorante': usernameRistoratore
    }),
  }
  
  const getRecensioni = () => {
    fetch(getRecensioniUrl, getRecensionioptions)
      .then((res) => {
        if(res.status === 200) {
          res.json().then(result => setRecensioni(result));
        }
      });
  }


    const aggiungiRecensione = () => {
      fetch(sendRecensioneUrl, insertRecensioneoptions)
        .then(res => {
          if(res.status === 200) {
              setTestoRecensione("");
              setVoto(0);
              setImage("");
              showConfirm("La recensione è stata correttamente pubblicata");
              getRecensioni()
          }
          else
            showError("Qualcosa è andato storto nella pubblicazione della recensione, ricontrolla i campi inseriti");
        });
    }

    const getCopertinaPic = () => {
      if(ristorante.copertina === null || ristorante.copertina === undefined || ristorante.copertina === "")
          return require("../../Images/nessunImmagine.png");
      else
          return "data:image/jpg;base64," + ristorante.copertina;
    }


    
  return (
    
    <div className="containerRestaurant">
        <div class="infoRestaurant">
          <div class="column-1 boxInfoRestaurant">
            <img src={getCopertinaPic()} className="image" alt="imageRestaurant"></img>
          </div>
          
          <Preferito 
            ristorante={ristorante}
            mapContainerRef = {mapContainerRef}
            createPreferito = {createPreferito}
            deletePreferito = {deletePreferito}
            isPreferito = {isPreferito}
          />

          <div class="column-2 box2">
            <p className="titleRestaurant"> <b>Strumenti </b></p>

            <Strumenti 
              nomeRistoranteRecensione = {nomeRistoranteRecensione}
              usernameRistorante = {usernameRistoratore}
              apriMenu = {apriMenu}
              ristorante = {ristorante}
              ristoratore = {props.ristoratore}
              userLogged = {props.userLogged}
              recensioni = {recensioni}
              getRecensioni = {getRecensioni}
              accessToken={props.accessToken}
            />
          </div>
      </div>
         
        <div className="body">
          <div className="calendario"> 
            <h2 className="prenota"> Prenota il tuo tavolo: </h2>
            <div className="dataOra">
              <DatePicker id="dataPicker" className="dataPicker" selected={startDate} onChange={(date=Date) => setStartDate(date)} />
              <Select id="orarioSelect" options={orari} className="orario"  placeholder="Orario...">  </Select>
            </div>
          </div>
            
        <div className='card'>
          <Card sx={{ maxWidth: "100%" }} className="singleCard" style={{backgroundColor:"#272B30", borderRadius:"20px"}}>
              <CardContent className="cardContent">
                <div className="titoloTavolo">
                <p> Tavolo per 2 persone </p>
                <p> Disponibilità: {ristorante.tavolo2}</p>
                </div>
                <button type="submit" className="buttonPrenota"  style={{backgroundColor: "#854D27", border:"none", color:"white", borderRadius:"5px", marginTop:"-10px"}} onClick={()=>{abilitaPrenotazioneDa2(); riepilogoPrenotazione("2 persone");}}>
                  PRENOTA
                </button>
              </CardContent>

          </Card>
          <Card sx={{ maxWidth: "100%" }}  className="singleCard" style={{backgroundColor:"#272B30", borderRadius:"20px"}}>
              <CardContent className="cardContent">
                <div className="titoloTavolo">
                <p> Tavolo per 5 persone </p>
                <p> Disponibilità: {ristorante.tavolo5} </p>
                </div>
                <button type="submit" className="buttonPrenota" style={{backgroundColor: "#854D27", border:"none", color:"white", borderRadius:"5px", marginTop:"-10px"}} onClick={()=>{abilitaPrenotazioneDa5(); riepilogoPrenotazione("5 persone");}}>
                  PRENOTA
                </button>
              </CardContent>

          </Card>
          <Card sx={{ maxWidth: "100%" }} className="singleCard" style={{backgroundColor:"#272B30", borderRadius:"20px"}} >
              <CardContent className="cardContent">
                <div className="titoloTavolo">
                <p> Tavolo per 10 persone </p>
                 <p> Disponibilità: {ristorante.tavolo10} </p>
                </div>
                <button type="submit" className="buttonPrenota"  style={{backgroundColor: "#854D27", border:"none", color:"white", borderRadius:"5px", marginTop:"-10px"}} onClick={()=>{abilitaPrenotazioneDa10(); riepilogoPrenotazione("10 persone");}}>
                  PRENOTA
                </button>
              </CardContent>
          </Card>  
          
          <div className="erroreDisponibilita">
            {formErrorLabelActive === true && (
                <div className={getErrorLabelClassname()}>
                    <p>{errorMessage}</p>
                </div>
            )}
          </div>
      </div>        
        </div>

        {confermaPrenotazioneEditable === true &&
            <PrenotazionePopup 
              abilitaPrenotazioneDa2={abilitaPrenotazioneDa2}
              abilitaPrenotazioneDa5={abilitaPrenotazioneDa5}
              abilitaPrenotazioneDa10={abilitaPrenotazioneDa10}
              disabilitaPrenotazione={disabilitaPrenotazione} 
              usernameCliente={props.userLogged.username}
              usernameRistorante={ristorante.usernameRistoratore}
              data={data}
              orario={orario}
              tipoligiaTavolo={tipoligiaTavolo}
              nomeRistorante = {nomeRistorante}
              userLogged = {props.userLogged}
              showResultPopup={props.showResultPopup}

              formErrorLabelActive = {formErrorLabelActive}
              popupErrorLabelActive = {popupErrorLabelActive}
              getErrorLabelClassname = {getErrorLabelClassname}
              showError = {showError}
              errorMessage = {errorMessage}

              formConfirmLabelActive = {formConfirmLabelActive}
              popupConfirmLabelActive = {popupConfirmLabelActive}
              getConfirmLabelClassname = {getConfirmLabelClassname}
              showConfirm = {showConfirm}
              confirmMessage = {confirmMessage}
            />
        }
          {props.ristoratore.usernameRistoratore !== props.userLogged.username && (
          <div className="recensioniContainer">
            
            <label className="recensioni"> Aggiugi una recensione </label>
              <div className="contactForm">
                  <div className="messaggio">
                      <div className="textArea">
                      <Typography component="legend"></Typography>
                          <Rating
                            name="size-large"
                            value={voto}
                            size="large"
                            onChange={(newValue)=>{
                              setVoto(newValue.target.value);
                            }
                          }
                          />
                          <textarea className="corpoRecensione" onChange={(e) => setTestoRecensione(e.target.value)} placeholder="Scrivi la tua recensione qui..."></textarea>
                          <br></br>
                          <input type="file" ref={inputImage} accept=".jpg, .png, .jpeg" style={{backgroundColor: "#854D27", border:"none", width:"400px",borderRadius:"5px"  }} onChange={(e) => handleOnChange(e)} />
                      </div>
                  </div>
                  
                  {formErrorLabelActive === true && (
                  <div className={getErrorLabelClassname()}>
                      <p style={{backgroundColor: "#C41E3A",borderRadius:"5px",width:"400px"}}>{errorMessage}</p>
                  </div>
              )}
              {formConfirmLabelActive === true && (
                  <div className={getConfirmLabelClassname()}>
                      <p style={{backgroundColor: "#008000",borderRadius:"5px",width:"400px"}}>{confirmMessage}</p>
                  </div>
              )}
                  <div className="invioMessaggio">
                      <button className="inviaRecensione" onClick={aggiungiRecensione} type="submit" style={{backgroundColor: "#854D27", border:"none", width:"200px"}}>Invia</button>
                  </div>    
              </div>
          </div>
          )}
      </div>

  )
}

export default Restaurant;


const PrenotazionePopup = (props) => {

  const [noteInputField, setNoteInputField] = useState("");
  const [abilitaConferma, setAbilitaConferma] = useState(false);

  const navigate = useNavigate();

  const prenotazioneOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        'usernameRistorante': props.usernameRistorante,
        'usernameCliente' : props.usernameCliente,
        'data' : props.data,
        'orario' : props.orario,
        'note' : noteInputField ,
        'tipologiaTavolo' : props.tipoligiaTavolo,
        'nomeRistorante' : props.nomeRistorante,
    })
}

function enabledScroll(){
  enableBodyScroll(document)
}

const createNewPrenotazione = () => {
  if(props.usernameCliente != null){
    fetch(createNewPrenotazioneUrl, prenotazioneOptions)
      .then(res => {
          if(res.status === 200) {
              props.showConfirm("Prenotazione effettuata con successo!", 'popup');
              setAbilitaConferma(true);
          }
          if(res.status === 5020) 
              props.showError("Prenotazione non valida, per favore riprova", 'popup');
          if(res.status === 500)
              props.showError("Errore server! Riprova più tardi!", 'popup');
          if(res.status === 5030){
            props.showError("Per favore inserisci un orario!", 'popup');
            setAbilitaConferma(true);
          }
          if(res.status === 402){
            props.showError("Sei loggato come ristoratore! Impossibile effeturare la prenotazione ", 'popup');
            setAbilitaConferma(true);
          }
          if(res.status === 411){
            props.showError("Prenotazione già esistente! Controlla data o orario", 'popup');
            setAbilitaConferma(true);
          }
      });
  }else{
    navigate("/login");
    enabledScroll();
  }
}

  return (
      <div className="background-blurrer">
          <div className='edit-password-popup'>
              <ul className='edit-password-list'> 
                  <h2 style={{color:"white"}}> RIEPILOGO PRENOTAZIONE </h2>
                  <div className='edit-password-label-field-wrapper'>
                      <ul className='edit-password-label-field'>
                          <p className='password-label'> Tipologia tavolo: {props.tipoligiaTavolo}</p>
                          <p className='password-label'> Data: {props.data}</p>
                          <p className='password-label'> Orario: {props.orario}</p>
                      </ul>
                  </div>
              </ul>
              <p style={{color:"white"}}> Note prenotazione: </p> 
              <TextArea style={{width:"80%", borderRadius:"7px"}} placeholder="Aggiungi nota..." value={noteInputField} onChange={(e)=>setNoteInputField(e.target.value)}></TextArea>
              <button className='popup-confirm popup-btn' onClick={createNewPrenotazione} disabled={abilitaConferma} style={{border:"none", marginTop:"20px"}}> Conferma prenotazione</button>
              <p className='popup-cancel popup-btn' onClick={()=>{props.disabilitaPrenotazione(); enabledScroll();}}> Indietro </p>

              {props.popupErrorLabelActive === true && (
                    <div className={props.getErrorLabelClassname()}>
                        <p>{props.errorMessage}</p>
                    </div>
                )}
                {props.popupConfirmLabelActive === true && (
                    <div className={props.getConfirmLabelClassname()}>
                        <p>{props.confirmMessage}</p>
                    </div>
                )}

          </div>
      </div>
  );
}