import React from 'react'

import BookingItem from '../BookingItem/BookingItem'

const bookingList = props => (
  <ul className="pl-0">
    {props.bookings.map(booking => {
      return (
        <BookingItem 
          key={booking._id} 
          id={booking._id} 
          eventTitle={booking.event.title} 
          eventDate={booking.event.date} 
          onBookingCancel={props.onBookingCancel}
        />
      )
    })}
  </ul>
)

export default bookingList