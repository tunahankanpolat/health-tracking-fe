import axios from "axios";
export default class DoctorService {
    async createDoctor(token, doctor) {
        return await axios.post(process.env.EXPO_PUBLIC_CREATE_DOCTOR_URL, doctor);
    }
}
