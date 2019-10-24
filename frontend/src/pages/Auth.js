import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
class AuthPage extends Component {
  state = {
    isLogin: true
  }

  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()
  }

  switchMode = event => {
    event.preventDefault()

    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }
    })
  }

  onSubmit = event => {
    event.preventDefault()

    const email = this.emailEl.current.value
    const password = this.passwordEl.current.value

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    // sign in
    let requestBody = {
      query: `
        query loginUser($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password 
      }
    }
    // sign up
    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation signupUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email, 
          password
        }
      }
    }

    fetch('http://localhost:9000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed')
      }
      return response.json()
    })
    .then(resData => {
      console.log(resData)
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        )
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <form className="w-full max-w-sm mx-auto" onSubmit={this.onSubmit}>
        <h1 className="text-2xl font-bold text-center mb-5">{this.state.isLogin ? 'Login' : 'Sign Up'}</h1>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Email
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
              type="email" 
              name="email" 
              ref={this.emailEl} 
            ></input>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-username">
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
              type="password" 
              name="password" 
              ref={this.passwordEl} 
              placeholder="******************" 
            ></input>
          </div>
        </div>
        <div className="md:flex md:items-center mb-3">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button className="btn btn-purple" type="submit">
              {this.state.isLogin ? 'Log in' : 'Sign Up'}
            </button>
          </div>
        </div>

        <p className="text-right text-gray-500">{this.state.isLogin ? 'Not registered yet?' : 'Already registered?'} 
          <button onClick={this.switchMode} className="btn btn-blue btn-sm ml-2">
            {this.state.isLogin ? 'Sign Up' : 'Log in'}
          </button>
        </p>
      </form>
    )
  }
}

export default AuthPage