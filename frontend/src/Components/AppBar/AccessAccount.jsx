import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar';
import "./AppBar.css";

const logInLink = `http://${address}:8080/login`;

export default function AccessAccount(props) {
    return (
        <ul style={{padding:"0px", marginLeft:"20px", marginRight:"20px", marginTop:"10px"}}>
                <Link className='nav-link' to="/login" onClick={props.handleCloseUserMenu}>      
                    <p>Accedi</p>
                </Link>
                <Link className='nav-link' to="/signup" onClick={props.handleCloseUserMenu}>
                    <p>Registrati</p>
                </Link>
        </ul>
    );
}
