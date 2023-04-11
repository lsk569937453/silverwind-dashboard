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



function HealthCheck(props) {
    // const [ratelimitType, setRatelimitType] = useState("None");
    // const [limitLocationType, setLimitLocationType] = useState("ip");
    const [form] = Form.useForm();

    const healthCheckTypeSelectOption = () => {
        return [
            {
                value: 'HttpGet',
                label: 'Http Get',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];
    }
    const handleHealthCheckTypeOptionOnChange = (value) => {
        props.setHealthCheckData(previousState => ({
            ...previousState,
            healthCheckType: value
        }));
        // setRatelimitType(value);
    };
    const handleIntervalOnChange=(value)=>{
        props.setHealthCheckData(previousState => ({
            ...previousState,
            interval: value
        }));
    }
    const handleTimeoutOnChange=(value)=>{
        props.setHealthCheckData(previousState => ({
            ...previousState,
            timeout: value
        }));
    }
    const handleMinLivenessCountChange=(value)=>{
        props.setLivenessConfigData(previousState => ({
            ...previousState,
            minLivenessCount: value
        }));
    }
    const handlePathOnChange=(e)=>{
        props.setHealthCheckData(previousState => ({
            ...previousState,
            path: e.target.value
        }));
    }
    const onFinish = (values) => {
        console.log(values);
    };

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
                        <Form.Item
                            name="interval"
                            label="Interval"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleIntervalOnChange}   defaultValue={props.healthCheckData?.interval} min={1}/>
                        </Form.Item>
                        <Form.Item
                            name="timeout"
                            label="Timeout"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleTimeoutOnChange}   defaultValue={props.healthCheckData?.timeout} min={1}/>
                        </Form.Item>
                        <Form.Item
                            name="minLivenessCount"
                            label="Min Liveness Count"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleMinLivenessCountChange}   defaultValue={props.livenessConfigData?.minLivenessCount} min={1}/>
                        </Form.Item>
                        <Form.Item
                            name="path"
                            label="Path"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input onChange={handlePathOnChange}   defaultValue={props.healthCheckData?.path} min={1}/>
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
                        defaultValue={props.healthCheckData?.healthCheckType?props.healthCheckData?.healthCheckType:"None"}
                        style={{ width: 180 }}
                        options={healthCheckTypeSelectOption()}
                        onChange={handleHealthCheckTypeOptionOnChange}
                    />
                </Col>
                <Col span={20}></Col>
                <Col span={24}>
                    {(!props.healthCheckData?.healthCheckType||props.healthCheckData.healthCheckType === "None") ? <></> : tokenBucketDiv()}
                </Col>
            </Row>
        </div>
    );


}
export default HealthCheck;