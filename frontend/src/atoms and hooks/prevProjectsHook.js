import axios from "axios";

export default function usePrevProjects () {
    const userId = localStorage.getItem('userId');

        const fetchProjects = async () => {
            const response = await axios.get(`http://localhost:3000/projectsHistory?type=retrieveDocumentTitles&userId=${userId}`);
            const data = response.data;

            return data
        }

    return {
        fetchProjects
    }
}