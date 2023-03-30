import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, message, Empty, Card, Button, InputNumber, Spin, Tab, Typography, Popconfirm, Tabs, Table, Divider, Modal, Image, Form, Input } from 'antd';
import { useLocation } from 'react-router-dom'
import PieChart from 'echarts/charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from '../utils/axiosUtils'
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
const RowDiv = styled(Row)`
background: rgb(245, 245, 247);
`;

function Authentication(props) {
    // const [authenticationType, setAuthenticationType] = useState("None");
    // const [authenticationObj, setAuthenticationObj] = useState({});

    const authenticationOption = () => {
        return [
            {
                value: 'ApiKeyAuth',
                label: 'Api Key Auth',
            },
            {
                value: 'BasicAuth',
                label: 'Basic Auth',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];

    }
    const handleAuthenticationTypeOptionOnChange = (value) => {
        props.setAuthenticationData(previousState=>({
            ...previousState,
            authenticationType:value
        }));
        // setAuthenticationType(value);
    };
    const authenticationKeyOnChange = (e) => {
        // setAuthenticationObj(authenticationObj => ({
        //     ...authenticationObj,
        //     key: e.target.value
        // }));
        const {authenticationObj}=props.authenticationData;
        props.setAuthenticationData(previousState=>({
            ...previousState,
            authenticationObj:{
                ...authenticationObj,
                key: e.target.value
            }
        }));
    };
    const authenticationValueOnChange = (e) => {
        // setAuthenticationObj(authenticationObj => ({
        //     ...authenticationObj,
        //     value: e.target.value
        // }));
        const {authenticationObj}=props.authenticationData;
        props.setAuthenticationData(previousState=>({
            ...previousState,
            authenticationObj:{
                ...authenticationObj,
                value: e.target.value
            }
        }));
    };
    const authenticationCredentialsOnChange = (e) => {
        // setAuthenticationObj(authenticationObj => ({
        //     ...authenticationObj,
        //     credentials: e.target.value
        // }));
        const {authenticationObj}=props.authenticationData;
        props.setAuthenticationData(previousState=>({
            ...previousState,
            authenticationObj:{
                ...authenticationObj,
                credentials: e.target.value
            }
        }));
    };
    return (
        <div style={{padding:20}}>
            <Row>
                <Col  offset={6}>
                    <Select
                        defaultValue={props.authenticationData?.authenticationType}
                        style={{ width: 180 }}
                        options={authenticationOption()}
                        onChange={handleAuthenticationTypeOptionOnChange}
                    />
                </Col>
                <Col offset={1} span={6}>
                    {
                        props.authenticationData?.authenticationType == "ApiKeyAuth" ?
                            (<Row>
                                <Col span={10}>
                                    <Input placeholder="header key:" value={props.authenticationData?.authenticationObj?.key} onChange={authenticationKeyOnChange} />
                                </Col>
                                <Col span={12} offset={1}>
                                    <Input placeholder="value:" value={props.authenticationData?.authenticationObj?.value} onChange={authenticationValueOnChange} />
                                </Col>
                            </Row>) : (
                                props.authenticationData?.authenticationType == "BasicAuth" ?
                                    (<Input placeholder="credentials" value={props.authenticationData?.authenticationObj?.credentials} onChange={authenticationCredentialsOnChange} />) :
                                    (<div />)
                            )
                    }
                </Col>
            </Row>
        </div>
    );


}
export default Authentication;