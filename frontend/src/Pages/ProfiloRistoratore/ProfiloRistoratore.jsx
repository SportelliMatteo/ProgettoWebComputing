import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import "./ProfiloRistoratore.css";
import { address } from "../../assets/globalVar";
import { useState } from 'react';
import scaleImage from './ImageConverter.js';
import { AddressAutofill } from '@mapbox/search-js-react';
import Select from 'react-select';
import scaleCopertina from './copertinaConverter.js';
import NumericInput from 'react-numeric-input';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import {IonIcon} from '@ionic/react';
import {trashBinOutline,  checkmarkSharp} from 'ionicons/icons';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import MapboxAutocomplete from "react-mapbox-autocomplete";

const updateAvatarUrl = `http://${address}:8080/updateUserAvatar`;
const resetAvatarUrl = `http://${address}:8080/resetUserAvatar`;
const updateProfileUrl = `http://${address}:8080/updateUserEmail`;
const updatePasswordUrl = `http://${address}:8080/updateUserPassword`;
const updateNomeUrl = `http://${address}:8080/updateUserNome`;
const updateDescrizioneUrl = `http://${address}:8080/updateDescrizioneRistorante`;
const updateIndirizzoUrl = `http://${address}:8080/updateIndirizzoRistorante`;
const updateNumeroUrl = `http://${address}:8080/updateNumeroRistorante`;
const updateIntolleranzeUrl = `http://${address}:8080/updateIntolleranzeRistorante`;
const updateLinkMenuUrl = `http://${address}:8080/updateLinkMenuRistorante`;
const updateFileMenuUrl = `http://${address}:8080/updateFileMenu`;
const updateCopertinaUrl = `http://${address}:8080/updateCopertinaRistorante`;
const allPrenotazioniUrl= `http://${address}:8080/getPrenotazioni`; 
const confermaPrenotazioneUrl = `http://${address}:8080/confermaPrenotazione`;
const rifiutaPrenotazioneUrl = `http://${address}:8080/rifiutaPrenotazione`;
const updateTavolo2Url = `http://${address}:8080/updateTavolo2`; 
const updateTavolo5Url = `http://${address}:8080/updateTavolo5`; 
const updateTavolo10Url = `http://${address}:8080/updateTavolo10`; 
const getRecensioniUrl = `http://${address}:8080/getRecensioniRistoratore`;


const intolleranzeTesto = [
    { value: 'Lattosio', label: 'Lattosio' },
    { value: 'Glutine', label: 'Glutine' },
    { value: 'Nickel', label: 'Nickel' },
    { value: 'Favismo', label: 'Favismo' },
  ]

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
    const [allPrenotazioni, setAllPrenotazioni] = useState([]);
    
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

    const [allPrenotazioni, setAllPrenotazioni] = useState([]);

    const prenotazioniOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': props.accessToken
        },
        
    }

    useEffect(() => {
        fetch(allPrenotazioniUrl, prenotazioniOptions)
            .then((res) => res.json())
            .then((result) => setAllPrenotazioni(result),
                (error) => console.log("Error fetching all prenotazioni"));

      }, [props.ristoratore]);

    //Conferma prenotazione
    const confermaPrenotazione = (event) => {
        fetch(confermaPrenotazioneUrl, { 
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },

                                        body: JSON.stringify({
                                            'codice_prenotazione': event.currentTarget.id
                                        })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Prenotazione confermata con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Prenotazione non confermata, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');
            });

    }

    //Rifiuta prenotazione
    const rifiutaPrenotazione = (event) => {
        fetch(rifiutaPrenotazioneUrl, { 
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },

                                        body: JSON.stringify({
                                            'codice_prenotazione': event.currentTarget.id
                                        })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Prenotazione rifiutata con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Prenotazione non rifiutata, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');
            });
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
                            <TableCell align="right">Cliente</TableCell>
                            <TableCell align="right">Note</TableCell>
                            <TableCell align="right">Stato</TableCell>
                            <TableCell align="right">Operazioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{backgroundColor:"lightgray" , border: "1px solid black"}}>
                    {allPrenotazioni.map((item, val) => (
                        <TableRow
                            id="prenotazione"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row"> {item.codice_prenotazione} </TableCell>
                            <TableCell align="right">{item.tipologiaTavolo}</TableCell>
                            <TableCell align="right">{item.orario}</TableCell>
                            <TableCell align="right">{item.data}</TableCell>
                            <TableCell align="right">{item.username_cliente}</TableCell>
                            <TableCell align="right">{item.note}</TableCell>
                            <TableCell align="right">{item.stato}</TableCell> 
                            <TableCell align="right"> 
                                <div className="buttonContainerPrenotazione">
                                    <button className="buttonPrenotazione" id={item.codice_prenotazione} onClick={confermaPrenotazione} > <IonIcon icon={checkmarkSharp} className="iconPrenotazione"> </IonIcon> </button>
                                    <button className="buttonPrenotazione" id={item.codice_prenotazione} onClick={rifiutaPrenotazione}> <IonIcon icon={trashBinOutline} className="iconPrenotazione"> </IonIcon> </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))} 
                    </TableBody>
                    </Table>
                </TableContainer>
        </div>
    );
}

const AccountInfo = (props) => {
    const [emailEditable, setEmailEditable] = useState(false);
    const [emailInputField, setEmailInputField] = useState(props.user.email);
    
    const [nomeEditable, setNomeEditable] = useState(false);
    const [nomeInputField, setNomeInputField] = useState(props.user.nome);
    
    const [descrizioneEditable, setDescrizioneEditable] = useState(false);
    const [descrizioneInputField, setDescrizioneInputField] = useState(props.ristoratore.descrizione);
    
    const [copertinaEditable, setCopertinaEditable] = useState(false);
    const [copertina, setCopertina] = useState(null);
    const [dropdownCopertinaActive, setDropdownCopertinaActive] = useState(false);
    const inputCopertina = useRef(null);

    const [indirizzoEditable, setIndirizzoEditable] = useState(false);
    const [indirizzoInputField, setIndirizzoInputField] = useState(props.ristoratore.indirizzo);
    
    const [numeroEditable, setNumeroEditable] = useState(false);
    const [numeroInputField, setNumeroInputField] = useState(props.ristoratore.numero);
    
    const [intolleranzeEditable, setIntolleranzeEditable] = useState(false);
    const [intolleranzeInputField, setIntolleranzeInputField] = useState([]);
    
    const [linkEditable, setLinkEditable] = useState(false);
    const [linkInputField, setLinkInputField] = useState(props.ristoratore.linkMenu);
    
    const [tavolo2Editable, setTavolo2Editable] = useState(false);
    const [tavolo2InputField, setTavolo2InputField] = useState(false);
    const [tavolo5Editable, setTavolo5Editable] = useState(false);
    const [tavolo5InputField, setTavolo5InputField] = useState(false);
    const [tavolo10Editable, setTavolo10Editable] = useState(false);
    const [tavolo10InputField, setTavolo10InputField] = useState(false);
    
    const [recensioni, setRecensioni] = useState([]);

    useEffect(() => {   
        if(props.user && props.user.email != undefined)
            setEmailInputField(props.user.email);
        if(props.user && props.user.nome != undefined)
            setNomeInputField(props.user.nome);
        if(props.ristoratore && props.ristoratore.descrizione != undefined)
            setDescrizioneInputField(props.ristoratore.descrizione);
        if(props.ristoratore && props.ristoratore.indirizzo != undefined){
            setIndirizzoInputField(props.ristoratore.indirizzo.split(";")[1]);
        }
        if(props.ristoratore && props.ristoratore.numero != undefined)
            setNumeroInputField(props.ristoratore.numero);
        if(props.ristoratore && props.ristoratore.intolleranze != undefined)
            setIntolleranzeInputField(props.ristoratore.intolleranze);
        if(props.ristoratore && props.ristoratore.linkMenu != undefined)
            setLinkInputField(props.ristoratore.linkMenu);
        if(props.ristoratore && props.ristoratore.tavolo2 != 0){
            setTavolo2InputField(props.ristoratore.tavolo2);
        }
        if(props.ristoratore && props.ristoratore.tavolo5 != 0){
            setTavolo5InputField(props.ristoratore.tavolo5);
        }
        if(props.ristoratore && props.ristoratore.tavolo10 != 0){
            setTavolo10InputField(props.ristoratore.tavolo10);
        }
    }, [props.user, props.ristoratore]);

    const isCharacterALetter = (char) => {
        return (/[a-zA-Z]/).test(char)
    }

    function toBase64(blob, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            var base64data = reader.result;                
            callback(base64data);
        }
    }

    const checkAccountInfoConstraints = () => {
        if(emailInputField === "") {
            props.showError("Errore! Alcuni campi sono vuoti", "form");
            return false;
        }

        return true;
    }

    function refreshPage(){
        window.location.reload(true);
    }

    //Nome
    const updateOptionsNome = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'nome': nomeInputField
        })
    }

    const updateNome = () => {
        if(nomeInputField === ""){
            props.showError("Errore! Il campo nome è vuoto, per favore riprova", 'form');    
            return;
        }

        setNomeEditable(false);

        fetch(updateNomeUrl, updateOptionsNome)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Nome aggiornato con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Nome non valido, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }
   

    //Email
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

    const checkEmail = (mail) => {
        return mail.match(/^[a-zA-Z0-9\\.]+@[a-z]+[\\.]{1}[a-z]+$/);
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

    const updateProfileInfo = () => {
        if(checkAccountInfoConstraints() === false)
            return;
        if(!checkEmail(emailInputField)) {
            props.showError("Errore! l'email non è valida, per favore riprova", 'form');
            return
        }    

        setEmailEditable(false);

        fetch(updateProfileUrl, updateOptions)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Email aggiornata con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Email non valida, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Descrizione
    const updateOptionsDescrizione = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'descrizione': descrizioneInputField
        })
    }

    const updateDescrizione = () => {
        setDescrizioneEditable(false);

        fetch(updateDescrizioneUrl, updateOptionsDescrizione)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Descrizione aggiornata con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Descrizione non valida, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Copertina
    const handleOnChangeCopertina = (e) => {
        if(e.target.files && e.target.files[0]) {
            convertToBase64Copertina(e.target.files[0]);
        }
        setDropdownCopertinaActive(false);
    }

    const convertToBase64Copertina = (file) => {
        scaleCopertina(file, setCopertina, () => props.showError("Impossibile caricare l'immagine, per favore riprova!", "form"));
    }

    const getNameCopertina = (im) => {
        if(im === null)
            return "";
        else
            return "Immagine di copertina";
      }

    const updateCopertinaOptions = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'copertinaRistorante': copertina
        })
    }

    const updateCopertina = () => {
        setCopertinaEditable(false);
        fetch(updateCopertinaUrl, updateCopertinaOptions)
            .then(res => {
                if(res.status === 200) {
                    console.log("Copertina cambiata con successo!");
                    refreshPage();
                }
            });
    }

    //Indirizzo
    const updateOptionsIndirizzo = {
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
        setIndirizzoEditable(false);
        setIndirizzoInputField(indirizzoInputField.split(";")[1])

        fetch(updateIndirizzoUrl, updateOptionsIndirizzo)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Indirizzo aggiornato con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Indirizzo non valido, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Numero
    const updateOptionsNumero = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'numero': numeroInputField
        })
    }

    const checkNumero = (numero) => {
        return numero.match(/^(([+]|00)39)?((3[1-6][0-9]))(\d{7})$/);
    }
    const checkNumeroFisso = (numero) => {
        return numero.match(/^((0{1}[1-9]{1,3})[\s|\.|\-]?(\d{6}))$/);
    }

    const updateNumero = () => {
        if(!checkNumero(numeroInputField) && !checkNumeroFisso(numeroInputField)) {
            props.showError("Errore! il numero non è valido, per favore riprova", 'form');
            return
        } 

        setNumeroEditable(false);

        fetch(updateNumeroUrl, updateOptionsNumero)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Numero aggiornato con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Numero non valido, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Intolleranze
    const updateOptionsIntolleranze = {
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

        fetch(updateIntolleranzeUrl, updateOptionsIntolleranze)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Intolleranze aggiornate con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Intolleranze non valide, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    const handleSelect = (e) => {
        setIntolleranzeInputField(Array.isArray(e) ? e.map(x => x.value) : []);
        console.log(intolleranzeInputField)
    }

    //Link menu
    const updateOptionsLinkMenu = {
        method: 'POST',
        headers: {
            'Authorization': props.accessToken,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'linkMenu': linkInputField
        })
    }

    const updateLinkMenu = () => {
        if(!checkLink(linkInputField)) {
            props.showError("Errore! il link non è valido, per favore riprova", 'form');
            return
        } 

        setLinkEditable(false);

        fetch(updateLinkMenuUrl, updateOptionsLinkMenu)
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Link menu aggiornato con successo!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Link menu non valido, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    
    const checkLink = (linkMenu) => {
        return linkMenu.match(/^(ftp|http|https):\/\/[^ "]+$/);
    }

    //Tavolo2
    const updateTavolo2 = () => { 
        setTavolo2Editable(false);
        setTavolo2InputField(document.getElementById("numericTavolo2").value);
        fetch(updateTavolo2Url, { method: 'POST',
                                headers: {
                                    'Authorization': props.accessToken,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    'tavolo2': document.getElementById("numericTavolo2").value
                                })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Disponibilità tavolo da 2 aggiornate!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Disponibilità non valide, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Tavolo5
    const updateTavolo5 = () => { 
        setTavolo5Editable(false);
        setTavolo5InputField(document.getElementById("numericTavolo5").value);
        fetch(updateTavolo5Url, {method: 'POST',
                                headers: {
                                    'Authorization': props.accessToken,
                                    'Content-Type': 'application/json'
                                },

                                body: JSON.stringify({
                                    'tavolo5': document.getElementById("numericTavolo5").value
                                })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Disponibilità tavolo da 5 aggiornate!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Disponibilità non valide, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    //Tavolo10
    const updateTavolo10 = () => { 
        setTavolo10Editable(false);
        setTavolo10InputField(document.getElementById("numericTavolo10").value);
        fetch(updateTavolo10Url, {method: 'POST',
                                headers: {
                                    'Authorization': props.accessToken,
                                    'Content-Type': 'application/json'
                                },

                                body: JSON.stringify({
                                    'tavolo10': document.getElementById("numericTavolo10").value
                                })})
            .then(res => {
                if(res.status === 200) {
                    props.showConfirm("Disponibilità tavolo da 10 aggiornate!", 'form');
                }
                if(res.status === 5020) 
                    props.showError("Disponibilità non valide, per favore riprova", 'form');
                if(res.status === 500)
                    props.showError("Errore server! Per favore riprova più tardi", 'form');;
            });
    }

    /* ------------------------------------------------------------------ */

     //RECENSIONI
     useEffect(() => {
        getRecensioni();
        console.log(props.accessToken)
    }, []);
    
    const getRecensionioptions = {
        method : 'POST',
        headers: { 
        'Authorization' : props.accessToken,
        'Content-Type': 'application/json'
        }
    }
   
    const getRecensioni = () => {
        fetch(getRecensioniUrl, getRecensionioptions)
            .then((res) => {
                if(res.status === 200) {
                res.json().then(result => setRecensioni(result));
                console.log("recensioni prese");
                }
            });
    }


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
                    <p className='property-title'>Nome ristorante</p>
                    <ul className="property-list">
                        {nomeEditable  
                            ? <input type="text" className='property-content-editable' value={nomeInputField} onChange={(e)=>setNomeInputField(e.target.value)} /> 
                            : <p className='property-content'> {nomeInputField} </p>
                        }
                        <div className="property-spacer" />
                            <p className="edit-button" onClick={() => setNomeEditable(!nomeEditable)}>{nomeEditable ? 'Cancella' : 'Modifica'}</p>
                            {nomeEditable === true && (
                                <div className='save-button' onClick={updateNome} > Salva </div>
                            )}
                    </ul>
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
                        {emailEditable === true && (
                             <div className='save-button' onClick={updateProfileInfo} > Salva </div>
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
                    <p className='property-title'>Descrizione</p>
                    <ul className="property-list">
                        {descrizioneEditable  
                            ? <input type="text" className='property-content-editable' value={descrizioneInputField} onChange={(e)=>setDescrizioneInputField(e.target.value)} /> 
                            : <p className='property-content'> {descrizioneInputField} </p>
                        }
                        <div className="property-spacer" />
                            <p className="edit-button" onClick={() => setDescrizioneEditable(!descrizioneEditable)}>{descrizioneEditable ? 'Cancella' : 'Modifica'}</p>
                            {descrizioneEditable === true &&(
                                <div className='save-button' onClick={updateDescrizione} > Salva </div>
                            )}
                    </ul>
                </div>

            

            <div className='property-container'>
                    <p className='property-title'>Immagine copertina</p>
                    <ul className="property-list">
                        {copertinaEditable  
                            ? <input ref={inputCopertina} type="file" className='property-content-editable' onChange={(e)=>handleOnChangeCopertina(e)} /> 
                            : <p className='property-content'> {getNameCopertina()} </p>
                        }
                        <div className="property-spacer" />
                            <p className="edit-button" onClick={() => setCopertinaEditable(!copertinaEditable)}>{copertinaEditable ? 'Cancella' : 'Modifica'}</p>
                            {copertinaEditable === true && (
                            <div className='save-button' onClick={updateCopertina} > Salva </div>
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
                                        />
                                    </form>
                                </div>
                            : <p className='property-content'> {indirizzoInputField} </p>
                        }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setIndirizzoEditable(!indirizzoEditable)}> {indirizzoEditable ? 'Cancella' : 'Modifica'} </p>
                        {indirizzoEditable === true && (
                            <div className='save-button' onClick={updateIndirizzo} > Salva </div>
                        )}
                    </ul>
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
                    {numeroEditable === true && (
                        <div className='save-button' onClick={updateNumero} > Salva </div>
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
                        {intolleranzeEditable === true && (
                            <div className='save-button' onClick={updateIntolleranze} > Salva </div>
                        )}
                </ul>
            </div>

            <div className='property-container'>
                <p className='property-title'>Menù link</p>
                <ul className="property-list">
                {linkEditable  
                    ? <input type="linkMenu" className="property-content-editable" value={linkInputField} onChange={(e)=>setLinkInputField(e.target.value)}/>
                    : <a href={linkInputField} className='property-content' style={{textDecoration:"none"}}> {linkInputField} </a>
                }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setLinkEditable(!linkEditable)}>{linkEditable ? 'Cancella' : 'Modifica'}</p>
                        {linkEditable === true && (
                            <div className='save-button' onClick={updateLinkMenu} > Salva </div>
                        )}
                </ul>
            </div>

            <div className='property-container'>
                <p className='property-title'>Tavolo da 2</p>
                <ul className="property-list">
                {tavolo2Editable  
                    ? <NumericInput min={0} max={100} value={0} id="numericTavolo2"/>
                    : <p className='property-content'> {tavolo2InputField} </p>
                }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setTavolo2Editable(!tavolo2Editable)}>{tavolo2Editable ? 'Cancella' : 'Modifica'}</p>
                        {tavolo2Editable === true && (
                            <div className='save-button' onClick={updateTavolo2} > Salva </div>
                        )}
                </ul>
            </div>

            <div className='property-container'>
                <p className='property-title'>Tavolo da 5</p>
                <ul className="property-list">
                {tavolo5Editable  
                    ? <NumericInput min={0} max={100} value={0} id="numericTavolo5"/>
                    : <p className='property-content'> {tavolo5InputField} </p>
                }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setTavolo5Editable(!tavolo5Editable)}>{tavolo5Editable ? 'Cancella' : 'Modifica'}</p>
                        {tavolo5Editable === true && (
                            <div className='save-button' onClick={updateTavolo5} > Salva </div>
                        )}
                </ul>
            </div>

            <div className='property-container'>
                <p className='property-title'>Tavolo da 10</p>
                <ul className="property-list">
                {tavolo10Editable  
                    ? <NumericInput min={0} max={100} value={0} id="numericTavolo10"/>
                    : <p className='property-content'> {tavolo10InputField} </p>
                }
                        <div className="property-spacer" />
                        <p className="edit-button" onClick={() => setTavolo10Editable(!tavolo10Editable)}>{tavolo10Editable ? 'Cancella' : 'Modifica'}</p>
                        {tavolo10Editable === true && (
                            <div className='save-button' onClick={updateTavolo10} > Salva </div>
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
            />

        <div className='property-container'>
            <p className="property-title"> Recensione </p>
                <TableContainer component={Paper} style={{borderRadius:"10px", maxHeight:"450px", maxWidth:"97%"}}>
                    <Table >
                    <TableHead style={{border: "1px solid black"}}>
                        <TableRow>
                            <TableCell > Recensione </TableCell>
                            <TableCell > Voto </TableCell>
                            <TableCell > Cliente </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{backgroundColor:"lightgray" , border: "1px solid black"}}>
                    {recensioni?.map((recensione) => (
                        <TableRow
                            id="prenotazione"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell > {recensione.recensione} </TableCell>
                            <TableCell>{recensione.voto}</TableCell>
                            <TableCell >{recensione.utente}</TableCell>
                        </TableRow>
                    ))} 
                    </TableBody>
                    </Table>
                </TableContainer>
        </div>

        
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

const ProfiloRistoratore = (props) => {
    const navigate = useNavigate();
    const [passwordEditable, setPasswordEditable] = useState(false);
    const [formErrorLabelActive, setFormErrorLabelActive] = useState(false);
    const [popupErrorLabelActive, setPopupErrorLabelActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formConfirmLabelActive, setFormConfirmLabelActive] = useState(false);
    const [popupConfirmLabelActive, setPopupConfirmLabelActive] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");


    useEffect(() => {
        window.scrollTo(0, 0);
        
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
                           showConfirm = {showConfirm}
                           showResultPopup={props.showResultPopup}
                        />
                        
                        <AccountInfo 
                            user={props.userLogged}
                            passwordEditable={passwordEditable}
                            enablePasswordEdit={enablePasswordEdit}
                            disablePasswordEdit = {disablePasswordEdit}
                            accessToken={props.accessToken}
                            fetchProfile={props.fetchProfile}
                            showResultPopup={props.showResultPopup}
                            ristoratore={props.ristoratore}

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
        </div>
    );
}

export default ProfiloRistoratore;
