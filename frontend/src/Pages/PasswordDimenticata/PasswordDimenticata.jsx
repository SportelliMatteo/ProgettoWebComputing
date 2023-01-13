import React, { useEffect, useState, useRef } from 'react'
import './PasswordDimenticata.css';
import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar';
import { useNavigate } from "react-router-dom";

export default function Login(props) {

    const navigate = useNavigate();

    const resetAddress = `http://${address}:8080/forgotpassword`;

    const [errorLabelActive, setErrorLabelActive] = useState(false);
    const [errorLabelText, setErrorLabelText] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState("");

    const resetOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email' : email,
        }),
    };

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Mail sent !");
            navigate("/login");
        }
        else {
            console.log("error");
            res.json().then(result => console.log(result));
        }

        setButtonDisabled(false);
    }

    const resetPassword = () => {
        if(!checkEmailField())
            return;

        setTimeout(() => setButtonDisabled(false), 5000);

        fetch(resetAddress, resetOptions)
            .then(res => parseResponse(res));
    }

    const checkEmailField = () => {
        if(email === "") {
            showError("Email cannot be empty, please check again!");
            return false;
        }
  
        if (!email.match(/^[a-zA-Z0-9\\.]+@[a-z]+[\\.]{1}[a-z]+$/)) {
            showError("The email is not valid, please check again!");
            return false;
        }

        return true;
    }

    const getErrorLabelClassname = () => {
        if(errorLabelActive)
            return "error-label label-active";
        else
            return "error-label";
    }

    const showError = (msg) => {
        setErrorLabelActive(true);
        setErrorLabelText(msg);
        setTimeout(() => setErrorLabelActive(false), 3500);
    }
   
  return (
    <div class="passwordDimenticata">
        <div class="column-1 box1">
        <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Password dimenticata</h3>
            
            
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="mariorossi@esempio.it"
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <div type="submit" className="button"  style={{backgroundColor: "#854D27", border:"none"}} onClick={resetPassword}>
                RECUPERA PASSWORD
              </div>
              <p className="text-center mt-2">
              Hai ricordato la password? <Link to="/login" style={{textDecoration:"none"}}>Login</Link>
            </p>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}