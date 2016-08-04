import React, { Component } from 'react';
import axios from 'axios'
import Header from './components/Header'
import Button from './components/Button'
import { validateEmail, getErrorMsg, addClass, removeClass } from './utils'
import Input from './components/Input'
import styles from './App.css'; // eslint-disable-line

class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      email: '',
      emailValid: true,
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

    if (!email) {
      // set error state
      this.shakeInput('email')
      return false;
    }

    if (!emailValid) {
      // set error state
      this.shakeInput('email')
      return false;
    }

    // if (!name) {
    //   // set error state
    //   this.shakeInput('name')
    //   return false;
    // }

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
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
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
    const { email, emailValid, entered } = this.state
    const emailIsValid = (!emailValid && email !== '') ? ' input--invalid' : ''
    const showSuccess = (entered) ? "flex" : "none"
    return (
      <div >

        <Header />

        <div className={"App-form"}>

          {this.renderErrorOrSuccess()}

          <div className='msg success' style={{display: showSuccess}}>
            You are entered into the raffle!
            <div>

              <h2>Join the Serverless Community!</h2>

              <a className="github-button" href="https://github.com/serverless/serverless" data-icon="octicon-star" data-style="mega" data-count-href="/serverless/serverless/stargazers" data-count-api="/repos/serverless/serverless#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star serverless/serverless on GitHub">Star</a>
            </div>
          </div>

          {/*<span ref="name">
            <Input
              id='name'
              onChange={this.handleInputChange}
              value={this.state.name}
              type={'text'}
              label={'Name'}
            />
          </span>*/}

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

          <Button onClick={this.handleSubmit}>
            Sign up
          </Button>

        </div>
      </div>
    );
  }
}

export default App;
