import React, { useEffect } from "react";


//import { routes } from "~/routes";

const socials = {
  cloud: {
    link: "/cloud",
    label: "Little Cloud",
  },
  fantom: {
    link: "/fantom",
    label: "Fantom",
  },
  twitter: {
    link: "https://twitter.com.jireh",
    label: "Twitter",
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



export function Dock(props) {

 

  

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



  return (
    <div className="dock-container z-50">
      <div className="dock">
        <ul>

          <li>
            <span>{socials.fantom.label}</span>
            <a onClick={props.funcoes[6]}>
            <img src="./config/images/fantom_1.png"    ></img>
            </a>
          </li>
          <li>
            <span>{socials.cloud.label}</span>
            <a onClick={props.funcoes[4]}>
              <img src="./config/images/cloud_2.png"  ></img>
            </a>
          </li>

          <li>
            <span>{socials.twitter.label}</span>
            <a onClick={props.funcoes[8]}>
            <img src="./config/images/twitter_3.png"  ></img>
            </a>
          </li>
          <li>
            <span>{socials.roadmap.label}</span>
            <a onClick={props.funcoes[2]}>
            <img src="./config/images/roadmap_4.png"    ></img>
            </a>
          </li>
          <li>
            <span>{socials.about.label}</span>
            <a onClick={props.funcoes[0]}>
            <img src="./config/images/aboutme_5.png"  ></img>
            </a>
          </li>
        </ul>
        <div className="base"></div>
      </div>
    </div>
  );
}

export default Dock;