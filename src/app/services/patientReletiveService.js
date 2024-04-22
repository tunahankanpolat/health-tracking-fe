import axios from "axios";
export default class PatientRelativeService {
  async getPatientId(token) {
    return await axios.get(process.env.EXPO_PUBLIC_GET_PATIENT_ID_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
