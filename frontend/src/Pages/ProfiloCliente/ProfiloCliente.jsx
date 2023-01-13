import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "./ProfiloCliente.css";
import { address } from "../../assets/globalVar";
import { useState } from 'react';
import scaleImage from './ImageConverter.js';
import Select from 'react-select';
import { AddressAutofill } from '@mapbox/search-js-react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import DatePicker from "react-datepicker";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '../Home/Card.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {Link } from 'react-router-dom';

import {IonIcon} from '@ionic/react';
import {trashBinOutline, pencilOutline} from 'ionicons/icons';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';
import MapboxAutocomplete from "react-mapbox-autocomplete";

const updateAvatarUrl = `http://${address}:8080/updateUserAvatar`;
const updateProfileUrl = `http://${address}:8080/updateUserEmail`;
const updatePasswordUrl = `http://${address}:8080/updateUserPassword`;
const updateNumeroUrl = `http://${address}:8080/updateNumeroCliente`;
const updateIndirizzoUrl = `http://${address}:8080/updateIndirizzoCliente`;
const updateIntolleranzeUrl = `http://${address}:8080/updateIntolleranzeCliente`;
const resetAvatarUrl = `http://${address}:8080/resetUserAvatar`;
const allPrenotazioniClienteUrl= `http://${address}:8080/getPrenotazioniCliente`; 
const cancellaPrenotazioneUrl = `http://${address}:8080/cancellaPrenotazione`; 
const updateTipologiaUrl = `http://${address}:8080/updateTipologia`;
const updateOrarioUrl = `http://${address}:8080/updateOrario`;
const updateDataUrl = `http://${address}:8080/updateData`; 
const updateNoteUrl = `http://${address}:8080/updateNote`;
const getPreferitiUrl = `http://${address}:8080/getPreferiti`;

const intolleranzeTesto = [
    { value: 'Lattosio', label: 'Lattosio' },
    { value: 'Glutine', label: 'Glutine' },
    { value: 'Nickel', label: 'Nickel' },
    { value: 'Favismo', label: 'Favismo' },
]

const tipologiaTavoloOptions = [
    { value: '2 persone', label: '2 persone' },
    { value: '5 persone', label: '5 persone' },
    { value: '10 persone', label: '10 persone' },
]

const orari = [
    { value: '11:30-12:30', label: '11:30-12:30' },
    { value: '12:30-13:30', label: '12:30-13:30' },
    { value: '13:30-14:30', label: '13:30-14:30' },
    { value: '18:30-19:30', label: '18:30-19:30' },
    { value: '19:30-20:30', label: '19:30-20:30' },
    { value: '20:30-21:30', label: '20:30-21:30' },
]

//ModificaPrenotazioneConst
let tipologia = "";
let orario = "";
let data = "";
let note = "";
let codice_prenotazione = "";

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            return false;
        }
    }

    return true;
}

const NameAndImage = (props) => {
    const [image, setImage] = useState(null);
    const [dropdownImageActive, setDropdownImageActive] = useState(false);
    const inputImage = useRef(null);
    
    //se cambia l'immagine, la posto al backend
    useEffect(() => {
        if(image !== null)
            updateAvatar();

    }, [image]);

    const onChangeImage = () => {
        inputImage.current.click();
    }

    const handleOnChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            convertToBase64(e.target.files[0]);
        }
        setDropdownImageActive(false);
    }

    const convertToBase64 = (file) => {
        scaleImage(file, setImage, () => props.showError("Impossibile caricare l'immagine, per favore riprova!", "form"));
    }

    const getProfilePic = () => {
        if(props.user.avatar === null)
            return require("../../Images/avatar.png");
        else
            return "data:image/png;base64," + props.user.avatar;
    }

    const updateAvataroptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'image': image
        })
    }

    const updateAvatar = () => {
        fetch(updateAvatarUrl, updateAvataroptions)
            .then(res => {
                if(res.status === 200) {
                    console.log("Immagine profilo cambiata con successo!");
                    props.fetchProfile();
                }
            });
    }

    const resetAvatar = () => {
        fetch(resetAvatarUrl, resetAvatarOptions)
            .then(res => {
                if(res.status === 200) {
                    console.log("Immagine profilo rimossa con successo!");
                    props.fetchProfile();
                }
            });
    }

    const resetAvatarOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        }
    }

    const onDeleteImage = () => {
        resetAvatar();
        setDropdownImageActive(false);
    }
  
    return (
        <div className='name-image-container'>
            <ul className='name-image-list'>
                <div className='image-pencil-container' >
                    <input type="file" ref={inputImage} style = {{display: 'none'}} onChange={(e) => handleOnChange(e)} />
                    <img src={getProfilePic()} className='account-image' />
                    <img src={require("../../Images/edit.png")} className='pencil' onClick={() => setDropdownImageActive(!dropdownImageActive)}/>
                </div>
                <div className='usernameAndTipologia'>
                    <p className='account-big-name'>{props.user.username}</p>
                    <p className='account-small-tipologia'>{props.user.tipologiaUtente}</p>
                </div>
                {dropdownImageActive === true && (
                    <div className='dropdown-edit-image'>
                        <ul className='dropdown-edit-image-list'>
                            <p className='dropdown-edit-image-item' onClick={onChangeImage} >Cambia immagine</p>
                            <p className='dropdown-edit-image-item' onClick={onDeleteImage}> Cancella immagine</p>
                        </ul>
                    </div>
                )}
            </ul>
        </div>
    );
}

const TabellaPrenotazioni = (props) =>{
    
    const [allPrenotazioniCliente, setAllPrenotazioniCliente] = useState([]);

    const prenotazioniClienteOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': props.accessToken
        }
    }
 
    useEffect(() => {
        fetch(allPrenotazioniClienteUrl, prenotazioniClienteOptions)
            .then((res) => res.json())
            .then((result) => setAllPrenotazioniCliente(result),
                (error) => console.log("Error fetching all prenotazioni cliente"));
      }, []);

    //Cancella prenotazione
    const cancellaPrenotazione = (event) => {
        fetch(cancellaPrenotazioneUrl, { 
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },

                                        body: JSON.stringify({
                                            'codice_prenotazione': event.currentTarget.id
                                        })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Prenotazione cancellata con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Prenotazione non cancellata, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');
                if(res.status === 412) 
                    props.showError("Impossibile cancellare la prenotazione, è stata già accetata, contatta il ristorante!", 'form');
            });
    }

    function setRiepilogoModificaPrenotazione(t, o, d, n, c){
        tipologia = t;
        orario = o;
        data = d;
        note = n;
        codice_prenotazione = c;
    }

    return(
        <div className='property-container'>
            <p className="property-title"> Prenotazioni </p>
                <TableContainer component={Paper} style={{borderRadius:"10px", maxHeight:"450px", maxWidth:"97%"}}>
                    <Table >
                    <TableHead style={{border: "1px solid black"}}>
                        <TableRow>
                            <TableCell>Codice prenotazione</TableCell>
                            <TableCell align="right">Tipologia tavolo</TableCell>
                            <TableCell align="right">Orario</TableCell>
                            <TableCell align="right">Data</TableCell>
                            <TableCell align="right">Ristorante</TableCell>
                            <TableCell align="right">Stato</TableCell>
                            <TableCell align="right">Note</TableCell>
                            <TableCell align="right">Operazioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{backgroundColor:"lightgray" , border: "1px solid black"}}>
                    {allPrenotazioniCliente.map((item, val) => (
                        <TableRow
                            id="prenotazione"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row"> {item.codice_prenotazione} </TableCell>
                            <TableCell align="right">{item.tipologiaTavolo}</TableCell>
                            <TableCell align="right">{item.orario}</TableCell>
                            <TableCell align="right">{item.data}</TableCell>
                            <TableCell align="right">{item.nomeRistorante}</TableCell>
                            <TableCell align="right">{item.stato}</TableCell>
                            <TableCell align="right">{item.note}</TableCell>
                            <TableCell align="right"> 
                                <div className="buttonContainerPrenotazione">
                                    <button className="buttonPrenotazione" id = {item.codice_prenotazione} onClick={() => {props.abilitaModificaPrenotazione(); setRiepilogoModificaPrenotazione(item.tipologiaTavolo, item.orario, item.data, item.note, item.codice_prenotazione)}}> <IonIcon icon={pencilOutline} className="iconPrenotazione"> </IonIcon> </button>
                                    <button className="buttonPrenotazione" id = {item.codice_prenotazione} onClick={cancellaPrenotazione}> <IonIcon icon={trashBinOutline} className="iconPrenotazione"> </IonIcon> </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))} 
                    </TableBody>
                    </Table>
                </TableContainer>
        </div>
    )
}

const ModificaPrenotazionePopup = (props) => {

    const [startDate, setStartDate] = useState(new Date());

    const [tipologiaEditable, setTipologiaEditable] = useState(false);
    const [tipologiaInputField, setTipologiaInputField] = useState("");

    const [dataEditable, setDataEditable] = useState(false);
    const [dataInputField, setDataInputField] = useState("");

    const [orarioEditable, setOrarioEditable] = useState(false);
    const [orarioInputField, setOrarioInputField] = useState("");

    const [noteEditable, setNoteEditable] = useState(false);
    const [noteInputField, setNoteInputField] = useState("");

    function handleSelect(data){
        setTipologiaInputField(data.value);
    }
    function handleSelectOrario(data){
        setOrarioInputField(data.value);
    }

    //Tipologia
    const updateTipologiaOptions = {
        method: 'POST',
        headers: {
            'Authorization': codice_prenotazione,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'codice_prenotazione': codice_prenotazione,
            'tipologia' : tipologiaInputField,
        })
    }

    
    const updateTipologiaPrenotazione = () => {
        if(tipologiaInputField === ""){
            props.showError("Errore! Il campo tipologia è vuoto, per favore riprova", 'popup');    
            return;
        }

        setTipologiaEditable(false);

        fetch(updateTipologiaUrl, updateTipologiaOptions)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Tipologia aggiornata con successo!", 'popup');
                }
                if(res.status === 413) {
                    props.showError("Non è possibile effettuare la modifica della prenotazione! Contatta il ristorante", 'popup');
                }
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'popup');;
            });
    }

    //Data
    const updateDataPrenotazione = () => {
        fetch(updateDataUrl, {method: 'POST',
                            headers: {
                                'Authorization': codice_prenotazione,
                                'Content-Type': 'application/json'
                            },

                            body: JSON.stringify({
                                'codice_prenotazione': codice_prenotazione,
                                'data' : document.getElementById("dataPicker").value,
        })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Data aggiornata con successo!", 'popup');
                }
                if(res.status === 413) {
                    props.showError("Non è possibile effettuare la modifica della prenotazione poichè è stata già confermata oppure è già presente una prenotazione in questo giorno con questo orario! Contatta il ristorante", 'popup');
                }
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'popup');;
            });
    }

    //Orario
    const updateOrarioOptions = {
        method: 'POST',
        headers: {
            'Authorization': codice_prenotazione,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'codice_prenotazione': codice_prenotazione,
            'orario' : orarioInputField,
        })
    }

    
    const updateOrarioPrenotazione = () => {
        if(orarioInputField === ""){
            props.showError("Errore! Il campo orario è vuoto, per favore riprova", 'popup');    
            return;
        }

        setOrarioEditable(false);

        fetch(updateOrarioUrl, updateOrarioOptions)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Orario aggiornato con successo!", 'popup');
                }
                if(res.status === 413) {
                    props.showError("Non è possibile effettuare la modifica della prenotazione! Contatta il ristorante", 'popup');
                }
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'popup');;
            });
    }

    //Note
    const updateNoteOptions = {
        method: 'POST',
        headers: {
            'Authorization': codice_prenotazione,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'codice_prenotazione': codice_prenotazione,
            'note' : noteInputField,
        })
    }

    
    const updateNotePrenotazione = () => {
        fetch(updateNoteUrl, updateNoteOptions)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Note aggiornate con successo!", 'popup');
                }
                if(res.status === 413) {
                    props.showError("Non è possibile effettuare la modifica della prenotazione! Contatta il ristorante", 'popup');
                }
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'popup');;
            });
    }

    return (
        <div className="background-blurrer">
            <div className='edit-password-popup'>
                <ul className='edit-password-list'> 
                    <h2 style={{color:"white", marginBottom:"20px"}}> Modifica prenotazione </h2>
                    
                    <div className='containerModificaPrenotazioni'>
                        <p className='password-label'>Tipologia tavolo: </p>
                            <ul className='containerModificaPrenotazioniList'>                          
                                {tipologiaEditable  
                                    ? <Select id="tipologiaSelect" options={tipologiaTavoloOptions} className="orario"  placeholder="Tipologia..." onChange={handleSelect}>  </Select>
                                    : <p className='property-content'> {tipologia} </p>
                                }
                                <div className="property-spacer" />
                                <p className="edit-button" onClick={() => setTipologiaEditable(!tipologiaEditable)}>{tipologiaEditable ? 'Cancella' : 'Modifica'}</p>
                                {tipologiaEditable === true &&(
                                    <div className='save-button' onClick={updateTipologiaPrenotazione}> Salva </div>
                                )}
                            </ul>
                    </div>

                    <div className='containerModificaPrenotazioni'>
                        <p className='password-label'>Data: </p>
                            <ul className='containerModificaPrenotazioniList'>                          
                                {dataEditable  
                                    ? <DatePicker id="dataPicker" className="dataPicker" selected={startDate} onChange={(date=Date) => setStartDate(date)} />
                                    : <p className='property-content'> {data} </p>
                                }
                                <div className="property-spacer" />
                                <p className="edit-button" onClick={() => setDataEditable(!dataEditable)}>{dataEditable ? 'Cancella' : 'Modifica'}</p>
                                {dataEditable === true &&(
                                    <div className='save-button' onClick={updateDataPrenotazione}> Salva </div>
                                )}
                            </ul>
                    </div>

                    <div className='containerModificaPrenotazioni'>
                        <p className='password-label'>Orario: </p>
                            <ul className='containerModificaPrenotazioniList'>                          
                                {orarioEditable  
                                    ? <Select id="orarioSelect" options={orari} className="orario"  placeholder="Orario..." onChange={handleSelectOrario}>  </Select>
                                    : <p className='property-content'> {orario} </p>
                                }
                                <div className="property-spacer" />
                                <p className="edit-button" onClick={() => setOrarioEditable(!orarioEditable)}>{orarioEditable ? 'Cancella' : 'Modifica'}</p>
                                {orarioEditable === true &&(
                                    <div className='save-button' onClick={updateOrarioPrenotazione}> Salva </div>
                                )}
                            </ul>
                    </div>

                    <div className='containerModificaPrenotazioni'>
                        <p className='password-label'>Note: </p>
                            <ul className='containerModificaPrenotazioniList'>                          
                                {noteEditable  
                                    ? <input type="text" className='property-content-editable' value={noteInputField} onChange={(e)=>setNoteInputField(e.target.value)}/> 
                                    : <p className='property-content'> {note} </p>
                                }
                                <div className="property-spacer" />
                                <p className="edit-button" onClick={() => setNoteEditable(!noteEditable)}>{noteEditable ? 'Cancella' : 'Modifica'}</p>
                                {noteEditable === true &&(
                                    <div className='save-button' onClick={updateNotePrenotazione}> Salva </div>
                                )}
                            </ul>
                    </div>
                </ul>

                <p className='popup-cancel popup-btn' onClick={props.disabilitaModificaPrenotazione}> Indietro </p>

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

const AccountInfo = (props) => {
    const [emailEditable, setEmailEditable] = useState(false);
    const [emailInputField, setEmailInputField] = useState(props.user.email);
    const [numeroEditable, setNumeroEditable] = useState(false);
    const [numeroInputField, setNumeroInputField] = useState(props.cliente.numero);
    const [indirizzoEditable, setIndirizzoEditable] = useState(false);
    const [indirizzoInputField, setIndirizzoInputField] = useState(props.cliente.indirizzo);
    const [intolleranzeEditable, setIntolleranzeEditable] = useState(false);
    const [intolleranzeInputField, setIntolleranzeInputField] = useState([]);
   
    useEffect(() => {   
        if(props.user && props.user.email != undefined)
            setEmailInputField(props.user.email);
        if(props.cliente && props.cliente.numero != undefined)
            setNumeroInputField(props.cliente.numero);
        if(props.cliente && props.cliente.indirizzo != undefined){
            setIndirizzoInputField(props.cliente.indirizzo.split(";")[1]);
        }
        if(props.cliente && props.cliente.intolleranze != undefined)
            setIntolleranzeInputField(props.cliente.intolleranze);
    }, [props.user, props.cliente]); 

    //Email
    const isCharacterALetter = (char) => {
        return (/[a-zA-Z]/).test(char)
    }

    const checkEmailConstraints = (ev) => {
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

    const checkAccountInfoConstraints = () => {
        if(emailInputField === "") {
            props.showError("Errore! Campo email vuoto", "form");
            return false;
        }

        return true;
    }

    const checkEmail = (mail) => {
        return mail.match(/^[a-zA-Z0-9\\.]+@[a-z]+[\\.]{1}[a-z]+$/);
    }

    const updateOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'email': emailInputField
        })
    }

    const updateProfileInfo = () => {
        if(checkAccountInfoConstraints() === false)
            return;
        if(!checkEmail(emailInputField)) {
            props.showError("Errore! l'email non è valida, per favore riprova", 'form');
            return
        }    

        setEmailEditable(false);

        fetch(updateProfileUrl, updateOptions)
            .then(res => parseResponse(res));
    }

    const parseResponse = res => {
        if(res.status === 200) {
            props.showConfirm("Email aggiornata con successo!", 'form');
        }
        if(res.status === 5020) 
            props.showError("Email non valida, per favore riprova", 'form');
        if(res.status === 500)
            props.showError("Errore server! Per favore riprova più tardi", 'form');
    }

    //Numero
    const checkNumero = (numero) => {
        return numero.match(/^(([+]|00)39)?((3[1-6][0-9]))(\d{7})$/);
    }

    const updateInfoOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'numero': numeroInputField
        })
    }

    const updateNumero = () => {   
        if(!checkNumero(numeroInputField)) {
            props.showError("Errore! il numero non è valido, per favore riprova", 'form');
            return
        }   

        setNumeroEditable(false);
        fetch(updateNumeroUrl, updateInfoOptions)
            .then(res => parseResponseNumero(res));
       
    }

    const parseResponseNumero = res => {
        if(res.status === 200) {
            props.showConfirm("Numero aggiornato con successo!", 'form');
        }
        if(res.status === 5020) 
            props.showError("Numero non valido, per favore riprova", 'form');
        if(res.status === 500)
            props.showError("Errore server! Per favore riprova più tardi", 'form');
    }

    //Indirizzo
    const updateIndirizzoOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'indirizzo': indirizzoInputField
        })
    }

    const updateIndirizzo = () => {   
        if(indirizzoInputField === "") {
            props.showError("Errore! Campo indirizzo vuoto", "form");
            return;
        }

        setIndirizzoEditable(false);
        setIndirizzoInputField(indirizzoInputField.split(";")[1])

        fetch(updateIndirizzoUrl, updateIndirizzoOptions)
            .then(res => parseResponseIndirizzo(res));
   
    }

    const parseResponseIndirizzo = res => {
        if(res.status === 200) {
            props.showConfirm("Indirizzo aggiornato con successo!", 'form');
        }
        if(res.status === 5020) 
            props.showError("Indirizzo non valido, per favore riprova", 'form');
        if(res.status === 500)
            props.showError("Errore server! Per favore riprova più tardi", 'form');
    }


    //Intolleranze
    const updateIntolleranzeOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'intolleranze': intolleranzeInputField
        })
    }

    const updateIntolleranze = () => {   
        setIntolleranzeEditable(false);
        fetch(updateIntolleranzeUrl, updateIntolleranzeOptions)
            .then(res => parseResponseIntolleranze(res));
       
    }

    const parseResponseIntolleranze = res => {
        if(res.status === 200) {
            props.showConfirm("Intolleranze aggiornate con successo!", 'form');
        }
        if(res.status === 5020) 
            props.showError("Numero non valido, per favore riprova", 'form');
        if(res.status === 500)
            props.showError("Errore server! Per favore riprova più tardi", 'form');
    }

    const handleSelect = (e) => {
        setIntolleranzeInputField(Array.isArray(e) ? e.map(x => x.value) : []);
        console.log(intolleranzeInputField)
    }
     
    /* ------------------------------------------------------------------------------ */

    //MODIFICA PRENOTAZIONE
    const [modificaPrenotazioneEditable, setModificaPrenotazioneEditable] = useState(false);

    const abilitaModificaPrenotazione = () => {
        setModificaPrenotazioneEditable(true);
        disabledScroll();
    }

    function disabledScroll(){
        disableBodyScroll(document);
    }

    const disabilitaModificaPrenotazione = () => {
        setModificaPrenotazioneEditable(false);
        enabledScroll();
    }

    function enabledScroll(){
        enableBodyScroll(document)
    }

     /* ------------------------------------------------------------------------------ */

     //Indirizzo
     const mapAccess = {
        mapboxApiAccessToken: "pk.eyJ1IjoibWF0dGVvc3BvcnRlbGxpIiwiYSI6ImNsYXYzMmJqbDAxdXQzcm1wZjBkbW53ZHcifQ.4xFih1yVT6FkB5q3f-cJKQ"
    };
    
    function _suggestionSelect(result, lat, long, text) {
        setIndirizzoInputField(lat + " " + long + ";" + result);
    }
    

    return (
        <div className='paper-black-account-settings'>
            <div className='properties-container'>
                <div className='property-container'>
                    <p className='property-title'>Nome</p>
                    <p className='property-content'> {props.user.nome} </p>
                </div>

                <div className='property-container'>
                    <p className='property-title'>Email</p>
                    <ul className="property-list">
                        {emailEditable  
                            ? <input type="text" className='property-content-editable' value={emailInputField} onChange={(e)=>setEmailInputField(e.target.value)} onKeyPress={(ev) => checkEmailConstraints(ev)} /> 
                            : <p className='property-content'> {emailInputField} </p>
                        }
                        <div className="property-spacer" />
                        {!props.user.googleUser && (
                            <p className="edit-button" onClick={() => setEmailEditable(!emailEditable)}>{emailEditable ? 'Cancella' : 'Modifica'}</p>
                        )}
                        {emailEditable === true &&(
                            <div className='save-button' onClick={() => updateProfileInfo()} > Salva </div>
                        )}
                    </ul>
                </div>

                <div className='property-container'>
                    <p className='property-title'>Password</p>
                    <ul className="property-list">
                        <input type="password" defaultValue={"restBook"} className='password-content'/>
                        <div className="property-spacer" />
                        {!props.user.googleUser && (
                            <p className='edit-button' onClick={props.enablePasswordEdit}> Modifica </p>
                        )}
                    </ul>
                    {props.passwordEditable === true &&
                        <EditPasswordPopup 
                            disablePasswordEdit={props.disablePasswordEdit} 
                            popupErrorLabelActive={props.popupErrorLabelActive}
                            getErrorLabelClassname = {props.getErrorLabelClassname}
                            showError = {props.showError}
                            errorMessage = {props.errorMessage}
                            accessToken = {props.accessToken}
                            showResultPopup={props.showResultPopup}

                            formConfirmLabelActive = {props.formConfirmLabelActive}
                            popupConfirmLabelActive = {props.popupConfirmLabelActive}
                            getConfirmLabelClassname = {props.getConfirmLabelClassname}
                            showConfirm = {props.showConfirm}
                            confirmMessage = {props.confirmMessage}
                        />
                    }
                </div>

                <div className='property-container'>
                    <p className='property-title'>Numero</p>
                    <ul className="property-list">
                        {numeroEditable  
                            ? <input type="text" className='property-content-editable' value={numeroInputField} onChange={(e)=>setNumeroInputField(e.target.value)}/> 
                            : <p className='property-content'> {numeroInputField} </p>
                        }
                        <div className="property-spacer" />
                        
                        <p className="edit-button" onClick={() => setNumeroEditable(!numeroEditable)}>{numeroEditable ? 'Cancella' : 'Modifica'}</p>
                        {numeroEditable === true &&(
                            <div className='save-button' onClick={updateNumero} > Salva </div>
                        )}
                        
                    </ul>
                </div>

              <div className='property-container'>
                    <p className='property-title'>Indirizzo</p>  
                    <ul className="property-list">
                        {indirizzoEditable     
                            ? <div style={{width:"50%"}}> 
                                 <form>
                                 <MapboxAutocomplete
                                    publicKey={mapAccess.mapboxApiAccessToken}
                                    inputClass="form-control search"
                                    onSuggestionSelect={_suggestionSelect}
                                    country="it"
                                    resetSearch={false}
                                    placeholder="Indirizzo..."
                                    style={{width:"20px"}}
                                />
                                 </form>
                               </div>
                            : <p className='property-content'> {indirizzoInputField} </p>
                        }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setIndirizzoEditable(!indirizzoEditable)}> {indirizzoEditable ? 'Cancella' : 'Modifica'} </p>
                        {indirizzoEditable === true &&(
                            <div className='save-button' onClick={updateIndirizzo} > Salva </div>
                        )}
                    </ul>
                </div>  

                <div className='property-container'>
                    <p className='property-title'>Intolleranze alimentari</p>
                    <ul className="property-list">
                        {intolleranzeEditable  
                            ? <Select id="intolleranze" className='property-content-editable' isMulti options={intolleranzeTesto} onChange={handleSelect} value={intolleranzeTesto.filter(obj => intolleranzeInputField.includes(obj.value))} placeholder="Tipologia intolleranze..."/>
                            : <p className='property-content'> {intolleranzeInputField} </p>
                        }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setIntolleranzeEditable(!intolleranzeEditable)}>{intolleranzeEditable ? 'Cancella' : 'Modifica'}</p>
                        {intolleranzeEditable === true &&(
                            <div className='save-button' onClick={updateIntolleranze} > Salva </div>
                        )}
                    </ul>
                </div>

                <TabellaPrenotazioni 
                    popupErrorLabelActive={props.popupErrorLabelActive}
                    getErrorLabelClassname = {props.getErrorLabelClassname}
                    showError = {props.showError}
                    errorMessage = {props.errorMessage}
                    accessToken = {props.accessToken}
                    showResultPopup={props.showResultPopup}

                    formConfirmLabelActive = {props.formConfirmLabelActive}
                    popupConfirmLabelActive = {props.popupConfirmLabelActive}
                    getConfirmLabelClassname = {props.getConfirmLabelClassname}
                    showConfirm = {props.showConfirm}
                    confirmMessage = {props.confirmMessage}

                    ristoratore={props.ristoratore}
                    cliente = {props.cliente}

                    abilitaModificaPrenotazione = {abilitaModificaPrenotazione}

                />

                {modificaPrenotazioneEditable === true &&
                    <ModificaPrenotazionePopup 
                        formErrorLabelActive = {props.formErrorLabelActive}
                        popupErrorLabelActive = {props.popupErrorLabelActive}
                        getErrorLabelClassname = {props.getErrorLabelClassname}
                        showError = {props.showError}
                        errorMessage = {props.errorMessage}

                        formConfirmLabelActive = {props.formConfirmLabelActive}
                        popupConfirmLabelActive = {props.popupConfirmLabelActive}
                        getConfirmLabelClassname = {props.getConfirmLabelClassname}
                        showConfirm = {props.showConfirm}
                        confirmMessage = {props.confirmMessage}

                        disabilitaModificaPrenotazione = {disabilitaModificaPrenotazione}
                    />
                }
                
            </div>

            {props.formErrorLabelActive === true && (
                <div className={props.getErrorLabelClassname()}>
                    <p>{props.errorMessage}</p>
                </div>
            )}
            {props.formConfirmLabelActive === true && (
                <div className={props.getConfirmLabelClassname()}>
                    <p>{props.confirmMessage}</p>
                </div>
            )}
        </div>
        
    );
}

const EditPasswordPopup = (props) => {

    const [oldPasswordInputField, setOldPasswordInputField] = useState("");
    const [newPasswordInputField, setNewPasswordInputField] = useState("");
    const [confirmNewPasswordInputField, setConfirmNewPasswordInputField] = useState("");

    const checkPasswordConstraints = () => {

        if(oldPasswordInputField === "" || newPasswordInputField === "" || confirmNewPasswordInputField === "") {
            props.showError("Errore! Alcuni campi sono vuoti", "popup");
            return false;
        }

        if(newPasswordInputField !== confirmNewPasswordInputField) {
            props.showError("La nuova password non corrisponde", "popup");
            return false;
        }

        if(!newPasswordInputField.match(/^(?=.*\d)(?=.*[@.?#$%^&+=!])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
        {
            props.showError("Errore! Per favore controlla i campi e riprova", "popup");
            return false;
        }
    
        return true;
    }

    const updateOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'old_password':  oldPasswordInputField,
            'new_password': newPasswordInputField
        })
    }

    const parsePasswordResponse = res => {
        if(res.status === 200) {
            props.showConfirm("Password aggiornata con successo!", 'form');
            props.disablePasswordEdit();
        }
        if(res.status === 5020) 
            props.showError("Errore! Caratteri password non validi, per favore riprova", 'popup');
        if(res.status === 500)
            props.showError("Errore server! per favore riprova più tardi", 'popup');
        if(res.status === 401)
            props.showError("Errore! La vecchia password non corrisponde, per favore riprova", 'popup');
    }

    const handleConfirmPassword = () => {
        if(checkPasswordConstraints() === false)
            return;
        
        fetch(updatePasswordUrl, updateOptions)
            .then(res => parsePasswordResponse(res));
    }

    return (
        <div className="background-blurrer">
            <div className='edit-password-popup'>
                <ul className='edit-password-list'> 

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>Vecchia password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setOldPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>Nuova password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setNewPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>

                    <div className='edit-password-label-field-wrapper'>
                        <ul className='edit-password-label-field'>
                            <p className='password-label'>Conferma nuova password</p>
                            <input type="password" className='password-content-editable' onChange={(e)=> setConfirmNewPasswordInputField(e.target.value)}/>
                        </ul>
                    </div>
                </ul>
                <p className='popup-confirm popup-btn' onClick={()=>handleConfirmPassword()} > Conferma password</p>
                <p className='popup-cancel popup-btn' onClick={props.disablePasswordEdit}> Cancella </p>

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

//Owl Carousel Settings
const optionsPreferiti = {
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
            items: 2,
        },
        700: {
            items: 2,
        },
        1080: {
            items: 3,
        },
        1920: {
          items: 4,
      }
    },
  };

const ScrollPreferiti = (props) => {

    //Get preferiti
    const [allPreferiti, setAllPreferiti] = useState([]);

    const getPreferitiOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': props.accessToken
        },
    }

    useEffect(() => {
        fetch(getPreferitiUrl, getPreferitiOptions)
            .then((res) => res.json())
            .then((result) => setAllPreferiti(result),
                (error) => console.log("Error fetching get preferiti cliente"));

    }, []);

    const getCopertinaPic = (copertina) => {
        if(copertina === null || copertina === undefined || copertina === "")
            return require("../../Images/nessunImmagine.png");
        else
            return "data:image/png;base64," + copertina;
    }

    return(
        <div>
            <h2 className='h2'> Ristoranti preferiti </h2>
            <OwlCarousel className="owl-theme" {...optionsPreferiti} items={3} nav margin={8}>
                {allPreferiti.map((item, val) => (
                    <div className='card'>
                        <Card sx={{ maxWidth: "100%" }}>
                            <CardActionArea>
                                <Link to="/restaurant" state={[item.username_ristoratore,item.nome]} style={{textDecoration:'none', color: 'black'}} >
                                    <CardMedia
                                    component="img"
                                    height="240"
                                    image={getCopertinaPic(item.copertina)} 
                                    alt="Ristorante"
                                    />
                                </Link>
                                <CardContent style={{backgroundColor: '#272B30', color: '#c5cfdb'}}>
                                
                                <Typography key={val} gutterBottom variant="h5" component="div">
                                    {item.nome}
                                </Typography>
                                
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </div>
                ))} 
            </OwlCarousel>
        </div>
    )
}

const ProfiloCliente = (props) => {
    const navigate = useNavigate();
    const [passwordEditable, setPasswordEditable] = useState(false);
    const [formErrorLabelActive, setFormErrorLabelActive] = useState(false);
    const [popupErrorLabelActive, setPopupErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formConfirmLabelActive, setFormConfirmLabelActive] = useState(false);
    const [popupConfirmLabelActive, setPopupConfirmLabelActive] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    
    useEffect(() => {
        
        if(props.accessToken === "" && isEmptyObject(props.userLogged))
            navigate("/login");

    }, [props.userLogged]);

    const enablePasswordEdit = () => {
        setPasswordEditable(true);
    }

    const disablePasswordEdit = () => {
        setPasswordEditable(false);
    }

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

   

    return(
        <div className="profile">
            <div className='paper-gray-account-settings'>
                <div className='paper-black-container'>
                    <div className='account-settings-wrapper'>
                        <NameAndImage
                           user={props.userLogged}
                           accessToken={props.accessToken}
                           fetchProfile={props.fetchProfile}
                           showError = {showError}
                           showResultPopup={props.showResultPopup}
                        />
                        
                        <AccountInfo 
                            user={props.userLogged}
                            cliente={props.cliente}
                            passwordEditable={passwordEditable}
                            enablePasswordEdit={enablePasswordEdit}
                            disablePasswordEdit = {disablePasswordEdit}
                            accessToken={props.accessToken}
                            fetchProfile={props.fetchProfile}
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
                    </div>
                </div>
            </div>
                        <ScrollPreferiti 
                            accessToken={props.accessToken}
                        />
                        
        </div>
    );
}

export default ProfiloCliente;
