import React from 'react';
import { Link } from 'react-router'
import axios from 'axios'
import Header from './components/Header'
import styles from './Raffle.css'

export default class Raffle extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: false
    }
    this.doRaffle = this.doRaffle.bind(this)
  }
  doRaffle(e) {
    e.preventDefault()
    this.setState({
      loading: true
    })
    const that = this
    axios({
      method: 'get',
      url: 'https://nwgsamd8v7.execute-api.us-east-1.amazonaws.com/dev/users',
    }).then(function(response) {
       if(response && response.data) {
         const emails = response.data.map((obj) => {
             return obj.email.S;
         });
         const winner = emails[Math.floor(Math.random()*emails.length)];
         that.setState({
           winner: winner,
           loading: false
         })
       } else {

       }

    });
  }
  render() {
    const { loading, winner } = this.state
    const buttonText = (loading) ? "Calculating Winner..." : "do Raffle"
    const headline = (winner) ? winner : "Raffle"

    return (
      <div>
        <Header />
        <h1 className="title">
          {headline}
        </h1>

        <button onClick={this.doRaffle}>
          {buttonText}
        </button>
      </div>
    );
  }
}