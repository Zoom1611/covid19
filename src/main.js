import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import moment from 'moment'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(ElementPlus)
app.use(moment)
app.use(router)
.mount('#app')


