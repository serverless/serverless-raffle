import React, { PropTypes } from 'react'
import styles from './Input.css'

export default function Input ({className, id, value, type, label, onChange, onBlur}) {
  const hasValue = (value) ? ' input--filled' : ''
  return (
    <div>
      <span className={"input " + className + hasValue}>
        <input
          className="field field--ghost"
          id={id}
          data-input={id}
          value={value}
          type={type}
          onChange={onChange}
          onBlur={onBlur}
        />
        <label className="label label--ghost" htmlFor={id}>
          <span className="label-content label-content--ghost"
            data-content={label}>
            {label}
          </span>
        </label>
      </span>
    </div>
  )
}

Input.defaultProps = {
  type: 'text'
}