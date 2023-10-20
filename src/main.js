import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "@/assets/style/main.scss"

import googleMap from '@fawmi/vue-google-maps'

const googleMapOption = {
    apiKey: 'AIzaSyAm9lgJoWHzZbB_z8QzkTQciA6igPZC4Gs',
}

const app = createApp(App);

app.use(googleMap, googleMapOption)

createApp(App).use(store).use(router).mount('#app')
