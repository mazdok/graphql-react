import React from 'react'
import { NavLink } from 'react-router-dom'

import AuthContext from '../../context/auth-context'
import './MainNavigation.css'

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="navbar flex justify-between bg-blue-500 text-white p-3">
          <div className="navbar__logo">
            <h1 className="font-bold">ReactPractice</h1>
          </div>
          
          <div>
            <ul className="navbar__items flex">
              {!context.token && 
                <li className="navbar__item px-3">
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              }
              <li className="navbar__item px-3">
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token &&
                <React.Fragment>
                  <li className="navbar__item px-3">
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li className="navbar__item px-3">
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              }
            </ul>
          </div>
        </header>
      )
    }}
  </AuthContext.Consumer>
)

export default mainNavigation