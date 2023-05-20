import React, { useEffect, useState, useRef, Component } from "react";

import { Link } from 'react-router-dom';


import * as s from "./styles/globalStyles";

import 'bootstrap/dist/css/bootstrap.min.css';








class Home extends Component {

  render() {
    const styleH2Top = {
      backgroundColor: "#1b1e22",
      color: "#FFF",
      minWidth: '100%', height: "40px", width: '100%', textAlign: 'left', marginTop: '0px', top: '0px',

    }

    return (

      <s.Screen >
        <h2 style={styleH2Top}>

          <div style={{ marginLeft: 20, padding: 10, fontFamily: 'Press Start 2P' }} class="pressStart">justinjireh</div></h2>
        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: 24, backgroundColor: "var(--primary)", alignItems: 'center', alignContent: 'center' }}
          image={"./config/images/abertura_bk.png"}
        >
          <div align="center" style={{width:'100%', alignContent:'center', alignItems:'center'}}>
            
            <div class="col-md-12 divIcone"  >
            <img className="welcome" src="./config/images/icone_welcome.png" style={{maxWidth:'80%'}} ></img>
            </div>
            
          </div>
          <div class="row" >
            
            <div class="col-md-12" align="center">
            <Link to='Site' >
              <img src="./config/images/welcome.png" style={{maxWidth:'30%'}} ></img>
            </Link>
            </div>
            
          </div>

        </s.Container>


      </s.Screen>

    );
  }
}

export default Home;
