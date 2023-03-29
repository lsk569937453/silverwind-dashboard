
import { Button, Row, Col, Affix } from 'antd';
import DashboardPage from './dashboardPage';
import HttpPage from './httpPage';
import DetailPage from './detailPage'
import ConfigPage from './configPage';
const router = [
     {
        path: '/dashboard',
        component: DashboardPage,
        auth: false
    },{
        path: '/configPage',
        component: ConfigPage,
        auth: false
    },{
        path: '/httpPage',
        component: HttpPage,
        auth: false
    }
]
export default router;