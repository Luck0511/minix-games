import axios from "axios";
import {SERVER_URL} from "../context/Socket.ctx.jsx";

export function loginRequest(credentials) {
    try{
        axios.post(SERVER_URL, credentials)
            .then((response) => {
                console.log("request successful", response.data)
            })
    }catch(err){
        console.error('Error during server login request: ', err);
    }
}

export function registerRequest(credentials) {
    try {
        axios.post(`${SERVER_URL}/register`, credentials)
            .then((response) => {
                console.log("request successful", response.data)
            })
    } catch (err) {
        console.error('Error during server register request: ', err);
    }
}