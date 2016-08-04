import React from 'react';
import { Link } from 'react-router'

export default class FourOFour extends React.Component {

  render() {
    return (
      <div>
        <h1>404</h1>
        <Link to='raffle'>Go to raffle</Link>
      </div>
    );
  }
}