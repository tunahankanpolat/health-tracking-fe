import axios from "axios";
export default class AuthService {
    async login(username, password) {
        return await axios.post(process.env.EXPO_PUBLIC_AUTH_URL, {
            "username":username,
            "password": password,
        });
    }
}
