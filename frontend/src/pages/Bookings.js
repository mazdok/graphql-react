import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'
class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }
  
  static contextType = AuthContext
  
  componentDidMount() {
    this.fetchBookings()
  }

  bookingCancelHandler = bookingId => {
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    }
    
    fetch('http://localhost:9000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.token}`
      }
    })
    .then(response => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Fetching bookings failed')
      }
      return response.json()
    })
    .then(() => {
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId)
        return {bookings: updatedBookings}
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  fetchBookings = () => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
    }
    
    this.setState({isLoading: true})

    fetch('http://localhost:9000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.token}`
      }
    })
    .then(response => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Fetching bookings failed')
      }
      return response.json()
    })
    .then(resData => {
      console.log(resData)
      const bookings = resData.data.bookings
      this.setState({bookings})
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => this.setState({isLoading: false}))
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="text-2xl text-center mb-5">Bookings</h1>

        {this.state.isLoading ? <Spinner /> : (
          <ul className="pl-0">
            <BookingList bookings={this.state.bookings} onBookingCancel={this.bookingCancelHandler} />
          </ul>
        )}
      </React.Fragment>
    )
  }
}

export default BookingPage