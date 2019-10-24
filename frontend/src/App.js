import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingPage from './pages/Bookings'
import Navigation from './components/Navigation/MainNavigation'

import AuthContext from './context/auth-context'

class App extends Component {
  state = {
    token: (JSON.parse(localStorage.getItem('user')) || {}).token || null,
    userId: (JSON.parse(localStorage.getItem('user')) || {}).userId || null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({token, userId})
    localStorage.setItem('user', JSON.stringify({'token': token, 'userId' : userId}))
  }

  logout = () => {
    this.setState({token: null, userId: null})
    localStorage.removeItem('user')
  }

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
          token: this.state.token,
          userId: this.state.userId,
          login: this.login,
          logout: this.logout
        }}>
          <Navigation />
          <main className="container mx-auto p-4">
            <Switch>
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              
              {!this.state.token && (
                <Route path="/auth" component={AuthPage} />
              )}
              <Route path="/events" component={EventsPage} />
              {this.state.token && (
                <Route path="/bookings" component={BookingPage} />
              )}
              {/* not redirect correctly after logout */}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App
