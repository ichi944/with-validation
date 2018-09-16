import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import withValidator from './withValidator';

// Define Store
const initialState = {
  email: '',
  password: '',
}
const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_FORM" : {
      const { name, value } = action;
      return {
        ...state,
        [name]: value,
      };
    }
    default: {
      return state;
    }
  }
}
const store = createStore(formReducer);

// Define Form
class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.props.makeAllDirty();
    const validation = this.props.makeValidator();
    if (validation.fails()) {
      return;
    }
    console.log('Form is valid.', this.props.email, this.props.password);
  }
  render() {
    const { dirty, errors, email, password, handleChange } = this.props;
    const styles = {
      error: {
        color: 'red',
        fontSize: '0.8em',
      },
    };
    return (
      <div>
        <div>
          <label>email: </label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
          { dirty.email && errors.has('email') ?
            <span style={styles.error}>{errors.first('email')}</span> : null }
        </div>
        <div>
          <label>password: </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          { dirty.password && errors.has('password') ?
            <span style={styles.error}>{errors.first('password')}</span> : null }
        </div>
        <div><button onClick={this.handleSubmit}>送信</button></div>
      </div>
    );
  }
}

// Wrapp with Validator
const FormWithValidator = withValidator({
  setData: ({email, password}) => ({
    email,
    password,
  }),
  rules: {
    email: 'required',
    password: 'required|min:8',
  },
})(Form);

// Connect to Store
const mapStateToProps = ({email, password}) => ({
  email,
  password,
});

const mapDispatchToProps = (dispatch) => ({
  handleChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_FORM',
      name,
      value,
    });
  }
});

const ConnectedForm = connect(mapStateToProps, mapDispatchToProps)(FormWithValidator);

// Mount
class App extends Component {
  render() {
    return (
      <div>
        <h1>Validator Form</h1>
        <ConnectedForm />
      </div>
    );
  }
}

render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#app')
);

