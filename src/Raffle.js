import React from 'react';
import config from './_config'
import axios from 'axios'
import Button from './components/Button'
import Header from './components/Header'
import styles from './Raffle.css' // eslint-disable-line

var colors = ['#c90000', '#c9c90e', '#336999', '#33996f'];
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
    if(counter++ == skip) { // eslint-disable-line
      var randWord = entrants[Math.floor(Math.random()*entrants.length)]
      this.refs.winner.innerHTML = randWord;
      this.refs.winner.style.color = colors[Math.floor(Math.random()*colors.length)]
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
      console.log('response', response)
      if(response && response.data) {
        if (response.data.data && response.data.data.length === 0) {
          console.log('no entries')
          that.setState({
            loading: false,
            entrants: null,
            winner: 'No entrants found. Refresh page & try again'
          })
          console.log(that.refs.button)
          document.querySelectorAll("button")[0].style.display = 'none'
          return false
        }

        const emails = response.data.data.map((obj) => {
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
          that.refs.winner.style.color = '#07d907'
        }, 7000);
     }
    })
  }
  hammerTime() {
    const { loading, winner } = this.state
    const showLoading = (loading) ? 'block' : 'none'
    const showWinner = (winner) ? 'block' : 'none'
    return (
      <div className='gif'>
        <iframe style={{display: showWinner}} src="//giphy.com/embed/l3q2Z6S6n38zjPswo" width="330" height="248" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
        <iframe style={{display: showLoading}}  src="//giphy.com/embed/hxc32veg6tbqg" width="330" height="248" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
      </div>
    )
  }

  render() {
    const { loading, winner } = this.state
    const buttonText = (loading) ? "Calculating Winner..." : "Spin the wheel of destiny"
    const headline = (winner) ? winner : "Raffle"

    return (
      <div>
        <Header />
        {this.hammerTime()}
        <h1 className="title" ref='winner'>
          {headline}
        </h1>
        <Button ref='button' onClick={this.doRaffle}>
          {buttonText}
        </Button>
      </div>
    );
  }
}