/*
    This is an api object that we use instead of Axios to send our requests. This automatically
    adds the authorization token to our requests for us.
*/

import axios from axios
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        // only runs of a token was successfuly retrieved
        if (token){
            config.headers.Authorization = `Bearer ${token}` // this is how you pass a JWT Access Token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api