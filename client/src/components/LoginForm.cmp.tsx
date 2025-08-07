import {type FormEvent, useState} from "react";
import {useSocket} from "../context/Socket.ctx.tsx";

export const LoginFormCmp = () => {
    //states for login
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    //socket from context
    const {socket, isConnected} = useSocket()

    const sendFormData = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        //save data in object
        const userData = {
            playerName: userName,
            password: password,
        }
        //check connection
        if(!isConnected){
            console.log('Not connected to the server');
            return
        }

        //send data
        if(userData.password && userData.playerName){
            console.log(userData);
            socket.emit('user-info', {
                withCredentials: true,
                message: userData,
                timestamp: new Date().toISOString(),
            })
        }else{
            console.log('Info empty')
        }
    }

    return (
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
            <button type="submit" disabled={!isConnected && (!userName && !password)}>Login</button>
        </form>
    );
};