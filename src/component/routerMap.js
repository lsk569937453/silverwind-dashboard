
import DashboardPage from './dashboardPage';
import ListenerListPage from './listenerListPage';
import ConfigPage from './configPage';
import StartupPage from './startupPage';
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
        path: '/startup',
        component: StartupPage,
        auth: false
    }
]
export default router;