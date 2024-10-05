import { atom, selectorFamily } from "recoil";
import axios from 'axios';

export const fetchParamsState = atom({
    key: 'fetchParamsSelector',
    default:{
        route: '',
        body: {

        }
    }
})

export const fetchDataSelector = selectorFamily({
    key: 'fetchDataSelector',
    get: ({ route, body }) => async () => {
        if (!route || !body) return null;

        try {
            const response = await axios.post(`http://localhost:3000/${route}`, body);
            const data = response.data;
            console.log('API Response:', data);

            return { token: data.token };
        } catch (error) {
            console.error("Error in API call:", error);
            return null;
        }
    }
});