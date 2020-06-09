import React, { Component }  from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";
  import firebaseconfig from './firebase';
  import firebase from 'firebase';
import Dashboard from './Dashboard';

   // Initialize Firebase

   var userId = '';
   var userName = '';

export const AuthContext = React.createContext(null);

export default function Login()
{
    return (
        <div className="App">
           <LoginBox></LoginBox>
        </div>     
      );
} 

class LoginBox extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,    //Loginscreen indicator
      isRegisterOpen: false
    };
  } 
  
  // Toggling Login and Sign up options

  showLoginBox() {
    this.setState({isLoginOpen: true, isRegisterOpen: false});
  }

  showRegisterBox() {
    this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

 
  //Main Section of Login page

  render()
  {
    return(
       <div className="main-section">
         <div className="header-holder marign-bottom-medium">
           <h3 className="header-text">Touchless Menu</h3>
         </div>
         <div className="nav-button-holder">
           <button className="nav-button-link" onClick={this.showLoginBox.bind(this)}>Sign In</button>
           <button className="nav-button-link" onClick={this.showRegisterBox.bind(this)}>Sign Up</button>
         </div>
          {this.state.isLoginOpen && <SignIn />}
          {this.state.isRegisterOpen && <SignUp />}
       </div>
    );
  }
}

//Sign In component

class SignIn extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {username:'',
    password:'',
    isLogged : false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleSubmit = this.handleGoogleSubmit.bind(this);
    
}



    handleChange(event) 
    {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({ 
            [name]: value
        });
    }
    
    //Sign in Logic in Firebase using mail and password
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.username + this.state.password);     
        event.preventDefault();

        firebaseconfig
        .auth()
        .signInWithEmailAndPassword(this.state.username, this.state.password)
        .then(res => {
          //if (res.user) Auth.setLoggedIn(true);
          this.setState({ 
            isLogged:true
          });
        })
        .catch(e => {
            //setErrors(e.message);
            alert('Your password did not match please try again!');
        });

        
      }

       
    //Sign in Logic in Firebase using mail and password
    handleGoogleSubmit(event) {
      event.preventDefault();
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');


      firebaseconfig
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        userId = res.user.uid;
        userName=res.user.displayName;
        this.setState({ 
          isLogged:true
        });
      })
      .catch(e => {
          //setErrors(e.message);
          console.log(e);
          alert('Your password did not match please try again!');
      });

      
    }

  render()
  {
      if(this.state.isLogged)
      {
        sessionStorage.setItem('uid',userId);
        sessionStorage.setItem('userName',userName);
        return <Redirect  to="/admin" ></Redirect>;
      }
    return(
      <div className="form">
        <h4 className="form-label-text marign-bottom-small">Email id</h4>
        <input type="text" name="username" value={this.state.value} onChange={this.handleChange} className="form-text-input marign-bottom-small"></input>
        <h4 className="form-label-text marign-bottom-small">Password</h4>
        <input type="password" name="password" value={this.state.value} onChange={this.handleChange} className="form-text-input marign-bottom-small"></input>
        <div className="form-controls marign-bottom-small">
        <button className="form-controls-button" onClick={this.handleSubmit}>Submit</button>
           <button className="form-controls-button">Cancel</button>
        </div>
        <div className="google-login marign-bottom-medium">
          <h4 className="form-label-text marign-bottom-small">Or</h4>
          <button className="form-controls-button" onClick={this.handleGoogleSubmit}>Login with Google</button>
        </div>
        <footer>&copy; Copyright {(new Date().getFullYear())} Touchless menu</footer>
      </div> 
    );
  }
}


//Sign Up component

class SignUp extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {username:'',
    password:'',
    isLogged : false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}



    handleChange(event) 
    {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({ 
            [name]: value
        });
    }

    //Sign Up Firebase registration
    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.username + this.state.password);     
        event.preventDefault();
    
        firebaseconfig
        .auth()
        .createUserWithEmailAndPassword(this.state.username, this.state.password)
        .then(res => {
          //if (res.user) Auth.setLoggedIn(true);
          alert('You are registered successfully');
        })
        .catch(e => {
            //setErrors(e.message);
            console.log(e);
            alert('Error occured with registration');
        });
    }



  render()
  {
    return(
         <div className="form">
           <h4 className="form-label-text">User name</h4>
           <input type="text" className="form-text-input"></input>
           <h4 className="form-label-text">Email id</h4>
           <input type="text" name="username" className="form-text-input" value={this.state.value} onChange={this.handleChange}></input>
           <h4 className="form-label-text">Password</h4>
           <input type="password" name="password" className="form-text-input" value={this.state.value} onChange={this.handleChange}></input>
           <div className="form-controls">
              <button className="form-controls-button" onClick={this.handleSubmit}>Submit</button>
              <button className="form-controls-button">Cancel</button>
           </div>
           <footer>&copy; Copyright {(new Date().getFullYear())} Touchless menu</footer>
         </div>
    );
  }
}


