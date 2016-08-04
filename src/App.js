import React, { Component } from 'react';
import axios from 'axios'
import logo from './assets/logo.gif';
import cloudLogo from './assets/cloud-logo.png';
import AWSLogo from './assets/aws-logo.png';
import { validateEmail, getErrorMsg, addClass, removeClass } from './utils'
import Input from './components/Input'
import styles from './App.css';

class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      email: '',
      emailValid: true,
      password: '',
      error: null,
      entered: false
    }
    this.handleEmailBlur = this.handleEmailBlur.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  /* agnostic input handler for all inputs */
  handleInputChange (e) {
    // console.log(e.target.value)
    // console.log(e.target.innerText)
    // console.log(e.target.dataset)
    const value = (e.target.value !== '') ? e.target.value : e.target.innerText
    this.setState({
      [`${e.target.dataset.input}`]: value
    })
  }

  handleEmailBlur(e) {
    if(validateEmail(e.target.value) || e.target.value === "") {
      console.log('valid')
      this.setState({
        emailValid: true,
        error: false
      })
    } else {
      this.setState({
        emailValid: false,
        error: 'email'
      }, () => {
        this.shakeInput('email')
      })
    }
  }
  shakeInput(refString) {
    const node = this.refs[refString].querySelectorAll("span")[0];
    addClass(node, 'shake')
    setTimeout(() => {
      removeClass(node, 'shake')
    }, 1000);
  }
  renderErrorOrSuccess() {
    const {error, entered} = this.state
    if(entered) {
      return (
        <div className='msg success'>
          Much success!
        </div>
      )
    }
    if(error) {
      const errorMessage = getErrorMsg(error)
      return (
        <div className='msg error'>
          {errorMessage}
        </div>
      )
    } else {
      return null
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    const { email, name, emailValid } = this.state
    if (!emailValid) {
      // set error state
      this.shakeInput('email')
      return false;
    }

    if (!name) {
      // set error state
      this.shakeInput('name')
      return false;
    }

    var data = {
       "email": email,
    }
    var that = this
    axios({
      method: 'post',
      url: 'https://nwgsamd8v7.execute-api.us-east-1.amazonaws.com/dev/users',
      data: data,
      headers: {
       'Authorization': 'Bearer keyhIGB1sKiwklGzU',
      },
    }).then(function(response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
        if(response && response.data && response.data.created) {
          console.log('creation succeed')
          that.setState({
            entered: true
          })
        } else {
          console.log('failed creation')

          that.setState({
            error: 'alreadyEntered'
          })
        }

   });

  }
  render() {
    const { email, emailValid, password, entered } = this.state
    const emailIsValid = (!emailValid && email !== '') ? ' input--invalid' : ''

    return (
      <div className="App">
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

        <div className={"App-form"}>

          {this.renderErrorOrSuccess()}

          <span ref="name">
            <Input
              id='name'
              onChange={this.handleInputChange}
              value={this.state.name}
              type={'text'}
              label={'Name'}
            />
          </span>

          <span ref="email">
            <Input
              id='email'
              className={emailIsValid}
              value={this.state.email}
              onChange={this.handleInputChange}
              onBlur={this.handleEmailBlur}
              type={'text'}
              label={'Email'}
            />
          </span>

          <button
            onClick={this.handleSubmit}
            className="btn btn-3 btn-3e icon-arrow-right">
            Sign up
          </button>

        </div>
      </div>
    );
  }
}

export default App;
