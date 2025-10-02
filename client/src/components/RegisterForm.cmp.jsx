import {useState} from "react";
import {registerRequest} from "../services/auth.js";

export const RegisterFormCmp = () => {
    //states for registration info
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
            //call register request service
            registerRequest(userData);
        } else {
            console.log('register data are missing');
        }
    }

    return (
        <>
            <h3>Register Form</h3>
            <form onSubmit={sendFormData}>
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
    )
}