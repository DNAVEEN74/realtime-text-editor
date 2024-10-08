import { atom, selectorFamily } from "recoil";
import axios from 'axios';

export const fetchParamsState = atom({
    key: 'fetchParamsSelector',
    default: {
        route: '',
        body: {}
    }
});

export const userIdState = atom({
    key: 'userIdState',
    default: '',
});

export const fetchDataSelector = selectorFamily({
    key: 'fetchDataSelector',
    get: ({ route, body }) => async ({ get }) => {
        if (!route || !body) return null;

        try {
            const response = await axios.post(`http://localhost:3000/${route}`, body);
            const data = response.data;

            return { token: data.token, userId: data.userId };
        } catch (error) {
            console.error("Error in API call:", error);
            return null;
        }
    }
});