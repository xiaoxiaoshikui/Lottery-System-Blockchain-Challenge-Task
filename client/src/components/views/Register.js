import React, {useState} from 'react';
import {api} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { message} from 'antd'
// import { Input, Layout, Notification } from 'element-react';
// import {ReactLogo} from "../ui/ReactLogo";
// import Register from "./Register";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="register field">
            <label className="register label">
                {props.label}
            </label>
            <input
                className="register input"
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

const Register = props => {
    const history = useHistory();
    // const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const doLogin = async () =>{
        history.push(`/Login`);
    }


    const doRegister = async () => {
        try {
            const response = await api.post(`/regist?username=${username}&password=${password}`);
            localStorage.setItem('token', response.data.address);
            localStorage.setItem('privatekey', response.data.privatekey);
            localStorage.setItem('money', response.data.money);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/UsersOverview`);
        } catch (error) {
            // history.push(`/Error`);
            message.error('error:'+error+'Register Error,address is already used! ');
            history.push(`/Register`);
            // alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="register container">

                <div className="register form">
                    <Button
                        // disabled={!username || !password}
                        width="20%"
                        onClick={() => doLogin()}
                    >
                        Back
                    </Button>
                    <h1 className="register title">Register here please!</h1>
                    <h1 className="register subtitle">"address and privatekey that are both not empty words!"</h1>
                    <FormField
                        label="my address"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    {/*<FormField*/}
                    {/*    label="Name"*/}
                    {/*    value={name}*/}
                    {/*    onChange={n => setName(n)}*/}
                    {/*/>*/}
                    <FormField
                        label="privatekey"
                        value={password}
                        onChange={un => setPassword(un)}
                    />

                    <div className="register button-container">

                        <Button
                            disabled={!username || !password || username.trim() ==="" || password.trim() ===""}
                            width="100%"
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
export default Register;
