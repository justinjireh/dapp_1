import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import Carousel from 'react-bootstrap/Carousel';
import Dock from "./components/dock";
import Modal from 'react-modal';
import { Draggable } from 'drag-react';
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalBody, ModalHeader } from "react-modal";

// Código necessário para os recursos de acessibilidade
Modal.setAppElement('#root');

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
export const Button = styled.button`
  padding: 10px;
  border: none;
  padding: 10px;
  font-weight: bold;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;



export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;





function Site() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Looks like rain...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
    .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      
.once("error", (err) => {
        console.log(err);
        setFeedback("hmmm?");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Check out your art on Paintswap!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };
  
  


  var width = window.innerWidth;

  function handleWindowSizeChange() {
    width = window.innerWidth;
  }




  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);



  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = (width <= 768);


  const [roadMapIsOpen, setRoadMapIsOpen] = React.useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [cloudIsOpen, setCloudIsOpen] = React.useState(false);
  const [mintIsOpen, setMintIsOpen] = React.useState(false);
  const [TwOpen, setTwOpen] = React.useState(false);
  const [fantomIsOpen, setFantomIsOpen] = React.useState(false);

  // Função que abre a modal

  var abrirModal = () => {
    setIsOpen(true);

  }
  var abrirTwitter = () => {
    setTwOpen(true);
  }
  var abrirRoadMap = () => {
    setRoadMapIsOpen(true);
  }
  var abrirCloud = () => {
    fecharMint();
    setCloudIsOpen(true);

  }
  var abrirMint = () => {
    setMintIsOpen(true);
  }
  var abrirFantom = () => {
    setFantomIsOpen(true);
  }

  // Função que fecha a modal
  var fecharTwitter = () => {


    setTwOpen(false);


  }
  var fecharModal = () => {


    setIsOpen(false);


  }
  var fecharCloud = () => {


    setCloudIsOpen(false);


  }
  var fecharMint = () => {


    setMintIsOpen(false);


  }
  var fecharFantom = () => {


    setFantomIsOpen(false);


  }
  var fecharRoadMap = () => {


    setRoadMapIsOpen(false);


  }
  const styleH2 = {
    backgroundColor: "#1b1e22", color: "#FFF", minWidth: '100%', height: "35px", width: '100%', textAlign: 'left',
    marginTop: '0', top: '0px', left: '0px', marginLeft: '0px', paddingTop: '8px', fontFamily: 'Press Start 2P', paddingLeft: '1%',
    position: 'fixed', verticalAlign: 'middle', zIndex: '10000',

  }
  const styleH2Rodape = {
    backgroundColor: "#1b1e22", color: "#FFF", minWidth: '100%', height: "35px", width: '100%', textAlign: 'left',
    bottom: '0px', left: '0px', marginLeft: '0px', paddingBottom: '0px', fontFamily: 'Press Start 2P', paddingLeft: '1%',
    position: 'fixed', verticalAlign: 'middle',

  }
  const styleH2Top = {
    backgroundColor: "#1b1e22",
    color: "#FFF",
    minWidth: '100%', height: "40px", width: '100%', textAlign: 'left', marginTop: '0px', top: '0px',

  }
  const styleImgAbout = {
    maxWidth: '100%',

    height: 'auto',
  }
  const styleMint = {
    textAlign: 'center', maxWidth: '70%'
  }
  const styleParagraphAbout = {
    display: 'block', minWidth: '100%', flex: 1,
  }

  const styleRightAbout = {
    backgroundColor: '#d68fb', 'font-family': 'Jost',
  }

  const ImageMedio = {
    left: '50%', width: '20%', maginLeft: '-15%',

  }


  const divShadow = {
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.4)",
    marginTop: "5px",
    border: "1px solid #999"
  }

  const logoMenor = {
    maxWidth: '100%',
  }

  const fantomCSS = {
    content: {
      textAlign: 'center',
      borderRadius: '0',
      width: '70%',
      padding: '0',
      position: 'relative',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    }

  }

  const shadow = {
    content: {
      textAlign: 'center',
      borderRadius: '0',
      width: '80%',
      left: '50%',
      marginLeft: '-40%',
      padding: '0',
      maxHeight: '90%',
      position: 'relative',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    }

  }
  const modalStyle = {
    content: {
      padding: '0',
      left: '50%',
      right: 'auto',
      minWidth: '40%',
      top: '35%',
      height: '80%',
      marginRight: '-50%',
      overflow: 'hidden',
      transform: 'translate(-50%, -30%)',
      border: '6px solid #1b1e22',
      boxShadow: 'rgba(0, 0, 0, 0.60) 0px 8px 12px',
    },

  }


  const modalStyleFantom = {
    content: {
      padding: '0',
      left: '50%',
      right: 'auto',
      minWidth: '40%',
      top: '35%',
      marginRight: '-50%',
      maxHeight: '60%',
      overflow: 'hidden',
      transform: 'translate(-50%, -30%)',
      border: '6px solid #1b1e22',
      boxShadow: 'rgba(0, 0, 0, 0.60) 0px 8px 12px',
    },

  }

  const modalStyleCloud = {
    content: {
      padding: '0',
      left: '50%',
      right: 'auto',
      minWidth: '70%',
      top: '35%',
      height: '80%',
      marginRight: '-50%',
      overflow: 'hidden',
      transform: 'translate(-50%, -30%)',
      border: '6px solid #1b1e22',
      boxShadow: 'rgba(0, 0, 0, 0.60) 0px 8px 12px',
    },

  }
  const interests = {
    backgroundColor: '#669aac',
  }
  const Button = styled.button`
  width: 90%;
  background-color: #ddd;
  border: 2px solid #000;
  border-radius: 3px;
  padding: 5px;
  box-shadow: 2px 2px 0px #000;
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    background-color: rgba(255,255,255,0.5);
    height: 100%;
    width: 3em;
    display: block;
    position: absolute;
    top: 0;
    left: -4.5em;
    transform: skewX(-45deg) translateX(0);
    transition: none;
  }
  &:hover {
    background-color: #2194E0;
    color: #fff;
    border-bottom: 4px solid darken(#2194E0, 10%);
    &:before {
      transform: skewX(-45deg) translateX(32em);
      transition: all 0.5s ease-in-out;
    }
  }
`;

const StyledButton = styled.button`
  width: 90%;
  background-color: #ddd;
  border: 2px solid #000;
  border-radius: 3px;
  padding: 5px;
  box-shadow: 2px 2px 0px #000;
  position: relative;
  overflow: hidden;
  color: #000; /* Add this line to set the font color to black */

  &:before {
    content: "";
    background-color: rgba(255,255,255,0.5);
    height: 100%;
    width: 3em;
    display: block;
    position: absolute;
    top: 0;
    left: -4.5em;
    transform: skewX(-45deg) translateX(0);
    transition: none;
  }

  &:hover {
    background-color: #ffffff;
    color: #fff;
    border-bottom: 4px solid darken(#ffffff, 10%);

    &:before {
      transform: skewX(-45deg) translateX(32em);
      transition: all 0.5s ease-in-out;
    }
  }
`;


const SheenAnimation = styled.div`
  @keyframes sheen {
    0% {
      transform: skewY(-45deg) translateX(0);
    }
    100% {
      transform: skewY(-45deg) translateX(12.5em);
    }
  }
`;



const ConnectButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <p className="Arial" style={{ margin: "0", fontSize: "12px" }}>
        CONNECT TO MINT.
      </p>
      <SheenAnimation></SheenAnimation>
    </Button>



    
  );
};


  var funcoes = [abrirModal, fecharModal, abrirRoadMap, fecharRoadMap, abrirMint, fecharMint, abrirFantom, fecharFantom, abrirTwitter, fecharTwitter]

  return (
    <s.Screen >
      <h2 style={styleH2Top}>

        <a href="/" target="_self" style={{ textDecoration: 'none', color: '#fff' }}><div style={{marginTop: '4px', marginLeft: 20, padding: 10, fontFamily: 'Press Start 2P' }} className="pressStart">justinjireh</div></a></h2>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={"./config/images/bg.png"}
      >


      </s.Container>




      <Modal
        isOpen={modalIsOpen}
        onRequestClose={fecharModal}
        contentLabel="About Me"

        className="telaAbout"


      >
        <h2 style={styleH2} className="pressStart" >About Me!
          <button onClick={fecharModal} className="pressStart botaoFechar">
            X
          </button>
        </h2>
        <div className="quadroAbout">
          
          <div className="row">
            <div className="col-md-3" align="center" style={{ padding: '20px', paddingTop: '25px' }}>
              <img src="./config/images/ME copy 2.jpg" style={styleImgAbout}></img>
            </div>
            <div className="col-md-9" style={{ paddingTop: '4%' }}>
              <div className='row'>
                <div className="col-md-12">
                  <p className="Alice tamanho16" style={{ fontSize: 18, fontWeight: 'bold' }}>Human Being. Man of Adventure. Chronic Daydreamer. </p>
                </div>
              </div>
              <div className='row' style={{ marginTop: '10px' }}>

                <div className="col-md-11" style={{ textAlign: 'justify' }}>
                  <p className="Alice tamanho16 linha30" >
I am an artist and web designer, dabbling in all arts and mediums that inspire me and allow me to communicate my ideas and emotions. I am constantly exploring new ways to push my creativity and skills. Currently I am stumbling my way through the exciting world of web3. I don't have much of a road map at the moment except to make art and continue my journey to discover new possibilities of how I can creatively build, meet people and grow in web3 space.</p>
                </div>

              </div>
            </div>
          </div>
          <div className="row">
            <div className='col-md-12 interests' >
              <h2 >Justin’s Interests</h2>
            </div>
          </div>

          <div className="row " style={{ textAlign: 'justify', marginTop: '6px', display: isMobile ? 'none' : 'block' }}>
            <div className="col-md-12">
              <table >
                <tbody>
                  <tr>
                    <td className ="col-md-3   leftAbout">
                      <p className="Cormorant white light700" style={{wordWrap:"break-word"}} >General</p>
                    </td>
                    <td className="col-md-9 rightAbout">
                      <p className='Cormorant white light500 '>Here is a list of things I've often liked...</p>
                      <p className='Cormorant white light500 linha30'>visual expressions of emotion. purposeful aesthetic arrangements. fantom network. altered states. NFTs. harmonious color palettes. learning to code and develop. music. web3. light. mood. atmosphere. patterns. shapes. print. textures. nintendo. crypto. color wheels. refracted light. rainy days. travel. lofi hiphop. seamlessly looping GIFs. chromatic aberration. cartography. light leaks. typography. the play between order and chaos in glitch art. pantone swatches. the texture of rag paper. lighting scenes. vintage camera lenses. vaporwave aesthetic. transferring intangible ideas onto tangible surfaces. caffeine. traveling astral planes. existentially thinking.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-md-3 leftAbout">
                      <p className="Cormorant white light700">Software</p>
                    </td>
                    <td className="col-md-9 rightAbout">
                      <p className="Cormorant white light500 ">HERE IS A LIST OF SOFTWARE I LIKE TO USE...</p>
                      <p className="Cormorant white light500 linha30">Photoshop. Illustrator. Premiere. After Effects. Lightroom. Blender. ArcGis. MS Paint. </p></td>
                  </tr>
                  <tr>
                    <td className="col-md-3 leftAbout">
                      <p className="Cormorant white light700">Languages:</p>
                    </td>
                    <td className="col-md-9 rightAbout">
                      <p className="Cormorant white light500 ">English. Português. Español</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="col-md-3 leftAbout">
                      <p className="Cormorant white light700">Zodiac Sign:</p>
                    </td>
                    <td className="col-md-9 rightAbout">
                      <p className="Cormorant white light500 ">Leo</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row " style={{ display: isMobile ? 'block' : 'none' }}>
  <div className="col-md-6">
    <div className="row top5 left5" style={{ marginTop: '5px' }}>
      <div className="leftAbout">
        <p className="Jost white">General</p>
      </div>
      <div className="col-md-6 rightAbout">
        <p className="Cormorant tamanho18 break-word">Here is a list of things I've often liked...</p>
        <p className="Cormorant tamanho18 linha30 break-word">visual expressions of emotion. purposeful aesthetic arrangements. fantom network. altered states. NFTs. harmonious color palettes. learning to code and develop. music. web3. light. mood. atmosphere. patterns. shapes. print. textures. nintendo. crypto. color wheels. refracted light. rainy days. travel. lofi hiphop. seamlessly looping GIFs. chromatic aberration. cartography. light leaks. typography. the play between order and chaos in glitch art. pantone swatches. the texture of rag paper. lighting scenes. vintage camera lenses. vaporwave aesthetic. transferring intangible ideas onto tangible surfaces. caffeine. traveling astral planes. existentially thinking.</p>
      </div>
  


              
              </div>
              <div className="row top5 left5" style={{ marginTop: '5px' }}>
                <div className="col-md-3  leftAbout">
                  <p className="Jost white">Software</p>
                </div>
                <div className="col-md-9 rightAbout">
                  <p className="Cormorant  tamanho18 ">HERE IS A LIST OF SOFTWARE I LIKE TO USE...</p>
                  <p className="Cormorant  tamanho18 linha30">Photoshop. Illustrator. Premiere. After Effects. Lightroom. Blender. ArcGis. MS Paint. </p>
                </div>
              </div>
              <div className="row top5 left5" style={{ marginTop: '4px' }}>
                <div className="col-md-3 leftAbout">
                  <p className="Jost white">Languages:</p>
                </div><div className="col-md-9 rightAbout">
                  <p className="Cormorant  tamanho18 ">English. Português. Español</p>
                </div>
              </div>
              <div className="row top5 left5" style={{ marginTop: '3px' }}>
                <div className="col-md-3 leftAbout">
                  <p className="Jost white">Zodiac Sign:</p>
                </div>
                <div className="col-md-9 rightAbout">
                  <p className="Cormorant  tamanho18 ">Leo</p>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={TwOpen}
        onRequestClose={fecharTwitter}
        contentLabel=" X !"

        className="telaTwitter"


      >
        <h2 style={styleH2} className="pressStart" > X !

          <button onClick={fecharTwitter} className="pressStart botaoFechar">
            X
          </button>

        </h2>
        <div className="quadroTwitter">
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-3"></div>
            <div className="col-md-6" style={{ textAlign: 'center' }}>
              <p style={styleParagraphAbout}>Always feel free to reach out!"</p>
              <Button
  style={{
    width: "100%",
    backgroundColor: 'rgb(192, 192, 192)',
    border: '2px solid rgb(0, 0, 128)',
    borderRadius: '10px',
    marginTop: '30px',
    boxShadow: 'inset 1px 1px rgb(255, 255, 255), inset -1px -1px rgb(0, 0, 0)',
    color: 'rgb(0 0 0)',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  }}
  onClick={(e) => {
    window.open('https://twitter.com/justinjireh', 'new');
  }}
>
  ENTER X!
</Button>






            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={mintIsOpen}
        onRequestClose={fecharMint}
        contentLabel="Little Clay Cloud!"
        className="telaCloud"
      >
        <h2 style={styleH2} className="pressStart handle">Little Clay Cloud!

          <button onClick={fecharMint} className="pressStart botaoFechar">
            X
          </button>
        </h2>
        <div className="quadroCloud" >
          <div className="row"></div>
          <div className="row" style={{ marginTop: '10px' }} >
            <div className="col-md-7">
              <div className="row">
                <div className="col-md-1"></div>
                <div className="col-md-11" align="center">

                  <img src="./config/images/banner.png" style={{ marginTop: '20px', maxWidth: '100%' }} ></img>
                </div>

              </div>
              <div className="row" style={{ marginTop: '90px' }}>
                <div className="col-md-1"></div>
                <div className="col-md-11" align="center">

                  <p style={{ textAlign: 'justify', fontSize: '24px' }} className="specialElite lcc linha30">Tut tut, it looks like rain...</p>
                </div>

              </div>
              <div className="row" style={{ marginTop: '20px' }}>
  <div className="col-md-1"></div>
  <div className="col-md-11" align="center">
    <p style={{ textAlign: 'left', fontSize: '25px', lineHeight: '1.2' }} className="Alice lcc linha30">
      Welcome to the childish world of my imagination where each piece of the Little Clay Cloud collection is a unique creation, molded from clay and brought to life by photographing them under studio lighting. Processed digitally. Made with love.
    </p>
  </div>
</div>


            </div>
            <div className="col-md-5">
              <div className="row" style={{ height: '100%', overflow: 'visible' }}>

                <div className="col-md-12" align="center">
                  <img src="./config/images/littleclaycloud_gateway.png" className="img-fluid"></img>
                </div>

                <div className="col-md-12" align="center">
               <Button style={{
  width: "90%",
  background: "linear-gradient(-45deg, #ffc9de, #fdd97c, #fbfdaa, #c1f0b2, #b2e4f0, #d6b2f0)",
  backgroundSize: "100% 100%",
  border: "2px solid #000",
  borderRadius: "14px",
  padding: "20px",
  textShadow: "2px 2px 2px rgba(0,0,0,0.5)",
  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.8)"
}} onClick={abrirCloud}>
   <p className="pressStart" style={{ margin: "0", fontSize: "22px"  }}>ENTER</p>
</Button>

</div>





              </div>
              {isMobile ? (
                      <>
      <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            </>
            ):''}
            </div>

          </div>



        </div>

      </Modal>




      <Modal
        isOpen={fantomIsOpen}
        onRequestClose={fecharFantom}
        contentLabel="Little Clay Fantom"
        className="telaModalFantom"
      >

        <h2 style={styleH2} className="pressStart handle">Little Clay Fantom!

          <button onClick={fecharFantom} className="pressStart botaoFechar">
            X
          </button>
        </h2>

        <div className="quadroFantom" >
          <div className="row" style={{ marginTop: '40px' }}>
            <div className="col-md-6">

              <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-10'>
                  <p style={{ textAlign: 'center' }} className="specialElite  linha30">Evoked from the hauntingly ethereal realm of the imagination, these spooky little fantoms are part of a NFT collection which was handmade with clay. 100 Pieces.</p>
                  <p style={{ textAlign: 'center' }} className="specialElite  linha30">
                    This collection was handmade from clay, photographed in studio lighting, digitally retouched then ran through generative software. </p>



                </div>
                <div className='col-md-1'>

                </div>
              </div>

              <div style={{ display: !isMobile ? 'block' : 'none', }}>
                <div className="row"  >
                  <div className="col-md-2" >
                    <a href="https://paintswap.finance/marketplace/fantom/collections/little-clay-fantom" target="new">
                      <img src="./config/images/paintswap_gif.gif" className="paintSwapLogo" ></img></a>
                  </div>
                  <div className="col-md-8 " align='center'>
                    <p style={{ textAlign: 'center', fontSize: 'smaller' }} className="pressStart linha30">
                      Created on Fantom</p>
                    <p style={{ textAlign: 'center', fontSize: 'smaller' }} className="pressStart linha30">
                      Available on Paintswap</p>
                  </div>
                  <div className="col-md-2" style={{ padding: 0 }}>
                    <a href="https://fantom.foundation/" target="new" >
                      <img src="./config/images/fantom_logo_gif.gif" className="fantomLogo"></img></a>
                  </div>
                </div>
              </div>
              <div style={{ display: isMobile ? 'block' : 'none' }}>
                <div className="row" >
                  <div className="col-md-12" align="center" >
                    <a href="https://paintswap.finance/marketplace/fantom/collections/little-clay-fantom" target="new" style={{ float: 'left' }}>
                      <img src="./config/images/paintswap_gif.gif" style={{ maxWidth: '50px' }}></img></a>

                    <div className="textoFantom" align="center">
                      <p style={{ textAlign: 'center', fontSize: 'smaller' }} className="pressStart linha30">
                        Created on Fantom</p>
                      <p style={{ textAlign: 'center', fontSize: 'smaller' }} className="pressStart linha30">
                        Available on Paintswap</p>
                    </div>
                    <a href="https://fantom.foundation/" target="new" style={{ float: 'right' }} >
                      <img src="./config/images/fantom_logo_gif.gif" style={{ maxWidth: '50px' }}></img></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">

              <div className="col-md-10">

                <img src="./config/images/fantom.gif" style={{ width: '100%' }}></img>
              </div>
              <div className="col-md-2"></div>

            </div>
          </div>
          {isMobile ? (
                      <>
      <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            </>
            ):''}
        </div>
      </Modal>
      <Draggable handle=".handle">
      <Modal
        isOpen={cloudIsOpen}
        onRequestClose={fecharCloud}
        contentLabel="Cloud"

        className="telaModal"
      >
        <div style={{ display: !isMobile ? 'block' : 'none', }}>
          <div className="row handle" style={{ zIindex: 10000, maxWidth: '100%', margin: 0, padding: 0 }}>
            <div className="col-md-6" style={{ backgroundColor: "#1b1e22" }} >

            <h2 style={styleH2} className="pressStart handle">Little Clay Cloud!

            </h2>
          </div>
          
            <div className="col-md-6" style={{ backgroundColor: "#1b1e22", paddingTop: '8px' }} >


              <button onClick={fecharCloud} className="pressStart botaoFechar botaoMint2">
                X
              </button>
             
            </div>
          </div>
        </div>
        <div style={{ display: isMobile ? 'block' : 'none', }}>
          <div className="row" style={{ zIindex: 10000, maxWidth: '100%', margin: 0, padding: 0, height: '50px' }}>
            <div className="col-md-12" style={{ backgroundColor: "#1b1e22" }} >

<img src="./config/images/cll.png" style={{ float: 'left', maxHeight: '50px', maxWidth: '50%', marginTop: '20px', marginBottom: '5px' }} />

<button onClick={fecharCloud} className="pressStart botaoFechar botaoMint" >
  X
</button>
              


            </div>

          </div>
        </div>
        <div className="quadroMint">
          <div className="row ">
            <div className="col-md-5 janela" style={divShadow}>
              <div className="row">

                <div className="col-md-12" align="center">
                  <img src="./config/images/banner.png" style={{ maxWidth: '90%' }} ></img>
                </div>

                </div>
                <div className="row">
  <div className="col-md-12">
    <p style={{ 
      textAlign: 'center',
      fontFamily: 'Alice, sans-serif', 
      fontSize: '18px'
    }} className="Alice  linha30 tamanho20">Conjured up from the condensing of energies throughout the Fantom blockchain, these Little Clay Clouds show a wide range of emotions and exhibit curious precipitation patterns.</p>
  </div>
</div>

              <div className="row" style={{ marginTop: '20px' }}>
  <div className="col-md-12">
    <p style={{ textAlign: 'center', fontSize: '21px' }} className="specialElite  linha30  tamanho16">555 Pieces.</p>
  </div>
        </div>
              <div className="row" style={{ marginTop: '0px' }}>
  <div className="col-md-12">
    <p style={{ textAlign: 'center', fontSize: '21px' }} className="specialElite  linha30  tamanho16"> 20 Animated Pieces.</p>
  </div>

              </div>
              <div className="row">
                <div className="col-md-12">
                <p style={{ textAlign: 'center', fontSize: '21px' }} className="specialElite  linha30  tamanho20">100+ Attributes.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                <p style={{ textAlign: 'center', fontSize: '21px' }} className="specialElite  linha30  tamanho20">Extra Rare Pieces.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 pressStart linha30">
                  
               <ResponsiveWrapper flex={1} style={{ padding: 5 }} >

                    <s.Container
                      flex={2}
                      jc={"center"}
                      ai={"center"}
                    >


<s.TextTitle
                        style={{
                          fontFamily: 'Alice',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'none',
    color: 'black'
                        }}
                      >
                        {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                      </s.TextTitle>

                      
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          color: "#32c9f4",
                        }}
                      >
                       <StyledLink
  target={"_blank"}
  href={CONFIG.SCAN_LINK}
  style={{
    color: '#1b1e22',
  }}
>
  {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
</StyledLink>
                      </s.TextDescription>

                      {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                        <>
                          <s.TextTitle
                            style={{ fontSize: 15, textAlign: "center", color: "#1b1e22" }}
                          >
                            It rains here no more. 
                          </s.TextTitle>
                          <s.TextDescription
                            style={{ fontSize: 10, textAlign: "center", color: "#1b1e22" }}
                          >
                            You can still find {CONFIG.NFT_NAME} on
                          </s.TextDescription>

                          <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                            {CONFIG.MARKETPLACE}
                          </StyledLink>
                        </>
                      ) : (
                        <>
                          <s.TextTitle
                            style={{ fontSize: 14, textAlign: "center", color: "#1b1e22" }}
                          >
                            1 {CONFIG.SYMBOL} = {CONFIG.DISPLAY_COST}{" "}
                            {CONFIG.NETWORK.SYMBOL}.
                          </s.TextTitle>

                          <s.TextDescription
                            style={{ fontSize: 10, textAlign: "center", color: "#1b1e22" }}
                          >
                            Excluding gas fees.
                          </s.TextDescription>

                          {blockchain.account === "" ||
                            blockchain.smartContract === null ? (
                            <s.Container ai={"center"} jc={"center"}>
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  fontSize: 15,
                                  color: "#1b1e22",
                                  marginBottom: 16

                                }}
                              >
                                Connect to {CONFIG.NETWORK.NAME} please.
                              </s.TextDescription>
                             
                             
                                  
                              <Button
  style={{
    width: "90%",
    backgroundColor: "#bff0d5",
    border: "2px solid #000",
    borderRadius: "14px",
    padding: "20px",
    outline: "none",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.8)"
  }}
  onClick={(e) => {
    e.preventDefault();
    dispatch(connect());
    getData();
  }}
>
  <p className="Arial" style={{ 
    margin: "0",
    fontSize: "24px",
    position: "relative",
    outline: "none", 
    textShadow: "2px 2px 2px rgba(0,0,0,0.5)"
  }}>
    CONNECT
  </p>
</Button>


                              {blockchain.errorMsg !== "" ? (
                                <>
                                  <s.SpacerSmall />
                                  <s.TextDescription
                                    style={{ 
                                      backgroundColor: '#CCC', 
                                      border: '1px solid #999', 
                                      width: "90%",
                                      color: '#1b1e22',
                                    }}
                                  >
                                    {blockchain.errorMsg}
                                  </s.TextDescription>
                                </>
                              ) : null}
                            </s.Container>
                          ) : (
                            <>
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "#1b1e22",
                                }}
                              >
                                {feedback}
                              </s.TextDescription>
                              <s.SpacerMedium />
                              <s.Container ai={"center"} jc={"center"} fd={"row"}>
                              <Button
  style={{
    width: "8%",
    backgroundColor: "#e8faf0",
    border: "2px solid #000",
    borderRadius: "14px",
    padding: "5px",
    textShadow: "2px 2px 2px rgba(0,0,0,0.5)",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.8)" }}
  disabled={claimingNft ? 1 : 0}
  onClick={(e) => {
    e.preventDefault();
    decrementMintAmount();
  }}
>
  -
</Button>

                                <s.SpacerMedium />
                                <s.TextDescription
                                  style={{
                                    textAlign: "center",
                                    color: "#1b1e22",
                                  }}
                                >
                                  {mintAmount}
                                </s.TextDescription>
                                <s.SpacerMedium />
                                <Button
  disabled={claimingNft ? 1 : 0}
  onClick={(e) => {
    e.preventDefault();
    incrementMintAmount();
  }}
  style={{
    width: "8%",
    backgroundColor: "#e8faf0",
    border: "2px solid #000",
    borderRadius: "14px",
    padding: "5px",
    textShadow: "2px 2px 2px rgba(0,0,0,0.5)",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.8)" }}
    
>
  +
</Button>

                              </s.Container>
                              <s.SpacerSmall />
                              <s.Container ai={"center"} jc={"center"} fd={"row"}>
                              <StyledButton
  disabled={claimingNft ? 1 : 0}
  onClick={(e) => {
    e.preventDefault();
    claimNFTs();
    getData();
  }}
  style={{
    width: "90%",
    backgroundColor: "#bff0d5",
    border: "2px solid #000",
    borderRadius: "14px",
    padding: "20px",
    outline: "none",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.8)",
    color: '#1b1e22'
  }}
>
  <p className="Arial" style={{ 
    margin: "0",
    fontSize: "24px",
    position: "relative",
    outline: "none", 
    textShadow: "2px 2px 2px rgba(0,0,0,0.5)"
  }}>
    {claimingNft ? "Condensing" : "MINT"}
  </p>
</StyledButton>


                              </s.Container>
                            </>
                          )}
                        </>
                      )}

                    </s.Container>


                  </ResponsiveWrapper>
                

                </div>
              </div>
            </div>
            <div className="col-md-7 janela" style={divShadow} >
              <div className="row" >
                <div className="col-md-12" style={{ height: '100%' }}>
                  <Carousel >
                    <Carousel.Item>

                      <img className="d-block w-100 img-fluid" alt="First slide" src="./config/images/slider/1.png"    ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/2.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/3.png"     ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/4.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/5.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/6.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/7.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/8.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/9.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/10.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/11.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/12.png"    ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/13.png"      ></img>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/14.png"     ></img>
                    </Carousel.Item>

                  </Carousel>
                  {isMobile ? (
                      <>
      <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            </>
            ):''}
                </div>
              </div>

            </div>
          </div>

        </div>
        <div className="espaco" style={{ display: !isMobile ? 'none' : 'block', }}>
          <br></br>
          <br></br>
          <br></br>
        </div>
        <div className="row rodape">

          <div className="col-md-8">
          </div>
          
          <div className="col-md-4">
            <h2 style={styleH2Rodape} className="pressStart" >
              <a href="https://paintswap.finance/marketplace/fantom/collections/little-clay-cloud" target="new" >
                <img src="./config/images/paint.png" style={{ float: 'right', maxWidth: '80%', maxHeight: '50%' }} ></img>
              
                </a>
              <a href="https://novablox.ai/erc721-staking/littleclaycloud" target="new" >
                <img src="./config/images/novabl0x.png" style={{ float: 'right', maxWidth: '80%', maxHeight: '50%' }} ></img>

              
              
              </a>
            </h2>
          </div>

          
        </div>
      </Modal>
</Draggable>
      <Draggable handle=".handle">
        <Modal
          isOpen={roadMapIsOpen}
          onRequestClose={fecharRoadMap}
          contentLabel="Roadmap !"
          className="telaRoadMap"
        >

          <h2 style={styleH2} className="pressStart handle" >My Roadmap!

            <button onClick={fecharRoadMap} className="pressStart botaoFechar">
              X
            </button>
          </h2>
          <div className="quadroRoadMap">
            <div className="row" >

              <div className="col-md-6 roadmap">
                <p>- make art</p>
                <p>- have fun</p>
                <p>holder benefits</p>
                <p>- learn</p>
                <p>- explore other chains</p>
                <p>- grow</p>
                <p>- work on site</p>
                <p>- build</p>
                <p>- evolve</p>
                <p></p>
                <p></p>
                <p></p>
                <p className='medio'>This plan may change from time to time.</p>
              </div>


            </div>
          </div>
        </Modal>
      </Draggable>
      <Dock funcoes={funcoes}  ></Dock>
    </s.Screen>
  );
}

export default Site;
