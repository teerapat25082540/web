import React from "react";
import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManageVaccine";
import ErrorPage from "./pages/Error";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/manage" component={ManagePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact component={ErrorPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
