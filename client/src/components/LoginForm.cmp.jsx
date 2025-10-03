//utility imports
import {useState} from "react";

//services imports
import {loginRequest} from "../services/auth.js";

export const LoginFormCmp = () => {
    //states for login info
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const sendFormData = (e) => {
        e.preventDefault();
        //save data in object
        const userData = {
            playerName: userName,
            password: password,
        }
        //send data through REST
        if (userData.password && userData.playerName) {
            console.log(userData);
            //call login request service
            loginRequest(userData);
        } else {
            console.log('register data are missing');
        }
    }

    return (
        <>
            <h3>Login Form</h3>
            <form onSubmit={sendFormData}>\
                <label>
                    UserName:
                    <input id={'userName'}
                           name={'userName'}
                           placeholder={'Insert your userName'}
                           onChange={(e) => setUserName(e.target.value)}/>
                </label>
                <label>
                    Password:
                    <input id={'password'}
                           name={'password'}
                           placeholder={'Insert your password'}
                           onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <button type="submit" disabled={(!userName && !password)}>Login</button>
            </form>
        </>
    );
};