import React from "react";
import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManageVaccinePage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
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
