import React from 'react'
import { Row, Col,  InputNumber,  Form } from 'antd';
import { Select } from 'antd';

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 8,
    },
};



function AnomalyDetection(props) {
    const [form] = Form.useForm();

    const anomalyDetectionTypeSelectOption = () => {
        return [
            {
                value: 'Http',
                label: 'Http',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];
    }
    const handleAnomalyDetectionTypeOptionOnChange = (value) => {
        props.setAnomalyDetectionData(previousState => ({
            ...previousState,
            anomalyDetectionType: value
        }));
        // setRatelimitType(value);
    };
    const handleConsecutive5xxOnChange=(value)=>{
        props.setAnomalyDetectionData(previousState => ({
            ...previousState,
            consecutive5xx: value
        }));
    }
    const handleEjectionSecondOnChange=(value)=>{
        props.setAnomalyDetectionData(previousState => ({
            ...previousState,
            ejectionSecond: value
        }));
    }
    const handleMinLivenessCountChange=(value)=>{
        props.setLivenessConfigData(previousState => ({
            ...previousState,
            minLivenessCount: value
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
                            name="consecutive5xx"
                            label="Consecutive 5xx"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleConsecutive5xxOnChange}   defaultValue={props.anomalyDetectionData?.consecutive5xx} min={1}/>
                        </Form.Item>
                        <Form.Item
                            name="ejectionSecond"
                            label="Ejection Second"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber onChange={handleEjectionSecondOnChange}   defaultValue={props.anomalyDetectionData?.ejectionSecond} min={1}/>
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
                        defaultValue={props.anomalyDetectionData?.anomalyDetectionType?props.anomalyDetectionData?.anomalyDetectionType:"None"}
                        style={{ width: 180 }}
                        options={anomalyDetectionTypeSelectOption()}
                        onChange={handleAnomalyDetectionTypeOptionOnChange}
                    />
                </Col>
                <Col span={20}></Col>
                <Col span={24}>
                    {(!props.anomalyDetectionData?.anomalyDetectionType||props.anomalyDetectionData.anomalyDetectionType === "None") ? <></> : tokenBucketDiv()}
                </Col>
            </Row>
        </div>
    );


}
export default AnomalyDetection;