import React from 'react';
import { Link } from 'react-router'
import config from './_config'
import axios from 'axios'
import Button from './components/Button'
import Header from './components/Header'
import styles from './Raffle.css' // eslint-disable-line

var colors = ['red', 'yellow'];
var skip = 4;
var counter = 0;

export default class Raffle extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: false,
      entrants: [
        'austen@powers.com',
        'jimmy@hendricks.com',
        'donald@trump.com',
        'lolz@hazcats.com',
        'whooot@wooooo.com',
        'bill@murray.com',
        'lilwayne@rapper.net',
        'blade@vampire.net',
        'peter@griffen.com',
        'pleasePickMe@desperate.com',
        'hillary@clinton.com',
        'william@wallace.com',
        'loadingState@emails.com',
        'what@hi.com'
       ]
    }
    this.doRaffle = this.doRaffle.bind(this)
    this.swap = this.swap.bind(this)
  }
  swap() {
    const { entrants } = this.state
    if (!entrants) {
      return false
    }
    if(counter++ == skip) {
      var randWord = entrants[Math.floor(Math.random()*entrants.length)]
      this.refs.winner.innerHTML = randWord;
      this.refs.winner.dataset.text = randWord;
      counter = 0;
    }

    window.requestAnimationFrame(this.swap);

  }
  componentDidMount() {
    //this.swap()
  }
  doRaffle(e) {
    if(!this.state.entrants) {
      this.setState({
        entrants: this.state.tempEntrants,
      }, () => {
        this.doRaffle()
      })
    }
    e && e.preventDefault()

    this.setState({
      loading: true
    }, () => {
      this.swap()
    })
    const that = this
    axios({
      method: 'get',
      url: config.API.RAFFLE,
    }).then(function(response) {
      if(response && response.data) {
        const emails = response.data.map((obj) => {
           return obj.email.S;
        });
        that.setState({
          entrants: emails,
        })
        const winner = emails[Math.floor(Math.random()*emails.length)];
        setTimeout(function() {
          that.setState({
            tempEntrants: emails,
            entrants: null,
            winner: winner,
            loading: false,
          })
        }, 10000);
     }

    });
  }
  render() {
    const { loading, winner } = this.state
    const buttonText = (loading) ? "Calculating Winner..." : "Spin the wheel of destiny"
    const headline = (winner) ? winner : "Raffle"

    return (
      <div>
        <Header />
        <h1 className="title" ref='winner'>
          {headline}
        </h1>
        <Button onClick={this.doRaffle}>
          {buttonText}
        </Button>
      </div>
    );
  }
}