import React, { useState, useEffect } from 'react'
import { Row, Col, Progress, Empty, Card, Button, Spin, Affix, Divider, Modal, Image } from 'antd';
import { useLocation } from 'react-router-dom'
import PieChart from 'echarts/charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from '../utils/axiosUtils'
import { Table } from 'antd';

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'
import styled, { keyframes } from 'styled-components'
import { EditOutlined, AppleFilled, AndroidFilled } from '@ant-design/icons';
import { List } from 'rc-field-form';
import ReactECharts from 'echarts-for-react';

const LoadingDiv = styled(Spin)`
`
const ButtonDiv = styled(Button)`
font-weight: 600;
`
const LineDiv = styled.div`
display: inline-block;
background:#fff;
padding-left: 10px;
    padding-right: 10px;
    border-radius: 10px;
`;
const FontDiv = styled.div`
font-size: 60px;
    font-weight: bold;
`
const APIFontDiv = styled.div`
font-size: 21px;
    font-weight: bold;
    padding-top: 10px;
    text-align: center;
    color: rgba(0,0,0,0.25);
`
const EntrypointsDiv = styled.div`
font-size: 30px;
    font-weight: bold;
    padding-bottom: 10px;

`;
const Maindiv = styled.div`
background: #fff;
`
const ModalDiv = styled(Modal)`
.ant-modal-mask {
  background-color: transparent !important;
}
.ant-modal-content{
    background-color: transparent;
    border:0;
    border-radius:none;
    -webkit-box-shadow:none;
    box-shadow:none;
}
.ant-modal-body{
    padding: 0;
}
.ant-modal-footer{
    /* display: fa; */
    display: contents;
}
`
const RowDiv = styled(Row)`
background: rgb(245, 245, 247);
`;
const CardDiv = styled(Card)`
.ant-card-body{
    padding:0px;
}
`;
function HttpPage(props) {
    const [appConfig, setAppConfig] = useState({});
    const [tableData, setTableData] = useState([])
    const [androidDownloadPercent, setAndroidDownloadPercent] = useState(0);
    const [pageStage, setPageState] = useState(false);
    const [channelCode, setChannelCode] = useState(0);

    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [downloadState, setDownloadState] = useState(0)
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
    
        requestAppConfig();

    }, []);
    const requestAppConfig = () => {

        Request.get("/appConfig").then(res => {
            if (res.data.response_code == 0) {
                setAppConfig(res.data.response_object.api_service_config);
                let tableData = res.data.response_object.api_service_config.map((p) => ({
                    "port": p.listen_port,
                    "type": "HTTP",
                }));
                setTableData(tableData);
            }
        });

    }
 
    const isWx = () => {
        var ua = navigator.userAgent;
        var isWeixin = ua.indexOf('MicroMessenger') != -1;
        if (isWeixin) {
            setIsModalVisible(true);
        }
        return isWeixin;
    }


    const CardItem = (icon, button) => {
        return (
            <Card>
                <Row style={{ paddingBottom: "20px" }} align="center">
                    {icon}
                </Row>
                {button}
            </Card>
        );
    }
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const header = () => {
        return (
            <>
                <h1>应用下载-沙雕图</h1>
            </>
        );
    }
    const detailClick=(record)=>{
        const { port } = record
        let { history } = props;
        history.push('/detailPage?port=' + port);
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
                                <Table columns={columns} dataSource={tableData} onChange={onChange}   rowKey="port" />
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