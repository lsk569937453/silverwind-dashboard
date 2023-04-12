import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Card,message } from 'antd';

import Request from '../utils/axiosUtils'
import { Table } from 'antd';

import { withRouter } from 'react-router-dom'

import styled from 'styled-components'

const RowDiv = styled(Row)`
background: rgb(245, 245, 247);
`;
const CardDiv = styled(Card)`
.ant-card-body{
    padding:0px;
}
`;
function ListenerListPage(props) {
    const [tableData, setTableData] = useState([])

    useEffect(() => {

        requestAppConfig();

    }, []);
    const requestAppConfig = () => {

        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                // setAppConfig(res.data.response_object.api_service_config);
                // const set=new Map();
                let tableData = res.data.response_object.api_service_config.flatMap((p) => {
                    // "port": p.listen_port,
                    // "type": "HTTP",
                    return p.service_config.routes.map((item) => ({
                        "port": p.listen_port,
                        "apiServiceId":p.api_service_id,
                        "type": p.service_config.server_type,
                        "pathPrefix": item.matcher.prefix,
                        "routeId": item.route_id
                    }));
                });
                setTableData(tableData);
            }
        }).catch(error=>{
            console.error(error);
            message.error("Cause error when request the silverwind admin port,the error is "+error.message);
        });

    }

    const handleEditOnClick = (record) => {
        const { apiServiceId, routeId } = record
        let { history } = props;
        history.push('/configPage?apiServiceId=' + apiServiceId + "&routeId=" + routeId);
    }
    const handleDeleteOnClick = (record) => {
        const { routeId } = record;
        Request.delete("/route/"+routeId).then(res=>{
            if (res.data.response_code === 0) {
                message.info({
                    content: 'Delete route successfully!',
                    duration: 3,
                    onClose: () => {
                        window.location.reload();

                    }
                  });
            }
        });
        // Request.get("/appConfig").then(res => {
        //     if (res.data.response_code === 0) {
        //         const apiConfigs = res.data.response_object.api_service_config;
        //         const newApiConfigs=apiConfigs.map(item=>{
        //             const newRoutes=item.service_config.routes.filter(route=>route.route_id!==routeId);
        //             if(newRoutes.length>0){
        //                 item.service_config.routes=newRoutes;
        //                 return item;
        //             }else{
        //                 return undefined;
        //             }
        //         }).filter(item=>item!==undefined);

    
    
        //         Request.post("/appConfig", newApiConfigs).then(res => {
        //             message.info({
        //                 content: 'Delete route successfully!',
        //                 duration: 3,
        //                 onClose: () => {
        //                     window.location.reload();

        //                 }
        //               });
        //         });
    
        //     }
        // });
    }
    const columns = [
        {
            title: 'Port',
            dataIndex: 'port',
            key: "port",
            width: '30%',
            sorter: (a, b) => a.port - b.port,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: "type",
            sorter: (a, b) => a.type.length - b.type.length,
            defaultSortOrder: 'descend',
        }, {
            title: 'Path Prefix',
            dataIndex: 'pathPrefix',
            key: "pathPrefix",
            sorter: (a, b) => a.pathPrefix.length - b.pathPrefix.length,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Operation',
            dataIndex: 'detail',
            key: "detail",
            render: (text, record) =>
                <>
                    <Row>
                        <Col span={4}>
                        <a style={{ "cursor": "pointer" }} onClick={() => handleEditOnClick(record)}>Edit</a>
                        </Col>
                        <Col>
                        <a style={{ "cursor": "pointer" }} onClick={() => handleDeleteOnClick(record)}>Delete</a>
                        </Col>
                    </Row>
                </>,

        },

    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const handleCreateButtonOnClick = () => {
        let { history } = props;
        history.push('/configPage');
    }
    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>

            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} >

                    <RowDiv >

                        <Col xs={{ span: 24 }} >
                            <CardDiv title="Connection Listener" bordered={false} extra={<Button type="primary" onClick={handleCreateButtonOnClick}>Create New Listener</Button>}>
                                <Table columns={columns} dataSource={tableData} onChange={onChange} rowKey="routeId" />
                            </CardDiv>
                        </Col>

                    </RowDiv>

                </Col>


            </RowDiv>
            {/* </Spin> */}
        </div>
    );

}
export default withRouter(ListenerListPage);