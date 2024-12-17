import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Import Tailwind CSS
import './assets/tailwind.css';  // This imports your Tailwind CSS file
import 'vue-multiselect/dist/vue-multiselect.min.css';
import VueDatePicker from 'vue-datepicker';

// Register the component globally


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

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker)
app.use(router).mount('#app')


