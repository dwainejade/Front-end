import React, { useState, useEffect } from 'react';
import './LoginForm.less';
import schema from './loginSchema'
import  * as yup from 'yup'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'

const initialFormValues = {
  email: '',
  password: ''
}
const initialFormErrors = {
  email: '',
  password: ''
}
const initialUsers = []
const initialDisabled = true




const LoginForm = () => {

  const [users, setUsers] = useState(initialUsers)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)

  const postNewUsers = newUser => {
    axios.post('https://reqres.in/api/users', newUser)
      .then(response => {
        setUsers([...users, response.data])
      })
      .catch(error => {
        // debugger 
        console.log(error)
      })
      .finally(() => {
        setFormValues(initialFormValues)
      })
  }
    const validate = (name, value) => {
        //yup validation schema
        yup
          .reach(schema, name)
          .validate(value)
          .then(valid => {
            setFormErrors({
              ...formErrors,
              [name]: ""
            })
          })
          .catch(error => {
           setFormErrors({
             ...formErrors,
              [name]: error.errors[0]
          })
         })
    }

    const onChange =  event => {
      const { name, value } = event.target
      change(name, value)
  }

    const change = (name, value) => {
      validate(name, value)
      setFormValues({
        ...formValues,
        [name]: value
    })
  }

    const onSubmit = event => {
      event.preventDefault()
      submit()
  }

    const submit = () => {
      const newUser = {
        email: formValues.email.trim(),
        password: formValues.password.trim()
    }
      postNewUsers(newUser)
  }

    useEffect(() => {
      console.log(formValues)
   }, [formValues])

    useEffect(() => {
      schema.isValid(formValues)
        .then(valid => {
         setDisabled(!valid)
       })
    }, [formValues])




  return (
    <form onSubmit={onSubmit}>
      <h1>Login Form</h1>

        <div> 
          <div>{formErrors.name}</div>
          <div>{formErrors.email}</div>
          <div>{formErrors.password}</div>
          <div>{formErrors.terms}</div>
        </div>

        <label>Email:     </label>
        <input 
        value={formValues.email}
        onChange={onChange}
        name='email'
        type='email'
        />
        <br></br>
        <label>Password:     </label>
        <input 
        value={formValues.password}
        onChange={onChange}
        name='password'
        type='password'
        />

      <button disabled={disabled} id='submitBtn'>Submit</button>
    </form>
  )
}

export default LoginForm