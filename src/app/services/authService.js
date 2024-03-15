import axios from "axios";
export default class AuthService {
    async login(username, password) {
        console.log(process.env.EXPO_PUBLIC_AUTH_URL);
        console.log(username);
        console.log(password);
        return await axios.post(process.env.EXPO_PUBLIC_AUTH_URL, {
            "username":username,
            "password": password,
        });
    }
}
