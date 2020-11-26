import React, { useEffect, useState } from "react";
import * as yup from "yup";
import formSchema from "./registrationSchema";
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap'

function RegistrationForm(props) {
  const initialForm = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  };
  const [formValues, setFormValues] = useState(initialForm);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  let history = useHistory();

  const submitForm = (event) => {
    event.preventDefault();
    console.log(formValues)

    axios
      .post('https://secret-family-recipes-6.herokuapp.com/auth/register', formValues)
      .then(res => {
        console.log(res)
        history.push('/login')
      })
      .catch(err => {
        console.log(err)
      })

  };

  function inputChange(event) {
    /* Destructuring the  name and value from the form inputs. */
    const { name, value } = event.target;
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => { })
      .catch((error) => { });

    setFormValues({
      ...formValues,
      [name]: value,
    });
  }
  // }

  useEffect(() => {
    formSchema.isValid(formValues).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [formValues]);

  return (
    <div className='login-form'>
      <Form onSubmit={submitForm}>
        <h1 >Register</h1>
        <div className='label-input'>
          <Form.Label>First Name:</Form.Label>
          <Form.Control className='label-input'
            type="text"
            name="first_name"
            id="first_name"
            value={formValues.first_name}
            placeholder="John"
            onChange={inputChange}
          />
        </div>
        <div className='label-input'>
          <Form.Label>Last Name:</Form.Label>
          <Form.Control className='label-input'
            type="text"
            name="last_name"
            id="last_name"
            value={formValues.last_name}
            placeholder="Doe"
            onChange={inputChange}
          />
        </div>
        <div className='label-input'>
          <Form.Label>Username:</Form.Label>
          <Form.Control className='label-input'
            type="text"
            name="username"
            id="username"
            value={formValues.username}
            placeholder="bigjoe"
            onChange={inputChange}
          />
        </div>
        <div className='label-input'>
          <Form.Label>Email:</Form.Label>
          <Form.Control className='label-input'
            type="email"
            name="email"
            id="email"
            value={formValues.email}
            placeholder="johndoe@email.com"
            onChange={inputChange}
          />
        </div>
        <div className='label-input'>
          <Form.Label>Password:</Form.Label>
          <Form.Control className='label-input'
            type="password"
            name="password"
            id="password"
            value={formValues.password}
            placeholder="Create Password"
            onChange={inputChange}
          />
        </div>

        <Button type="submit" disabled={buttonDisabled}>
          Submit
        </Button>

        <p>Already a member? Login <Link to='/login'>here.</Link></p>

      </Form>
    </div>
  );
}

export default RegistrationForm;

