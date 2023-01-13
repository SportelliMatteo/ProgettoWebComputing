import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { address } from '../../assets/globalVar'

const options = [
    { value: 'Cliente', label: 'Cliente' },
    { value: 'Ristoratore', label: 'Ristoratore' },
  ]


function ChooseUsername(props) {
    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorLabelText, setErrorLabeltext] = useState(false);
    const [nomeRegistrazione, setNomeRegistrazione] = useState("Nome:");


    const inputValue = useRef(null);

    const parseLabel = (text) => {
        const len = text.length;
    }

    const showError = (msg) => {
        setErrorLabeltext(msg);
        setErrorLabelActive(true);

        if(inputValue.current !== null) {
            inputValue.current.style.border = "2px solid red";
        }
    }

    const removeErrorLabel = () => {
        setErrorLabelActive(false);

        if(inputValue.current !== null) {
            inputValue.current.style.border = "2px solid transparent";
        }
    }

    //se cambia lo status code, controllo se devo mostrare errore
    useEffect(() => {
        if(props.status === 5020)
            showError("L'username non è valido!");
        else if(props.status === 5000)
            showError("Errore server, perfavore riprova!");
        else
            setErrorLabelActive(false);

    }, [props.status]);

    function handleSelect(data){
        console.log(data.value);
        props.setTipologiaGoogle(data.value);
        if(data.value == "Ristoratore"){
            setNomeRegistrazione("Nome ristorante: ");
        }else{
            setNomeRegistrazione("Nome: ");
        }
      }

    return (
        <div className="chooseDataContainer">
            <div className="chooseData">
            <h3 style={{textAlign:"center", color: "#c5cfdb", marginBottom:"-10px", marginTop:"40px", fontWeight: "800"}}>Crea account google</h3>
                <label className="tipologiaUtente">Tipologia utente: </label>
                <Select options={options} placeholder="Tipologia utente..." onChange={handleSelect} isSearchable={true}/>
        
                    <label className="tipologiaUtente"> {nomeRegistrazione} </label>
                    <input ref={inputValue} className="form-control mt-1" type="text" placeholder="Mario Rossi"
                        onClick={removeErrorLabel}
                        onChange={(ev) => { parseLabel(ev.target.value); props.setNomeGoogle(ev.target.value); }}/>
                    
                    <label className="tipologiaUtente">Username: </label>
                    <input ref={inputValue} className="form-control mt-1" type="text" placeholder="mariorossi"
                        onClick={removeErrorLabel}
                        onChange={(ev) => { parseLabel(ev.target.value); props.setGoogleUsername(ev.target.value); props.setCliente(ev.target.value); props.setRistoratore(ev.target.value);}}/>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <label >Caratteri 0/25</label>
                    {errorLabelActive && (<p className="error-label-create-portfolio">{errorLabelText}</p>)}
                    </div>
                    
                    
                    <div style={{display:"flex", flexDirection:"column", alignItems:"left"}}>   
                        <div type="submit" className="button"  style={{backgroundColor: "#854D27", border:"none", marginBottom:"10px", marginTop:"10px"}} onClick={props.onConfirm}>
                            CREA ACCOUNT
                        </div>
                        <div type="submit" className="button"  style={{backgroundColor: "#854D27", border:"none"}} onClick={props.onCancel}>
                            CANCELLA
                        </div>
                    </div>

            </div>
        </div>    
    );
}

export default ChooseUsername;