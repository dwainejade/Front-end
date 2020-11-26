import React, { useState, useEffect } from 'react';
import schema from './loginSchema'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { Form, Button } from 'react-bootstrap'
import './LoginForm.css'


const initialFormValues = {
  username: '',
  password: ''
}
const initialFormErrors = {
  username: '',
  password: ''
}
const initialUsers = []
const initialDisabled = true

const LoginForm = () => {

  const [users, setUsers] = useState(initialUsers)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)
  let history = useHistory()

  const postNewUsers = newUser => {
    axios.post('https://secret-family-recipes-6.herokuapp.com/auth/login', newUser)
      .then(response => {
        setUsers([...users, response.data])
        localStorage.setItem("token", response.data.token);
        console.log('login successful', response.data)
        history.push('/recipes');
      })
      .catch((error) => {
        // debugger
        console.log(error);
      })
      .finally(() => {
        setFormValues(initialFormValues);
      });
  };
  const validate = (name, value) => {
    //yup validation schema
    yup
      .reach(schema, name)
      .validate(value)
      .then((valid) => {
        setFormErrors({
          ...formErrors,
          [name]: "",
        });
      })
      .catch((error) => {
        setFormErrors({
          ...formErrors,
          [name]: error.errors[0],
        });
      });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    change(name, value);
  };

  const change = (name, value) => {
    validate(name, value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmit = event => {
    event.preventDefault()
    submit()
    // change route to home page, dashboard
  }

  const submit = () => {
    const newUser = {
      username: formValues.username.trim(),
      password: formValues.password.trim()
    }
    postNewUsers(newUser)
  }

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  useEffect(() => {
    schema.isValid(formValues).then((valid) => {
      setDisabled(!valid);
    });
  }, [formValues]);

  return (
    <div className='login-form'>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <div className='label-input'>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            value={formValues.username}
            onChange={onChange}
            name='username'
            type='username'
          />
        </div>
        <div className='label-input'>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            value={formValues.password}
            onChange={onChange}
            autoComplete='true'
            suggested="current-password"
            name='password'
            type='password'
          />

        </div>
        <Button type="submit" disabled={disabled} >Sign In</Button>

        <p>Not a member? Register <Link to='/register'>here.</Link></p>

      </Form>
    </div>
  );
};

export default LoginForm;

