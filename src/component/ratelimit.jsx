import React from 'react'
import { Row, Col,  InputNumber,  Form, Input } from 'antd';
import { Select } from 'antd';

const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 8,
    },
};



function Ratelimit(props) {
    // const [ratelimitType, setRatelimitType] = useState("None");
    // const [limitLocationType, setLimitLocationType] = useState("ip");
    const [form] = Form.useForm();

    const ratelimitSelectOption = () => {
        return [
            {
                value: 'TokenBucketRateLimit',
                label: 'Token Bucket Ratelimit',
            },
            {
                value: 'FixedWindowRateLimit',
                label: 'Fixed Window Ratelimit',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];
    }
    const handleRatelimitTypeOptionOnChange = (value) => {
        props.setRatelimitData(previousState => ({
            ...previousState,
            ratelimitType: value
        }));
        // setRatelimitType(value);
    };
    const handleUnitTypeOnChange = (value) => {
        props.setRatelimitData(previousState => ({
            ...previousState,
            unitType: value
        }));
    };
    const onLimitLocationChange = (value) => {
        // setLimitLocationType(value);
        props.setRatelimitData(previousState => ({
            ...previousState,
            limitLocationType: value
        }));
    };
    const onFinish = (values) => {
        console.log(values);
    };

    const handleRatePerUnitOnChange = (value) => {
        props.setRatelimitData(previousState => ({
            ...previousState,
            ratePerUnit: value
        }));
    }
    const handleBucketCapacityOnChange = (value) => {
        props.setRatelimitData(previousState => ({
            ...previousState,
            bucketCapacity: value
        }));
    }
    const handleHeaderKeyOnChange=(e)=>{
        props.setRatelimitData(previousState => ({
            ...previousState,
            headerKey: e.target.value
        }));
    }
    const handleHeaderValueOnChange=(e)=>{
        props.setRatelimitData(previousState => ({
            ...previousState,
            headerValue: e.target.value
        }));
    }
    const handleIpOnChange=(e)=>{
        props.setRatelimitData(previousState => ({
            ...previousState,
            ip: e.target.value
        }));
    }
    const tokenBucketDiv = () => {
        return (
            <Row style={{ paddingTop: 20 }}>
                <Col span={24} >
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}

                    >
                        {props.ratelimitData.ratelimitType === "TokenBucketRateLimit" ?
                    <Form.Item
                        name="bucketCapacity"
                        label="Bucket Capacity"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <InputNumber onChange={handleBucketCapacityOnChange}   defaultValue={props.ratelimitData?.bucketCapacity} min={1}/>
                    </Form.Item> : <></>
                }
                        <Form.Item
                            name="RatePerUnit"
                            label="Rate Per Unit"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleRatePerUnitOnChange}   defaultValue={props.ratelimitData?.ratePerUnit} min={1}/>
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
                                onChange={handleUnitTypeOnChange}
                                defaultValue={props.ratelimitData?.unitType}

                            >
                                <Option value="MillionSecond">MillionSecond</Option>
                                <Option value="Second">Second</Option>
                                <Option value="Minute">Minute</Option>
                                <Option value="Hour">Hour</Option>
                                <Option value="Day">Day</Option>
                            </Select>
                        </Form.Item>
                        
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
                                        defaultValue={props.ratelimitData.limitLocationType}
                                        onChange={onLimitLocationChange}
                                    >
                                        <Option value="IP">IP</Option>
                                        {/* <Option value="ipRange">Ip Range</Option> */}
                                        <Option value="Header">Header</Option>
                                    </Select>
                                </Col>
                                {
                                    props.ratelimitData.limitLocationType === "Header" ? <>
                                        <Col offset={1} span={8}>
                                            <Input placeholder='Header Key' onChange={handleHeaderKeyOnChange} value={props.ratelimitData?.headerKey}/>

                                        </Col>
                                        <Col offset={1} span={8}>
                                            <Input placeholder='Header Value' onChange={handleHeaderValueOnChange} value={props.ratelimitData?.headerValue}/>

                                        </Col></>
                                        :
                                        <Col span={17} offset={1}>
                                            <Input placeholder='Please input the ip address or ip range!' onChange={handleIpOnChange} value={props.ratelimitData?.ip}/>
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
        <div style={{ padding: 20 }}>
            <Row>
                <Col span={4} offset={6}>
                    <Select
                        defaultValue={props.ratelimitData.ratelimitType}
                        style={{ width: 180 }}
                        options={ratelimitSelectOption()}
                        onChange={handleRatelimitTypeOptionOnChange}
                    />
                </Col>
                <Col span={20}></Col>
                <Col span={24}>
                    {props.ratelimitData.ratelimitType === "None" ? <></> : tokenBucketDiv()}
                </Col>
            </Row>
        </div>
    );


}
export default Ratelimit;