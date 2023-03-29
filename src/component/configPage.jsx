import React, { useState, useEffect } from 'react'
import { Row, Col, message, Empty, Card, Button, Spin, Tab, Tabs, Divider, Modal, Image, Input } from 'antd';
import { useLocation } from 'react-router-dom'
import PieChart from 'echarts/charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from '../utils/axiosUtils'
import { Table } from 'antd';
import { Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'
import styled, { keyframes } from 'styled-components'
import { EditOutlined, AppleFilled, AndroidFilled } from '@ant-design/icons';
import { List } from 'rc-field-form';
import ReactECharts from 'echarts-for-react';
import { use } from 'echarts';
import BaseConfig from './baseConfig'
import AllowDenyList from './allowDenyList';
import Authentication from './authentication';
import Ratelimit from './ratelimit';
const RowDiv = styled(Row)`
background: rgb(245, 245, 247);

`;
const TabsDiv = styled(Tabs)`
.ant-tabs-content-holder{
    background:white;
}
height : 60vh;
`


function ConfigPage(props) {
    const [appConfig, setAppConfig] = useState({});
    const [size, setSize] = useState('large');
    const [baseConfigData,setBaseConfigData]=useState({})
    const[port,setPort]=useState('undefined');

    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);
    useEffect(() => {
        var port = searchParam.get("port");
        if (port == undefined || port == null) {
            return;
        }
        var routeId = searchParam.get("routeId");
        if (routeId == undefined || routeId == null) {
            return;
        }
        setPort(port);
        requestAppConfig(port,routeId);
    }, []);
    const requestAppConfig = (currentPort,routeId) => {
        Request.get("/appConfig").then(res => {
            if (res.data.response_code == 0) {
                let apiConfigs = res.data.response_object.api_service_config.filter(item=>item.listen_port==currentPort)[0].service_config.routes.filter(item=>item.route_id==routeId)[0];
                setAppConfig(apiConfigs);
                constructConfigData(apiConfigs,currentPort);
                console.log(apiConfigs);
            }
        });

    }
    const constructConfigData=(appConfig,currentPort)=>{
        const tableData=appConfig?.route_cluster?.routes.map(item=>({
            endpoint:item.base_route.endpoint,
            key:CommonUtils.guid(),
            weight:item.weight?item.weight:100,
            headerkey: item.header_key?item.header_key:"user-agent",
            headerValueType: item.header_value_mapping_type?.type?item.header_value_mapping_type?.type:"Text", 
            headerValueMatch: "test"
        }));
        const port=currentPort;
        const prefix=appConfig?.matcher?.prefix;
        const routeAlgorighm=appConfig?.route_cluster?.type;
        setBaseConfigData({
            tableData:tableData,
            port:port,
            prefix:prefix,
            routeAlgorighm:routeAlgorighm
        });
 

    }
    const getTabs = () => {
        const firstPage = {
            label: `Base Config`,
            key: 1,
            children: <BaseConfig baseConfigData={baseConfigData} setBaseConfigData={setBaseConfigData}/>,
        };
        const secondPage = {
            label: `AllowDenyList`,
            key: 2,
            children: <AllowDenyList appConfig={appConfig} setAppConfig={setAppConfig}/>,
        };
        const thirdPage = {
            label: `Authentication`,
            key: 3,
            children: <Authentication appConfig={appConfig} setAppConfig={setAppConfig}/>,
        };
        const forthPage = {
            label: `Ratelimit`,
            key: 4,
            children: <Ratelimit appConfig={appConfig} setAppConfig={setAppConfig}/>,
        };
        return [firstPage, secondPage, thirdPage, forthPage];
    
    };
    const handleSaveButtonOnClick=()=>{
        
    }

    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>
            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} style={{ height: "60vh" }}>
                    <Card  title={port===undefined?"New Config":"Change Config"} extra={<Button type="primary" onClick={handleSaveButtonOnClick}>Save</Button>}>
                    <TabsDiv

                        defaultActiveKey="1"
                        type="card"
                        size={size}
                        items={getTabs()}
                    />
                </Card>
                </Col>
               
            </RowDiv>
        </div>
    );

}
export default withRouter(ConfigPage);