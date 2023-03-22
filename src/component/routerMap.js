import HomeNew from '../component/homeNew'
import Home from "../component/home"
import Topics from '../component/topics'
import EditPage from '../component/editPage'
import { Button, Row, Col, Affix } from 'antd';
import LoginPage from '../component/login'
import PostDetailPage from "../component/postDetailPage";
import ValidateMailPage from "../component/validateMailPage"
import UserPage from "../component/userPage"
import AddTaskPage from "../component/addTaskPage"
import TaskHistoryPage from "../component/taskHistoryPage";
import ResetPaswordPage from "../component/resetPasswordPage"
import DashboardPage from './dashboardPage';
import HttpPage from './httpPage';
import DetailPage from './detailPage'
const router = [
    {
        path: '/login',
        component: LoginPage,
        auth: false
    }, {
        path: '/',
        component: Home,
        auth: false
    },  {
        path: '/dashboard',
        component: DashboardPage,
        auth: false
    },{
        path: '/detailPage',
        component: DetailPage,
        auth: false
    },{
        path: '/httpPage',
        component: HttpPage,
        auth: false
    },{
        path: '/editPage',
        component: EditPage,
        auth: true
    },{
        path: '/postDetailPage',
        component: PostDetailPage,
        auth: true
    },{
        path: '/validateMailPage',
        component: ValidateMailPage,
        auth: false
    },{
        path: '/userPage',
        component: UserPage,
        auth: true
    },{
        path:'/addTaskPage',
        component:AddTaskPage,
        auth:true
    }
    ,{
        path:'/taskHistoryPage',
        component:TaskHistoryPage,
        auth:true
    },{
        path: '/resetPasswordPage',
        component: ResetPaswordPage,
        auth: false
    }
]
export default router;