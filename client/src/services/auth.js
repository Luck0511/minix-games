import axios from "axios";
import {API_URL} from "../context/Socket.ctx.jsx";

export function loginRequest(credentials) {
    try{
        axios.post(`${API_URL}/login`, credentials)
            .then((response) => {
                console.log("request successful", response.data)
            })
    }catch(err){
        console.error('Error during server login request: ', err);
    }
}

export function registerRequest(credentials) {
    try {
        const {playerName, password} = credentials;
        if (!playerName || !password) {
            console.error('Missing registration credentials');
            return;
        }
        if (password.length < 8) {
            console.error('Password must be at least 8 characters long');
            return;
        }
        axios.post(`${API_URL}/register`, {playerName, password})
            .then((response) => {
                console.log("request successful", response.data)
            })
    } catch (err) {
        console.error('Error during server register request: ', err);
    }
}