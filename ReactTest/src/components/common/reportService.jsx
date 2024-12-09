import axios from 'axios'; // Assuming you are using axios

const serviceBase = 'https://faap.api.airpocket.app/'; // Replace with your base URL


export const getItems = async (flt_id, crew_id) => {
    try {
        var data = []
        const response = await axios.get(`${serviceBase}/neerja/scc/` + flt_id + '/' + crew_id); // Replace `/items` with your endpoint
        data.push(response.data)
        return data; // Return the data
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error; // Re-throw the error to handle it in the calling component
    }
}
