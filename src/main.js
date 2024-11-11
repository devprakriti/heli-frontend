import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Import Tailwind CSS
import './assets/tailwind.css';  // This imports your Tailwind CSS file
import 'vue-multiselect/dist/vue-multiselect.min.css';
// createApp(App).use(router).mount('#app');


// // main.js or main.ts
// import { createApp } from 'vue'
// import App from './App.vue'

// Import FontAwesome libraries
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add icons to the library
library.add(faEdit, faTrash, faExchangeAlt)

const app = createApp(App)

// Register the FontAwesomeIcon component globally
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router).mount('#app')


