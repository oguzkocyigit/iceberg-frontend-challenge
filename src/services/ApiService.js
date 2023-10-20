import axios from 'axios';

const instance = axios.create({
    baseURL: `https://api.airtable.com/v0/${process.env.VUE_APP_AIRTABLE_PROJECT_ID}`,
    headers: {
        'Authorization': `Bearer ${process.env.VUE_APP_AIRTABLE_TOKEN_ID}`
    }
});

export default instance;
