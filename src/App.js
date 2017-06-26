import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
//import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import "moment/locale/fi";

import Form from "react-jsonschema-form";

function validate(formData, errors) {
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword.addError("Passwords does not match");
  }
  return errors;
}

const schema = {
  title: "Post",
  type: "object",
  required: [],
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "Title"
    },
    msg: { type: "string", title: "Insert text" },
    singleDatePicker: { type: "string", title: "Pick a date" }
  }
};

class MyDate extends Component {
  state = {
    focused: false
  };
  render() {
    return (
      <SingleDatePicker
        {...this.props}
        focused={this.state.focused}
        onFocusChange={({ focused }) => {
          return this.setState({ focused });
        }}
      />
    );
  }
}

const uiSchema = {
  msg: {
    "ui:widget": "textarea"
  },
  singleDatePicker: {
    "ui:widget": props => {
      return (
        <MyDate
          date={moment(props.value)} // momentPropTypes.momentObj or null
          onDateChange={date => props.onChange(date.format())} // PropTypes.func.isRequired
        />
      );
    }
  }
};

const changePSchema = {
  title: "Change password",
  type: "object",
  required: ["password", "confirmPassword"],
  properties: {
    password: { type: "string", title: "Password", minLength: "4" },
    confirmPassword: { type: "string", title: "Confirm password" }
  }
};

const changePUiSchema = {
  password: {
    "ui:widget": "password",
    "ui:help": "Minimum length is 4"
  },
  confirmPassword: {
    "ui:widget": "password"
  }
};

const log = type => console.log.bind(console, type);

const Post = () =>
  <div>
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")}
    />
  </div>;

const Password = () =>
  <div>
    <Form
      schema={changePSchema}
      uiSchema={changePUiSchema}
      validate={validate}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")}
    />
  </div>;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Post text</h2>
          </div>
          <p className="App-intro" />
          <ul>
            <li>
              <Link to="/">Post</Link>
            </li>
            <li>
              <Link to="/changepasswd">Change password</Link>
            </li>
          </ul>
          <Route exact path="/" component={Post} />
          <Route path="/changepasswd" component={Password} />
        </div>
      </Router>
    );
  }
}

export default App;
