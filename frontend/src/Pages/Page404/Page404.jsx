import React, {useEffect} from 'react';
import './Page404.css'
import { Link } from 'react-router-dom'

const Page404 = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="page404"> 
      <div className="paper-gray">
        <div style={{paddingTop:'20px'}} />
        <div className="img-container">
          <img src={require("../../Images/error404.jpg")} alt="404 image" className="img404" />
        </div>
        <div className="home-btn-div">
          <p className='buttonContainer' >
            <button className="buttonHome" ><Link to="/" className='linkButton'>Torna alla home</Link></button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page404;
