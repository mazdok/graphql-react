import React from 'react'

import './EventItem.css'

const eventItem = props => (
  <li key={props.id} className="event-item flex justify-between items-center bg-blue-100 shadow rounded p-3 mb-4">
    <div className="event-item__data">
      <h1 className="event-item__title text-xl">Title: {props.title}</h1>
      <p className="text-sm">Price: 
        <span className="text-green-500 font-bold ml-1">{props.price}$</span></p>
      <p className="text-sm">Date: 
        <span className="text-gray-700 font-bold ml-1">
          {new Date(props.date).toLocaleDateString()}</span></p>
    </div>

    <div className="event-item__actions flex flex-col">
      {props.userId === props.creatorId
        ? <p className="text-gray-500">Your'e the owner of this event</p>
        : <button className="btn btn-sm btn-blue" onClick={props.onViewDetail.bind(this, props.id)}>
            View details</button>
      }
    </div>
  </li>
)

export default eventItem