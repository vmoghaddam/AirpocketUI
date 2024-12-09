import axios from 'axios';

const serviceBase = 'https://ava.apinet.airpocket.app/odata/users'; 


export const getItems = async (flt_id, crew_id) => {
    try {
        var data = []
        //const response = await axios.get(`${serviceBase}/neerja/scc/` + flt_id + '/' + crew_id); 
        const response = await axios.get(`${serviceBase}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error; 
    }
}
