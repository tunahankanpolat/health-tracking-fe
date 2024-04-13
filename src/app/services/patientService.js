import axios from "axios";
export default class PatientService {
    async createPatient(token, patient) {
        return await axios.post(process.env.EXPO_PUBLIC_CREATE_PATIENT_URL, patient, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    async getAllPatients(token) {
        return await axios.get(process.env.EXPO_PUBLIC_GET_ALL_PATIENT_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    async getPrescriptions(token, patientId) {
        return await axios.get(`${process.env.EXPO_PUBLIC_GET_ALL_PATIENT_URL}/${patientId}/prescriptions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
