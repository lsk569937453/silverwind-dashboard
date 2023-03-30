import React, { useState, useEffect } from 'react'
import { Row, Col,  Card} from 'antd';

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
function HttpPage(props) {
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
                    return p.service_config.routes.map((item)=>({
                     "port": p.listen_port,
                     "type": "HTTP",
                     "pathPrefix":item.matcher.prefix,
                     "routeId":item.route_id
                    }));
                });
                setTableData(tableData);
            }
        });

    }
 
    const detailClick=(record)=>{
        const { port,routeId } = record
        let { history } = props;
        history.push('/configPage?port=' + port+"&routeId="+routeId);
    }
    const columns = [
        {
            title: 'Port',
            dataIndex: 'port',
            key:"port",
            width: '30%',
          
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key:"type",

        },{
            title: 'Path Prefix',
            dataIndex: 'pathPrefix',
            key:"pathPrefix",
        },
        {
            title: 'Detail',
            dataIndex: 'detail',
            key:"detail",
            render: (text,record) => <a style={{"cursor":"pointer"}}   onClick={()=>detailClick(record)}>Detail</a>,

        },

    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>

            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} >

                    <RowDiv >

                        <Col xs={{ span: 24 }} >
                            <CardDiv title="Connection Listener" bordered={false}>
                                <Table columns={columns} dataSource={tableData} onChange={onChange}   rowKey="routeId" />
                            </CardDiv>
                        </Col>

                    </RowDiv>

                </Col>


            </RowDiv>
            {/* </Spin> */}
        </div>
    );

}
export default withRouter(HttpPage);