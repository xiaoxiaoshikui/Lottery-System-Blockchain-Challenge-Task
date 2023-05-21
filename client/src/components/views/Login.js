import React, {useState} from 'react';
import {api} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {ReactLogo} from "../ui/ReactLogo";
import {message} from "antd";
// import Register from "./Register";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {
  const history = useHistory();
  // const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const doRegister = async () =>{
    history.push(`/Register`);
  }
  const [isLoading, setIsLoading] = useState(false);
  const doLogin = async () => {
    try {
      setIsLoading(true);
      // const requestBody = JSON.stringify({username, password});
      const response = await api.post(`/login?username=${username}&password=${password}`);
      console.log(response)
      // Get the returned user and update a new object.
      // const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', response.data.address);
      localStorage.setItem('privatekey', response.data.privatekey);
      localStorage.setItem('money', response.data.money);
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/UsersOverview`);
      console.log(localStorage)
    } catch (error) {
      message.error('Login Error,my address or privatekey is already error! ');
      history.push(`/login`);
      // alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">

        <div className="login form">
          <h1 className="register title">Log in here!</h1>
          <ReactLogo width="60px" height="60px"/>
          <FormField
            label="My Address"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="PrivateKey"
            value={password}
            onChange={n => setPassword(n)}
          />

          <div className="login button-container">
            <Button
              disabled={isLoading || !username || !password|| username.trim() ==="" || password.trim() ===""}
              width="50%"
              onClick={() => doLogin()}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
            <Button
                // disabled={!username || !name}
                width="50%"
                onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
