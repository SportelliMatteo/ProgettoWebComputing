import React from 'react'
import { Link } from 'react-router-dom'
import './AppBar.css';
import { address } from '../../assets/globalVar';
import { useNavigate } from "react-router-dom";

const tipologiaLink = `http://${address}:8080/tipologia`;

export default function Account(props) {

    const navigate = useNavigate();

    const fetchTipologia = () => {
        fetch(tipologiaLink, loggedAccountOptions)
            .then(res => parseResult(res));
    }

    const loggedAccountOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        'username': props.user.username,
        }),
    };

    function parseResult(res) {
        if(res.status === 201) {
          navigate("/profilo");
        }else if(res.status === 202){
          navigate("/profiloRistoratore");
        }else if(res.status === 200){
          navigate("/");
        }
    }

    const fetchTipologiaAndCloseMenu = () => {
        fetchTipologia();
        props.handleCloseUserMenu();
    }

    return (
        <ul style={{padding:"0px", marginLeft:"20px", marginRight:"20px", marginTop:"10px"}}>
            <ul style={{padding:"0px"}}>
                <p><b><i>{props.user.username} </i></b></p>
            </ul>
            
            <ul style={{cursor: 'pointer', padding:"0px"}} onClick={fetchTipologiaAndCloseMenu} username={props.user.username}>     
                <p>Profilo</p>
            </ul>
        
            <ul onClick={props.doLogout} className='nav-link' >
                <Link to="/" className='nav-link' onClick={props.handleCloseUserMenu}>   
                    <p>Esci</p>
                </Link>
            </ul>
            

        </ul>

    );
}
