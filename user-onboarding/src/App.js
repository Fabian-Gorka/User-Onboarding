
import './App.css';
import Form from'./Form.js';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';
import FormSchem from './FormSchem';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  termsOfService: false,
}

const initialErrors = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  termsOfService: false,
}

const initialDisabled = true


function App() {
  
  const [users, setUsers] = useState([])
  const [formVal, setFormVal] = useState(initialValues)
  const [formErr, setFormErr] = useState(initialErrors)
  const [disabled, setDisabled] = useState(initialDisabled)

  const getUsers = () => {
    axios.get('https://reqres.in/api/users')
    .then(res => {
      console.log(res.data.data)
      setUsers(res.data.data)
    })
    .catch(err => {
      console.log(err);
    })
  }
  
  const postNewUser = newUser => {
    axios.post('https://reqres.in/api/users', newUser)
    .then(res => {
      setUsers([...users, res.data])
      console.log(res.data.data)
    })
    .catch(err => {
      console.log(err);
    })
    setFormVal(initialValues)
  }

  const inputChange = (name, value) => {
    yup.reach(FormSchem, name)
      .validate(value)
      .then(() => {
        setFormErr({...formErr, [name]: ''})
      })
      .catch(err => {
        setFormErr({...formErr, [name]: err.errors[0]})
      })
    setFormVal({
      ...formVal,
      [name]: value 
    })
  }
  const formSubmit = () => {
    const newUser = {
      first_name: formVal.first_name.trim(),
      last_name: formVal.last_name.trim(),
      email: formVal.email.trim(),
      password: formVal.password.trim(),
      termsOfService:formVal.termsOfService,
    }
    postNewUser(newUser)
  }  

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    FormSchem.isValid(formVal).then(valid => setDisabled(!valid))
  }, [formVal])

  return (
    <div className="App">
      <header className="App-header">
      <h1>Users</h1>
       {users.map((user, idx) => {
        return (
          <div key={idx}>
            <p>Name: {`${user.first_name} ${user.last_name}`}</p>
            <p>Email: {user.email}</p>

          </div>
          )
        })
        }

        <Form 
          values={formVal}
          change={inputChange}
          submit={formSubmit}
          disabled={disabled}
          errors={formErr} />
      </header>
    </div>
  );
}

export default App;
