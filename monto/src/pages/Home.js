import React, { Component } from "react";
import AppNav from "../AppNav";
import Example from "./Example";
import Image from "../images/tracker.png"

class Main extends Component {
  render() {
    return (
      <div>
        <AppNav />
        <img src={Image} width={window.innerWidth} height={window.innerHeight - 60}/>
      </div>
    );
  }
}

export default Main;
