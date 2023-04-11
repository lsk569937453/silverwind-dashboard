import React from 'react'
import { Row, Col } from 'antd';

import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import useLocalStorage from "use-local-storage";

import ReactECharts from 'echarts-for-react';

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

const RowDiv = styled(Row)`
background: rgb(245, 245, 247);
`;

function DashboardPage(props) {

    const [host, setHost] = useLocalStorage("host",undefined);
   
    const [port, setPort] = useLocalStorage("port",undefined);
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
                                            <APIFontDiv>ADMIN API</APIFontDiv>
                                            <FontDiv>http://{host}:{port}</FontDiv>
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