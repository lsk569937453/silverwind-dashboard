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

const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 8,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};


function Ratelimit(props) {
    const [ratelimitType, setRatelimitType] = useState("None");
    const [limitLocationType, setLimitLocationType] = useState("ip");
    const [form] = Form.useForm();

    const ratelimitSelectOption = () => {
        return [
            {
                value: 'TokenBucketAlgorithm',
                label: 'Token Bucket Ratelimit',
            },
            {
                value: 'FixedWindowAlgorithm',
                label: 'Fixed Window Ratelimit',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];
    }
    const handleRatelimitTypeOptionOnChange = (value) => {
        setRatelimitType(value);
    };
    const onGenderChange = (value) => {

    };
    const onLimitLocationChange = (value) => {
        setLimitLocationType(value);
    };
    const onFinish = (values) => {
        console.log(values);
    };
    const onReset = () => {
        form.resetFields();
    };
    const onFill = () => {
        form.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };
    
    const tokenBucketDiv=()=>{
        return (
            <Row style={{paddingTop:20}}>
                <Col span={24} >
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}

                    >
                        <Form.Item
                            name="RatePerUnit"
                            label="Rate Per Unit"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="unitType"
                            label="Unit Type"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                onChange={onGenderChange}

                            >
                                <Option value="millionSecond">MillionSecond</Option>
                                <Option value="second">Second</Option>
                                <Option value="minute">Minute</Option>
                                <Option value="hour">Hour</Option>
                                <Option value="day">Day</Option>
                            </Select>
                        </Form.Item>

                        {ratelimitType=="TokenBucketAlgorithm"?
                        <Form.Item
                            name="bucketCapacity"
                            label="Bucket Capacity"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>:<></>
                        }
                        <Form.Item
                            name="LimitLocation"
                            label="Limit on"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Row>
                                <Col span={6}>
                                    <Select
                                        defaultValue={limitLocationType}
                                        onChange={onLimitLocationChange}
                                    >
                                        <Option value="ip">Ip</Option>
                                        <Option value="ipRange">Ip Range</Option>
                                        <Option value="header">Header</Option>

                                    </Select>
                                </Col>
                                {limitLocationType == "header" ? <>
                                    <Col offset={1} span={8}>
                                        <Input placeholder='Header Key' />

                                    </Col>
                                    <Col offset={1} span={8}>
                                        <Input placeholder='Header Value' />

                                    </Col></>
                                    :
                                    <Col span={17} offset={1}>
                                        <Input placeholder='Please input the ip address or ip range!' />
                                    </Col>}
                            </Row>
                        </Form.Item>
                        {/* <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item> */}
                    </Form>
                </Col>
            </Row>
        );
    }
   
    return (
        <div style={{padding:20}}>
            <Row>
                <Col span={4} offset={6}>
                    <Select
                        defaultValue={ratelimitType}
                        style={{ width: 180 }}
                        options={ratelimitSelectOption()}
                        onChange={handleRatelimitTypeOptionOnChange}
                    />
                </Col>
                <Col span={20}></Col>
                <Col span={24}>
                    {ratelimitType=="None"?<></>:tokenBucketDiv()}
                </Col>
            </Row>
        </div>
    );


}
export default Ratelimit;