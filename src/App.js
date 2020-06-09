import React,{Component} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
    <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/admin" component={Dashboard}></Route>
    </Switch>
    </Router>
  );
}

export default App;


