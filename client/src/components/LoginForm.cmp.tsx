import {type FormEvent, useState} from "react";
import {useSocket} from "../context/Socket.ctx.tsx";

export const LoginFormCmp = () => {
    //states for login
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    //socket from context
    const {socket} = useSocket()

    const sendFormaData = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        //save data in object
        const userData = {
            playerName: userName,
            password: password,
        }
        //send data
        if(userData){
            socket.emit('user-info', {
                withCredentials: true,
                message: userData

            })
        }
    }

    return (
        <form onSubmit={sendFormaData}>
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
            <button type="submit">Login</button>
        </form>
    );
};