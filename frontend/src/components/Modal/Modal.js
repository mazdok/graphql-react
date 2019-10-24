import React from 'react'

import './Modal.css'
import Backdrop from '../Backdrop/Backdrop'

const modal = props => (
  <React.Fragment>
    <Backdrop />

    <div className="modal">
      <header className="modal__title">
        {props.title}
      </header>
      
      <section className="modal__body">
        {props.children}
      </section>

      <section className="text-right pt-4">
        {props.canCancel && <button onClick={props.onCancel} className="btn btn-gray mr-2">{props.cancelText || 'Cancel'}</button>}
        {props.canConfirm && <button onClick={props.onConfirm} className="btn btn-blue">{props.confirmText || 'Confirm'}</button>}
      </section>
    </div>
  </React.Fragment>
)

export default modal