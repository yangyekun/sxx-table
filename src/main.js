import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import themePreset from './themePreset.js';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice'; 
import zh_cn from './assets/zh_cn.js';
// import OrpType from './components/orpType.vue'
// import OrpStatus from './components/orpStatus.vue'
// import OrpButton from './components/orpButton.vue'
// import OrpMsg from './components/orpMsg.vue'
import OrpActions from './components/orpActions.vue'
import BtnActions from './components/btnActions.vue'
import './utils/ag-grid.js'

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-balham.css";

const app = createApp(App)
// app.use(router)
// app.component('OrpType', OrpType)
// app.component('OrpStatus', OrpStatus)
// app.component('OrpButton', OrpButton)
// app.component('OrpMsg', OrpMsg)
app.component('OrpActions', OrpActions)
app.component('BtnActions', BtnActions)
app.use(PrimeVue, {
  theme: {
    preset: themePreset,
  },
  locale: zh_cn,
  ripple: true,
});
app.use(ToastService).use(ConfirmationService);

app.mount('#app')
