import axios from "axios";
export default class PatientRelativeService {
    async createPatient_relative(token, patientrelative) {
        return await axios.post(process.env.EXPO_PUBLIC_CREATE_PATIENT_RELATIVE_URL, patientrelative);
    }
}
