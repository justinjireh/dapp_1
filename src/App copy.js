import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import Carousel from 'react-bootstrap/Carousel';
import Dock from "./components/dock";
import Modal from 'react-modal';

import * as s from "./styles/globalStyles";
import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.min.css';

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





function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
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
  
    console.log("Cost: ", totalCostWei);

    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({

        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Opa, a ${CONFIG.NFT_NAME} é sua! go visit Opensea.io to view it.`
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
    position: 'fixed', verticalAlign: 'middle',

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




  var funcoes = [abrirModal, fecharModal, abrirRoadMap, fecharRoadMap, abrirMint, fecharMint, abrirFantom, fecharFantom, abrirTwitter, fecharTwitter]

  return (
    <s.Screen >
      <h2 style={styleH2Top}>
        
        <div style={{ marginLeft: 20, padding: 10, fontFamily: 'Press Start 2P' }} class="pressStart">justinjireh</div></h2>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "./config/images/bg.png" : null}
      >


      </s.Container>
      <s.Container>

      </s.Container>
      <Dock funcoes={funcoes}  ></Dock>


      <Modal
        isOpen={modalIsOpen}
        onRequestClose={fecharModal}
        contentLabel="About Me"
        style={modalStyle}



      >
        <h2 style={styleH2} class="pressStart" >About Me!
          <button onClick={fecharModal} class="specialElite botaoFechar">
            X
          </button>
        </h2>
        <div class="quadro">
          <div class="row"></div>
          <div class="row">
            <div class="col-md-3" align="center" style={{ padding: '20px', paddingTop: '25px' }}>
              <img src="./config/images/me.gif" style={styleImgAbout}></img>
            </div>
            <div class="col-md-9" style={{ paddingTop: '4%' }}>
              <div class='row'>
                <div class="col-md-12">
                  <p class="Alice tamanho16" style={{ fontSize: 18, fontWeight: 'bold' }}>Human Being. Man of Adventure. Chronic Day Dreamer. </p>
                </div>
              </div>
              <div class='row' style={{ marginTop: '10px' }}>

                <div class="col-md-11" style={{ textAlign: 'justify' }}>
                  <p class="Alice tamanho16 linha30" >I am a multi-medium artist and designer, dabbling in all arts and mediums that inspire me and allow me to communicate my ideas and emotions. I am constantly exploring new ways to push my creativity and skills. I am currently stumbling my way through the exciting world of web3. I am excited to continue my journey and discover new possibilities to creatively build in web3 space. </p>
                </div>

              </div>
            </div>
          </div>
          <div class="row">
            <div class='col-md-12 interests' >
              <h2 >Justin’s Interests</h2>
            </div>
          </div>

          <div class="row " style={{ marginTop: '6px', display: isMobile ? 'none' : 'block' }}>
            <div class="col-md-12">
              <table >
                <tr>
                  <td class="col-md-3 leftAbout">
                    <p class="Jost white" >General</p>
                  </td>
                  <td class="col-md-9 rightAbout">
                    <p class='Jost white tamanho14 '>Here is a list of things I've often liked...</p>
                    <p class='Jost white tamanho14 linha30'>visual expressions of emotion. purposeful aesthetic arrangements. fantom.  altered states. NFT scenes. harmonious color palettes. learning to code and develop. music. web3. light. mood. atmosphere. patterns. shapes. print. textures. metal detecting for history and treasures. gaming to clear my head. nintendo. crypto communities. color wheels. comedy. rainy days. book reading. lofi hiphop. traveling around our planet. perfectly looping GIFs. wood working. gardening. chromatic aberration. light leaks. sativa with citrus undertones. admiring typography. the play between order and chaos in glitch art. refracted light. pantone swatches. lighting scenes. the texture of rag paper. vintage camera lenses. vaporwave aesthetic. cartography. fresh threads. transferring intangible ideas onto tangible surfaces. negative space. caffeine. traveling astral planes. existentially thinking. refracted light. making things and stuff.</p>
                  </td>
                </tr>
                <tr>
                  <td class="col-md-3 leftAbout">
                    <p class="Jost white">Software</p>
                  </td>
                  <td class="col-md-9 rightAbout">
                    <p class="Jost white tamanho14 ">HERE IS A LIST OF SOFTWARE I LIKE TO USE...</p>
                    <p class="Jost white tamanho14 linha30">Photoshop. Illustrator. Premiere. After Effects. Lightroom. Blender. ArcGis. MS Paint. </p></td>
                </tr>
                <tr>
                  <td class="col-md-3 leftAbout">
                    <p class="Jost white">Languages:</p>
                  </td>
                  <td class="col-md-9 rightAbout">
                    <p class="Jost white tamanho14 ">English. Português. Español</p>
                  </td>
                </tr>
                <tr>
                  <td class="col-md-3 leftAbout">
                    <p class="Jost white">Zodiac Sign:</p>
                  </td>
                  <td class="col-md-9 rightAbout">
                    <p class="Jost white tamanho14 ">Leo</p>
                  </td>
                </tr>

              </table>
            </div>
          </div>
          <div class="row " style={{ display: isMobile ? 'block' : 'none' }} >
            <div class="col-md-12">
              <div class="row top5 left5" style={{ marginTop: '5px' }}>
                <div class="col-md-3 leftAbout" >
                  <p class="Jost white" >General</p>
                </div>
                <div class="col-md-9 rightAbout">
                  <p class='Jost white tamanho14 '>Here is a list of things I've often liked...</p>
                  <p class='Jost white tamanho14 linha30'>visual expressions of emotion. purposeful aesthetic arrangements. fantom.  altered states. NFT scenes. harmonious color palettes. learning to code and develop. music. web3. light. mood. atmosphere. patterns. shapes. print. textures. metal detecting for history and treasures. gaming to clear my head. nintendo. crypto communities. color wheels. comedy. rainy days. book reading. lofi hiphop. traveling around our planet. perfectly looping GIFs. wood working. gardening. chromatic aberration. light leaks. sativa with citrus undertones. admiring typography. the play between order and chaos in glitch art. refracted light. pantone swatches. lighting scenes. the texture of rag paper. vintage camera lenses. vaporwave aesthetic. cartography. fresh threads. transferring intangible ideas onto tangible surfaces. negative space. caffeine. traveling astral planes. existentially thinking. refracted light. making things and stuff.</p>
                </div>
              </div>
              <div class="row top5 left5" style={{ marginTop: '5px' }}>
                <div class="col-md-3  leftAbout">
                  <p class="Jost white">Software</p>
                </div>
                <div class="col-md-9 rightAbout">
                  <p class="Jost white tamanho14 ">HERE IS A LIST OF SOFTWARE I LIKE TO USE...</p>
                  <p class="Jost white tamanho14 linha30">Photoshop. Illustrator. Premiere. After Effects. Lightroom. Blender. ArcGis. MS Paint. </p>
                </div>
              </div>
              <div class="row top5 left5" style={{ marginTop: '4px' }}>
                <div class="col-md-3 leftAbout">
                  <p class="Jost white">Languages:</p>
                </div><div class="col-md-9 rightAbout">
                  <p class="Jost white tamanho14 ">English. Português. Español</p>
                </div>
              </div>
              <div class="row top5 left5" style={{ marginTop: '3px' }}>
                <div class="col-md-3 leftAbout">
                  <p class="Jost white">Zodiac Sign:</p>
                </div>
                <div class="col-md-9 rightAbout">
                  <p class="Jost white tamanho14 ">Leo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={TwOpen}
        onRequestClose={fecharTwitter}
        contentLabel="Twitter !"
        style={modalStyle}



      >
        <h2 style={styleH2} class="pressStart" >Twitter!

          <button onClick={fecharTwitter} class="specialElite botaoFechar">
            X
          </button>

        </h2>
        <div class="quadro">
          <div class="row" style={{ marginTop: '20px' }}>
            <div class="col-md-3"></div>
            <div class="col-md-6" style={{ textAlign: 'center' }}>
              <p style={styleParagraphAbout}>"Feel Free to say Hello !!"</p>
              <Button
                style={{ with: "100%", backgroundColor: '#blue', border: '1px solid #999' }}
                onClick={(e) => {
                  window.open('https://twitter.com/justinjireh', 'new');
                }}
              >
                TWITTER
              </Button>
            </div>
            <div class="col-md-3"></div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={mintIsOpen}
        onRequestClose={fecharMint}
        contentLabel="Litle Clay Cloud !"
        className="telaModal"
      >
        <h2 style={styleH2} class="pressStart">Little Clay Cloud!

          <button onClick={fecharMint} class="specialElite botaoFechar">
            X
          </button>
        </h2>
        <div class="quadroCloud" >
          <div class="row"></div>
          <div class="row" >
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-11" align="center">

                  <img src="./config/images/banner.png" style={{ maxWidth: '100%' }} ></img>
                </div>
          
              </div>
              <div class="row" style={{ marginTop: '20px' }}>
                <div class="col-md-1"></div>
                <div class="col-md-11" align="center">

                  <p style={{ textAlign: 'justify' }} class="specialElite lcc linha30">After reading countless hours of children's story books filled with cute characters to my young daughter..I often have found myself daydreaming of creating a cute little character of my own and incorporating them into a NFT collection to share with the community.. So here it is...</p>
                </div>

              </div>
              <div class="row" style={{ marginTop: '20px' }}>
                <div class="col-md-1"></div>
                <div class="col-md-11" align="center">

                  <p style={{ textAlign: 'justify' }} class="Alice lcc linha30">Step into the world of childish imagination with the Little Clay Cloud collection. Each piece is a unique creation, molded from clay and brought to life by photographing them under studio lighting and processed digitally. Made with love. I hope it brings a smile to your face and joy to your heart.</p>
                </div>

              </div>


            </div>
            <div class="col-md-5">
              <div class="row" style={{ height: '100%', overflow: 'visible' }}>

                <div class="col-md-12" align="center">
                  <img src="./config/images/littleclaycloud_gateway.png" style={{ maxWidth: '100%', height: '100%' }} ></img>
                </div>

              </div>
              <div class="row">

                <div class="col-md-12" align="center">
                  <Button className='botaoPreto' onClick={abrirCloud} style={{ width: '50%'}}>
                    enter
                  </Button>
                </div>

              </div>
            </div>

          </div>
          


        </div>

      </Modal>
      <Modal
        isOpen={fantomIsOpen}
        onRequestClose={fecharFantom}
        contentLabel="Litle Clay Fantom"
        className="telaModalFantom"
      >

        <h2 style={styleH2} class="pressStart">Little Clay Fantom!

          <button onClick={fecharFantom} class="specialElite botaoFechar">
            X
          </button>
        </h2>
        <div class="quadro" >
          <div class="row" style={{ marginTop: '40px' }}>
            <div class="col-md-6">

              <div class="row">
                <div class='col-md-1'></div>
                <div class='col-md-10'>
                  <p style={{ textAlign: 'center' }} class="specialElite  linha30">Evoked from the hauntingly ethereal realm of the imagination, these spooky little fantoms are part of a NFT collection which was handmade with clay. 100 Pieces.</p>
                  <p style={{ textAlign: 'center' }} class="specialElite  linha30">
                    This collection was handmade from polymere clay, photographed in studio lighting, digitally retouched then ran through generative software. </p>



                </div>
                <div class='col-md-1'>

                </div>
              </div>

              <div style={{ display: !isMobile ? 'block' : 'none', }}>
                <div class="row"  >
                  <div class="col-md-2" >
                    <a href="https://paintswap.finance/marketplace/fantom/collections/little-clay-fantom" target="new">
                      <img src="./config/images/paintswap_gif.gif" style={{ margin: '10px', maxWidth: '100%' }} ></img></a>
                  </div>
                  <div class="col-md-8" align='center'>
                    <p style={{ textAlign: 'center', fontSize: 'smaller' }} class="pressStart linha30">
                      Created on Fantom</p>
                    <p style={{ textAlign: 'center', fontSize: 'smaller' }} class="pressStart linha30">
                      Available on Paintswap</p>
                  </div>
                  <div class="col-md-2" style={{ padding: 0 }}>
                    <a href="https://fantom.foundation/" target="new" >
                      <img src="./config/images/fantom_logo_gif.gif" style={{ margin: '10px', maxWidth: '100%' }}></img></a>
                  </div>
                </div>
              </div>
              <div style={{ display: isMobile ? 'block' : 'none' }}>
                <div class="row" >
                  <div class="col-md-12" align="center" >
                    <a href="https://paintswap.finance/marketplace/fantom/collections/little-clay-fantom" target="new" style={{ float: 'left' }}>
                      <img src="./config/images/paintswap_gif.gif" style={{ maxWidth: '50px' }}></img></a>

                    <div style={{ maxWidth: '70%', float: 'left', textAlign: 'center' }} align="center">
                      <p style={{ textAlign: 'center', fontSize: 'smaller' }} class="pressStart linha30">
                        Created on Fantom</p>
                      <p style={{ textAlign: 'center', fontSize: 'smaller' }} class="pressStart linha30">
                        Available on Paintswap</p>
                    </div>
                    <a href="https://fantom.foundation/" target="new" style={{ float: 'right' }} >
                      <img src="./config/images/fantom_logo_gif.gif" style={{ maxWidth: '50px' }}></img></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">

              <div class="col-md-10">

                <img src="./config/images/fantom.gif" style={{ width: '100%' }}></img>
              </div>
              <div class="col-md-2"></div>

            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={cloudIsOpen}
        onRequestClose={fecharCloud}
        contentLabel="Cloud"
      
        className="telaModal"
      >
        <div style={{ display: !isMobile ? 'block' : 'none', }}>
          <div class="row" >
            <div class="col-md-6" style={{ backgroundColor: "#1b1e22" }} >
              <h2 style={{ backgroundColor: "#1b1e22", height: '40px', color: "#FFF", }} class="pressStart">
                <img src="./config/images/cll.png" style={{ float: 'left', maxHeight: '25px' }} />


              </h2>
            </div>
            <div class="col-md-6" style={{ backgroundColor: "#1b1e22", paddingTop: '8px' }} >


              <button onClick={fecharCloud} class="specialElite botaoFechar">
                X
              </button>
              <a href="https://ntfkey.app" target="new" >

                <img src="./config/images/nft.png" style={{ maxWidth: '20%', maxHeight: '80%', float: 'right', marginRight: '5%' }} ></img>
              </a>



            </div>
          </div>
        </div>
        <div style={{ display: isMobile ? 'block' : 'none', }}>
          <div class="row" >
            <div class="col-md-6" style={{ backgroundColor: "#1b1e22" }} >
              <h2 style={{ backgroundColor: "#1b1e22", height: '40px', color: "#FFF", }} class="pressStart">
                <img src="./config/images/cll.png" style={{ float: 'left', maxHeight: '25px' }} />
                <button onClick={fecharCloud} class="specialElite botaoFechar" style={{marginTop:'5px'}}>
                X
              </button>
              <a href="https://ntfkey.app" target="new" >

                <img src="./config/images/nft.png" style={{ maxWidth: '20%', maxHeight: '80%', float: 'right', marginRight: '5%' }} ></img>
              </a>


              </h2>
            </div>

          </div>
        </div>
        <div class="quadroMint">
          <div class="row ">
            <div class="col-md-6 janela" style={divShadow}>
              <div class="row">

                <div class="col-md-12" align="center">
                  <img src="./config/images/banner.png" style={{ maxWidth: '90%' }} ></img>
                </div>

              </div>
              <div class="row">
                <div class="col-md-12">
                  <p style={{ textAlign: 'center' }} class="Alice  linha30 tamanho20">Conjured up from the condensing of energies throughout the Fantom blockchain, these Litle Clay Clouds show a wide range of emotions and exhibit curious precipitation patterns.</p>
                </div>
              </div>
              <div class="row" style={{ marginTop: '10px' }}>
                <div class="col-md-12">
                  <p style={{ textAlign: 'center' }} class="specialElite  linha30  tamanho20">These pieces are handmade with polymere clay, photographed in studio lighting and digitally retouched and ran through generative software.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p style={{ textAlign: 'center' }} class="Alice  linha30  tamanho20">555 Pieces. 20 Animated. 100+ Attributes. Extra Rate Pieces</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 pressStart linha30">



                  <ResponsiveWrapper flex={1} style={{ padding: 10 }} >

                    <s.Container
                      flex={2}
                      jc={"center"}
                      ai={"center"}
                    >


                      <s.TextTitle
                        style={{
                          fontFamily: 'Press Start 2P',
                          textAlign: "center",
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                      </s.TextTitle>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          color: "#000",
                        }}
                      >
                        <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{color:'#000'}}>
                          {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                        </StyledLink>
                      </s.TextDescription>

                      {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                        <>
                          <s.TextTitle
                            style={{ fontSize: 10, textAlign: "center", color: "#000" }}
                          >
                            The sale has ended.
                          </s.TextTitle>
                          <s.TextDescription
                            style={{ fontSize: 10, textAlign: "center", color: "#000" }}
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
                            style={{ fontSize: 10, textAlign: "center", color: "#000" }}
                          >
                            1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                            {CONFIG.NETWORK.SYMBOL}.
                          </s.TextTitle>

                          <s.TextDescription
                            style={{ fontSize: 10, textAlign: "center", color: "#000" }}
                          >
                            Excluding gas fees.
                          </s.TextDescription>

                          {blockchain.account === "" ||
                            blockchain.smartContract === null ? (
                            <s.Container ai={"center"} jc={"center"}>
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  fontSize: 10,
                                  color: "#000",

                                }}
                              >
                                Connect to the {CONFIG.NETWORK.NAME} network
                              </s.TextDescription>

                              <Button
                                style={{ with: "100%", backgroundColor: '#CCC', border: '1px solid #999', width: "90%", }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(connect());
                                  getData();
                                }}
                              >
                                <p class="Alice">CONNECT TO MINT A CLOUD</p>
                              </Button>
                              {blockchain.errorMsg !== "" ? (
                                <>
                                  <s.SpacerSmall />
                                  <s.TextDescription
                                    style={{
                                      textAlign: "center",
                                      color: "#000",
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
                                  color: "#000",
                                }}
                              >
                                {feedback}
                              </s.TextDescription>
                              <s.SpacerMedium />
                              <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                <StyledRoundButton
                                  style={{ lineHeight: 0.4 }}
                                  disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    decrementMintAmount();
                                  }}
                                >
                                  -
                                </StyledRoundButton>
                                <s.SpacerMedium />
                                <s.TextDescription
                                  style={{
                                    textAlign: "center",
                                    color: "#000",
                                  }}
                                >
                                  {mintAmount}
                                </s.TextDescription>
                                <s.SpacerMedium />
                                <StyledRoundButton
                                  disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    incrementMintAmount();
                                  }}
                                >
                                  +
                                </StyledRoundButton>
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
                                  style={{backgroundColor:'#1b1e22', color:'#FFF'}}
                                >
                                  {claimingNft ? "BUSY" : "MINT"}
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
            <div class="col-md-6 janela" style={divShadow} >
              <div class="row" >
                <div class="col-md-12" style={{ height: '100%' }}>
                  <Carousel >
                    <Carousel.Item>

                      <img className="d-block w-100" alt="First slide" src="./config/images/slider/1.png"    ></img>
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
                </div>
              </div>

            </div>
          </div>

        </div>
        <div class="row rodape">

          <div class="col-md-8">
          </div>

          <div class="col-md-4">
            <h2 style={styleH2Rodape} class="pressStart" >
              <a href="https://paintswap.finance" target="new" >
                <img src="./config/images/paint.png" style={{ float: 'right', maxWidth: '80%', maxHeight: '80%' }} ></img>
              </a>

            </h2>
          </div>

        </div>
      </Modal>
      <Modal
        isOpen={roadMapIsOpen}
        onRequestClose={fecharRoadMap}
        contentLabel="Roadmap !"
        style={modalStyle}
      >
        <h2 style={styleH2} class="pressStart" >My Roadmap!

          <button onClick={fecharRoadMap} class="specialElite botaoFechar">
            X
          </button>
        </h2>
        <div class="quadro">
          <div class="row" style={{ marginTop: '20px' }}>
            <div class="col-md-3"></div>
            <div class="col-md-6 roadmap">
              <p>- Make art</p>
              <p>- Have fun</p>
              <p>- Create pfp collections</p>
              <p>- Stopmotion places</p>
              <p>- 1/1´s</p>
              <p>- explore other chains</p>
              <p>- grow</p>
              <p>- learn</p>
              <p>- holder perks</p>
              <p>- keep making art</p>
              <p>- work on site</p>
              <p>- build</p>
              <p>- collab</p>
              <p>- evolve</p>
              <p>- stay inspired</p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p class='pequena'>This plan will change from time to time</p>
            </div>
            <div class="col-md-3"></div>
          </div>
        </div>
      </Modal>
    </s.Screen>
  );
}

export default App;
