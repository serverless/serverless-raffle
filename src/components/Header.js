import React from 'react';
import logo from '../assets/logo.gif';
import cloudLogo from '../assets/cloud-logo.png';
import AWSLogo from '../assets/aws-logo.png';
import styles from './Header.css'

export default class Header extends React.Component {

  render() {
    return (
      <div className="App-header">
        <span className="App-logos">
        <img src={cloudLogo} className="App-logo" alt="logo" />
        <span className="plus">+</span>
        <img src={logo} className="App-logo" alt="logo" />
        </span>
        <h2>
          <img src={AWSLogo} className="App-logo-2" alt="logo" />
          <span>Raffle!</span>
        </h2>
      </div>
    );
  }
}
