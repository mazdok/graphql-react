import React from 'react'

const bookingItem = props => (
  <li key={props.id} className="flex justify-between bg-gray-100 shadow p-3 mb-2">
    <div className="flex">
      <p className="font-bold mr-2">{props.eventTitle}</p>
      <p className="text-gray-800">{new Date(props.eventDate).toLocaleDateString()}</p>
    </div>
    <div>
      <button className="btn btn-sm btn-gray" onClick={props.onBookingCancel.bind(this, props.id)}>Cancel booking</button>
    </div>
  </li>
)

export default bookingItem