import React, { PropTypes } from 'react'
import styles from './Button.css' // eslint-disable-line

export default function Button ({onClick, label, children}) {
  const text = (label) ? label : children
  return (
    <button className="btn btn-3 btn-3e icon-arrow-right" onClick={onClick}>
      <span className="bg"></span>
      {text}
    </button>
  )
}