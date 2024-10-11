import axios from "axios";

export default function usePrevProjects () {
    const userId = localStorage.getItem('userId');

        const fetchProjects = async () => {
            const response = await axios.get(`https://collabedit-backend.onrender.com/projectsHistory?type=retrieveDocumentTitles&userId=${userId}`);
            const data = response.data;

            return data
        }

    return {
        fetchProjects
    }
}