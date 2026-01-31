import axios from "axios";
import {API_URL} from "../context/Socket.ctx.jsx";

const lobbiesAPI = API_URL + '/lobbies';
const playersAPI = API_URL + '/players';

//sets credentials true by default
axios.defaults.withCredentials = true;

/**
 * sends a GET request to fetch the list of public lobbies from the server
 * @returns {Promise<Array>} - A promise that resolves to an array of public lobbies
 * @Throws {Error} - Throws an error if the request fails
**/
export const fetchPublicLobbies = () => {
    return axios.get(`${lobbiesAPI}/activeLobbies`)
        .then((response) => {
            console.log("Fetched public lobbies:", response.data);
            return response.data.activeLobbies || [];
        })
        .catch((err) => {
            console.error('Error fetching public lobbies:', err);
            throw err;
        });
}