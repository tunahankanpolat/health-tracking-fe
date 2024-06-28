import axios from "axios";
export default class DoctorService {
  async createDoctor(token, doctor) {
    return await axios.post(process.env.EXPO_PUBLIC_CREATE_DOCTOR_URL, doctor);
  }
  async getAllDoctors(token) {
    return await axios.get(process.env.EXPO_PUBLIC_GET_ALL_DOCTORS_URL);
  }
  async getPatients(token) {
    return await axios.get(process.env.EXPO_PUBLIC_GET_DOCTORS_PATIENTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getDoctor(token, doctorId) {
    console.log(doctorId);
    console.log(token);
    return await axios.get(
      `${process.env.EXPO_PUBLIC_GET_DOCTOR_URL}/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
