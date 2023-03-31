
import DashboardPage from './dashboardPage';
import ListenerListPage from './listenerListPage';
import ConfigPage from './configPage';
const router = [
     {
        path: '/',
        component: DashboardPage,
        auth: false
    },{
        path: '/configPage',
        component: ConfigPage,
        auth: false
    },{
        path: '/listenerlist',
        component: ListenerListPage,
        auth: false
    },{
        path:'/',
    }
]
export default router;