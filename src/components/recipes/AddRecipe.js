import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import schema from './addRecipeSchema'
import * as yup from 'yup'
import axiosWithAuth from '../../utils/axiosWithAuth'
import { Form, Button } from 'react-bootstrap'
import './AddRecipe.css'

const initialFormValues = {
  title: '',
  source: '',
  ingredients: '',
  instructions: '',
  category: '',
  recipe_img: ''
}
const initialFormErrors = {
  title: '',
  source: '',
  ingredients: '',
  instructions: '',
  category: '',
  recipe_img: ''
}

const initialRecipes = []
const initialDisabled = true

const AddRecipe = () => {
  const [recipes, setRecipes] = useState(initialRecipes)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)
  const [category, setCategory] = useState('')
  let history = useHistory()

  const postNewRecipe = newRecipe => {
    axiosWithAuth().post('/recipes', newRecipe)
      .then(response => {
        console.log(response)
        setRecipes([response.data, ...recipes])
        history.push('/recipes');
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setFormValues(initialFormValues)
      })
  }

  const validate = (name, value) => {
    //for yup schema
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
          [name]: error.errors
        })
      })
  }

  const onChange = event => {
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
    setCategory('')
  }

  const submit = () => {
    const newRecipe = {
      title: formValues.title.trim(),
      source: formValues.source.trim(),
      ingredients: formValues.ingredients.trim(),
      instructions: formValues.instructions.trim(),
      category: formValues.category,
      recipe_img: formValues.recipe_img
    }
    postNewRecipe(newRecipe)
  }

  const onDropdownChange = (e) => {
    const { name, value } = e.target
    setCategory(value)
    setFormValues({
      ...formValues,
      [name]: value
    })
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
    <Form onSubmit={onSubmit} className='add-recipe'>
      <div className='label-input'>
        <h2 className='header'>Add Recipe</h2>
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={formValues.title}
          onChange={onChange}
          name='title'
          type='text'
        />
      </div>

      <div className='label-input'>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          onChange={onDropdownChange}
          value={category}
          name='category'
          required
        >
          <option disabled>- Select an option -</option>
          <option value='appetizer'>appetizer</option>
          <option value='entree'>entree</option>
          <option value='sides'>sides</option>
          <option value='dessert'>dessert</option>
          <option value='snack'>snack</option>
          <option value='beverage'>beverage</option>
        </Form.Control>
      </div>

      <div className='label-input'>
        <Form.Label>Source </Form.Label>
        <Form.Control
          value={formValues.source}
          onChange={onChange}
          name='source'
          type='text'
        />
      </div>
      <div className='label-input'>
        <Form.Label>Ingredients</Form.Label>
        <Form.Control as="textarea" rows={3}
          placeholder=" List ingredients here"
          value={formValues.ingredients}
          onChange={onChange}
          name='ingredients'
          type='text'
        />
      </div>

      <div className='label-input'>
        <Form.Label>Instructions</Form.Label>
        <Form.Control as="textarea" rows={3}
          placeholder=" Add instructions here"
          value={formValues.instructions}
          onChange={onChange}
          name='instructions'
          type='text'
        />
      </div>

      <div className='label-input'>
        <Form.Label htmlFor="">Recipe img</Form.Label>
        <Form.Control
          value={formValues.recipe_img}
          onChange={onChange}
          name='recipe_img'
          type="text"
        />
      </div>
      {/* <Form>
        <Form.Group>
          <Form.File id="exampleFormControlFile1" label="Example file input" />
        </Form.Group>
      </Form> */}

      <Button color='danger' disabled={disabled} type='submit'>Submit</Button>

    </Form>

  )
}

export default AddRecipe;