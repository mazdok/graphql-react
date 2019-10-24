import React, { Component } from 'react'

import AuthContext from '../context/auth-context'
import Modal from '../components/Modal/Modal'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'
class EventPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  }

  isActive = true

  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }

  componentDidMount() {
    this.fetchEvents()
  }

  componentWillUnmount() {
    this.isActive = false
  }

  startCreateEventHandler = () => {
    this.setState({creating: true})
  }

  onCancelHandler = () => {
    this.setState({creating: false, selectedEvent: null})
  }

  showEventDetailsHandler = eventId => {
    this.setState(prevState => {
      console.log('showEventDetailsHandler', eventId)
      const selectedEvent = prevState.events.find(event => event._id === eventId)
      return {selectedEvent}
    })
  }

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({selectedEvent: null})
      return
    }

    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          id: this.state.selectedEvent._id
        }
    };
    
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
        throw new Error('Booking event failed')
      }
      return response.json()
    })
    .then(resData => {
      console.log(resData)
      this.setState({selectedEvent: null})
    })
    .catch(err => {
      console.log(err)
    })
  }

  fetchEvents = () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };
    
    this.setState({isLoading: true})

    fetch('http://localhost:9000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Fetching events failed')
      }
      return response.json()
    })
    .then(resData => {
      const events = resData.data.events
      if (this.isActive) {
        this.setState({events})
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      if (this.isActive) {
        this.setState({isLoading: false})
      }
    })
  }

  onConfirmHandler = e => {
    e.preventDefault()

    const title = this.titleElRef.current.value
    const price = +this.priceElRef.current.value
    const date = this.dateElRef.current.value
    const description = this.descriptionElRef.current.value
    const event = {title, price, date, description}
    console.log(event)

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
      ) {
        console.error('Invalid event')
        return
      } 
    
    const requestBody = {
      query: `
          mutation createEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $description, price: $price, date: "$date}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
        variables: {
          title,
          description,
          price,
          date
        }
    };

    const token = this.context.token

    fetch('http://localhost:9000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Event creation failed')
      }
      return response.json()
    })
    .then(resData => {
      const eventData = resData.data.createEvent
      const event = {
        _id: eventData._id,
        title: eventData.title,
        description:  eventData.description,
        date: eventData.date,
        price: eventData.price,
        creator: {
          _id: this.context._id
        }
      }
      this.setState(prevState => {
        return {events: [...prevState.events, event]}
      })
    })
    .catch(err => {
      console.log(err)
    })
    // close modal
    this.setState({creating: false})
  }

  render () {
    return (
      <React.Fragment>
        <div className="events-wrapper max-w-md mx-auto">
          {this.context.token && <div className="events__add bg-blue-100 rounded shadow p-4 mb-4">
            <p className="text-lg font-bold text-center mb-4">Share your own Event:</p>
            <div className="text-center">
              <button className="btn btn-blue" onClick={this.startCreateEventHandler}>Add event</button>
            </div>
          </div>}

          {this.state.isLoading ? (
            <Spinner />
            ) : (
            <EventList events={this.state.events} userId={this.context.userId} onViewDetail={this.showEventDetailsHandler} />
          )}
        </div>
        
        {/* Add new event */}
        {this.state.creating && (
          <Modal 
            title="Add Event" 
            onCancel={this.onCancelHandler} 
            onConfirm={this.onConfirmHandler} 
            canCancel 
            canConfirm
          >
            <form>
              <div className="mb-2">
                <label htmlFor="title" className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">Title</label>
                <input type="text" id="title" ref={this.titleElRef} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>

              <div className="mb-2">
                <label htmlFor="price" className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">Price</label>
                <input type="number" id="price" ref={this.priceElRef} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>

              <div className="mb-2">
                <label htmlFor="date" className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>

              <div className="mb-2">
                <label htmlFor="description" className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">Description</label>
                <textarea type="text" id="description" rows="4" ref={this.descriptionElRef} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>
            </form>
          </Modal>
        )}
        {/* View event details */}
        {this.state.selectedEvent && (
          <Modal 
            title={`${this.state.selectedEvent._id} - ${this.state.selectedEvent.title}`}
            onCancel={this.onCancelHandler} 
            onConfirm={this.bookEventHandler} 
            canCancel 
            canConfirm
            confirmText="Book"
          >
            <h1 className="font-bold text-xl">{this.state.selectedEvent.title}</h1>
            <h2>Date: {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>Price: {this.state.selectedEvent.price} $</p>
            <p>Description: {this.state.selectedEvent.description}</p>
          </Modal>
        )}
      </React.Fragment>
    )
  }
}

export default EventPage