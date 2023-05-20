import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
//import { routes } from "~/routes";

const socials = {
  cloud: {
    link: "/cloud",
    label: "littleclaycloud",
  },
  fantom: {
    link: "/fantom",
    label: "Twitter",
  },
  twitter: {
    link: "https://twitter.com/justinjireh",
    label: "Github",
  },
  roadmap: {
    link: '/roadmap',
    label: "Roadmap",
  },
  about: {
    link: '/about',
    label: "About me!",
  },
};



export function Dock() {

 

  

  useEffect(() => {
    function addPrevClass(e) {
      var target = e.target;
      if (target.tagName === "svg") {
        // check if it is an icon
        var li = target.parentNode.parentNode;
        var prevLi = li.previousElementSibling;
        if (prevLi) {
          prevLi.className = "prev";
        }

        target.addEventListener(
          "mouseout",
          function () {
            if (prevLi) {
              prevLi.removeAttribute("class");
            }
          },
          false
        );
      }
    }
    if (window && document) {
      document.getElementsByClassName("dock")[0].addEventListener("mouseover", addPrevClass, false);
    }

    return () => {
      // DESTROY
      document.getElementsByClassName("dock")[0].removeEventListener("mouseover", addPrevClass, false);
    };
  }, []);


  function aboutMe(){
   // props.aboutMe;
  }

  return (
    <div className="dock-container z-50">
      <div className="dock">
        <ul>
          <li>
            <span>{socials.cloud.label}</span>
            <a href={socials.cloud.link}>
              <img src="./config/images/cloud_2.png" width={80} ></img>
            </a>
          </li>
          <li>
            <span>{socials.fantom.label}</span>
            <a href={socials.fantom.link}>
            <img src="./config/images/fantom_1.png" width={80} ></img>
            </a>
          </li>
          <li>
            <span>{socials.twitter.label}</span>
            <a href={socials.twitter.link}>
            <img src="./config/images/twitter_3.png" width={80} ></img>
            </a>
          </li>
          <li>
            <span>{socials.roadmap.label}</span>
            <a href={socials.roadmap.link}>
            <img src="./config/images/roadmap_4.png" width={80} ></img>
            </a>
          </li>
          <li>
            <span>{socials.about.label}</span>
            <a  onClick={aboutMe()}>
            <img src="./config/images/aboutme_5.png" width={80} ></img>
            </a>
          </li>
        </ul>
        <div className="base"></div>
      </div>
    </div>
  );
}

export default Dock;