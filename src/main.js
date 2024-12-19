import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Import Tailwind CSS
import './assets/tailwind.css';  // This imports your Tailwind CSS file
import 'vue-multiselect/dist/vue-multiselect.min.css';
// import VueDatePicker from 'vue-datepicker';
import Aura from '@primevue/themes/aura'
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
// createApp(App).use(router).mount('#app');


// // main.js or main.ts
// import { createApp } from 'vue'
// import App from './App.vue'

// Import FontAwesome libraries
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit, faTrash, faExchangeAlt)

const app = createApp(App)
app.use(PrimeVue,{
    ripple: true,
    theme:{
        preset: Aura
    }
})
app.use(ToastService);
app.component('font-awesome-icon', FontAwesomeIcon)
// app.component('VueDatePicker', VueDatePicker)
app.use(router).mount('#app')


