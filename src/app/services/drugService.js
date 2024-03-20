import axios from "axios";
export default class DrugService {
    async createDrug(token, drug) {
        return await axios.post(process.env.EXPO_PUBLIC_CREATE_DRUG_URL, drug);
    }
}
