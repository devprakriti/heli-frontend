import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Import Tailwind CSS
import './assets/tailwind.css';  // This imports your Tailwind CSS file
import 'vue-multiselect/dist/vue-multiselect.min.css';
// import VueDatePicker from 'vue-datepicker';
import Aura from '@primevue/themes/aura'
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import PanelMenu from 'primevue/panelmenu';

// createApp(App).use(router).mount('#app');


// // main.js or main.ts
// import { createApp } from 'vue'
// import App from './App.vue'

// Import FontAwesome libraries
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { definePreset } from '@primevue/themes';

library.add(faEdit, faTrash, faExchangeAlt)

const app = createApp(App)
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.950}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.200}',
                    200: '{zinc.300}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            }
        }
    },
});
app.use(PrimeVue,{
    ripple: true,
    theme:{
        preset: MyPreset,
        options:{
            darkModeSelector: false || 'none'
        }
    }
});
app.use(PanelMenu);
app.use(ToastService);
app.component('PanelMenu', PanelMenu);
app.component('font-awesome-icon', FontAwesomeIcon)
// app.component('VueDatePicker', VueDatePicker)
app.use(router).mount('#app')


