import axios from "axios";
export default class PrescriptionService {
  async createPrescription(token, prescription) {
    return await axios.post(
      process.env.EXPO_PUBLIC_CREATE_PRESCRIPTION_URL,
      prescription,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
