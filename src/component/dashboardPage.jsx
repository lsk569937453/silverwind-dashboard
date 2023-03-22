import React, { useState, useEffect } from 'react'
import { Row, Col, Progress, Empty, Card, Button, Spin, Affix, Divider, Modal, Image } from 'antd';
import Request from '../utils/axiosUtils'
import { useLocation } from 'react-router-dom'
import PieChart from 'echarts/charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

function DashboardPage(props) {
    const [androidUrl, setAndroidUrl] = useState("");
    const [androiddownloadState, setAndroidDownloadState] = useState(0)
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
        var currentChannelCode = searchParam.get("channelCode");
        console.log(currentChannelCode);
        if (currentChannelCode != null) {
            setChannelCode(currentChannelCode);
        } else {
            currentChannelCode = 0;
        }

        setPageState(true);
        isWx();

        requestCurrentAndroid(currentChannelCode);

    }, [])
    const requestCurrentAndroid = (currentChannelCode) => {
        Request.get("/api/app/getLastApp?appType=0&channelCode=" + currentChannelCode).then(res => {
            setPageState(false);
            if (res.data.resCode == 0) {
                const { appPosition } = res.data.resMessage;
                setAndroidUrl(appPosition);
            }
        });

    }
    const handleOnProgress = (downloadEvent) => {
        const { loaded, total } = downloadEvent;
        const currnetProgress = ((loaded / total) * 100).toFixed(0);
        setAndroidDownloadPercent(currnetProgress);
        if (loaded === total) {
            setAndroidDownloadState(2);
        }
    }
    const isWx = () => {
        var ua = navigator.userAgent;
        var isWeixin = ua.indexOf('MicroMessenger') != -1;
        if (isWeixin) {
            setIsModalVisible(true);
        }
        return isWeixin;
    }

    const handleClickAndroid = () => {
        const isW = isWx();
        if (isW) {
            return;
        }
        console.log(androidUrl);
        setAndroidDownloadState(1);
        Request.get(androidUrl, {
            responseType: 'blob', // important
            onDownloadProgress: handleOnProgress,

        }).then(res => {
            console.log("response: ", res);
            // new Blob([data])用来创建URL的file对象或者blob对象
            let url = window.URL.createObjectURL(new Blob([res.data]));
            // 生成一个a标签
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            // 生成时间戳
            let timestamp = new Date().getTime();
            link.download = "app.apk";
            document.body.appendChild(link);
            link.click();
        })
            .catch(error => {
                console.log("response: ", error);
            });

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

    const getAndroidButton = () => {
        if (androiddownloadState == 0) {
            return (
                <ButtonDiv block onClick={handleClickAndroid}>免费下载</ButtonDiv>
            );
        }
        if (androiddownloadState == 1) {
            return (
                <Row>
                    <Col span={24}>
                        <div>下载中...</div>
                    </Col>
                    <Col span={24}>
                        <Progress percent={androidDownloadPercent} status="active" />
                    </Col>
                </Row>
            )
        }

        return (
            <div style={{ textAlign: "center" }}>下载完成!</div>

        );
    }
    const header = () => {
        return (
            <>
                <h1>应用下载-沙雕图</h1>
            </>
        );
    }
    const getHttpOptions = () => {
        return {
            grid: { top: 40, right: 8, bottom: 40, left: 20,containLabel: true  },
            xAxis: {
                type: 'category',
                name: 'Date',
                nameLocation: 'middle',
                 nameGap: 30,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
                name: 'Request Per Day',
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                },
            ],
            tooltip: {
                trigger: 'axis',
            },
        };
    };
    const getTcpOptions = () => {
        return {
            grid: { top: 40, right: 8, bottom: 40, left: 20,containLabel: true   },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                name: 'Date',
                nameLocation: 'middle',
                 nameGap: 30,
            },
            yAxis: {
                type: 'value',
                name: 'Request Per Day',
            },
            series: [
                {
                    data: [160, 250, 270, 320, 400, 450, 300],
                    type: 'line',
                    smooth: true,
                },
            ],
            tooltip: {
                trigger: 'axis',
            },
        };
    };
    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>

            {/* <Spin spinning={pageStage}> */}
            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} >

                    <RowDiv >

                        <Col xs={{ span: 24 }} >
                            <EntrypointsDiv>Entrypoints:</EntrypointsDiv>
                            <Maindiv>
                                <RowDiv gutter={4} justify="start" style={{ paddingBottom: "20px" }} >
                                    <Col span={4} >
                                        <LineDiv>
                                            <APIFontDiv>REST API</APIFontDiv>
                                            <FontDiv>:8760</FontDiv>
                                        </LineDiv>
                                    </Col>
                                    <Col span={4} >
                                        <LineDiv>
                                            <APIFontDiv>Web</APIFontDiv>
                                            <FontDiv>:5470</FontDiv>
                                        </LineDiv>
                                    </Col>
                                    <Col span={4} >
                                    </Col>

                                </RowDiv>
                            </Maindiv>
                        </Col>
                        <Col xs={{ span: 24 }} >
                            <EntrypointsDiv>HTTP</EntrypointsDiv>
                            <ReactECharts option={getHttpOptions()} />
                        </Col>
                        <Col xs={{ span: 24 }} >
                            <EntrypointsDiv>TCP</EntrypointsDiv>
                            <ReactECharts option={getTcpOptions()} />
                        </Col>
                    </RowDiv>

                </Col>


            </RowDiv>
            {/* </Spin> */}
        </div>
    );

}
export default withRouter(DashboardPage);