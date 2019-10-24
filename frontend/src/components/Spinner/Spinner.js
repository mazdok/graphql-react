import React from 'react'
import './Spinner.css'

const spinner = () => (
  <div className="flex justify-center">
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
)

export default spinner