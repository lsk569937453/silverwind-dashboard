import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Form, Input, Col, Row } from 'antd';

import { withRouter } from 'react-router-dom'

import styled from 'styled-components'

import ReactECharts from 'echarts-for-react';

const LineDiv = styled.div`
position: fixed; /* or absolute */
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
`;
const TitleDiv=styled.h2`
margin-bottom:60px;
font-weight:bold;
color:white;

`
const FormDiv=styled(Form)`
.ant-form-item-required{
    color:white;
    font-weight:bold;

}
`
const ButtonDiv=styled(Button)`
color: rgb(169, 71, 15);
background-color: rgb(255, 244, 220);
background: rgb(255, 244, 220);
border: 2px solid white;

.ant-btn:hover, .ant-btn:focus{
color: rgb(169, 71, 15);
border-color: #40a9ff;
background: rgb(255, 244, 220);
}
`
function StartupPage(props) {

    const [host, setHost] = useState("127.0.0.1")
    const [port, setPort] = useState("6980")
    const handleHostOnChange = (e) => {
        setHost(e.target.value);
    }
    const handlePortOnChange = (e) => {
        setPort(e.target.value);
    }
    const handleButtonOnClick=(values)=>{ 
        const{host,port}=values;
    localStorage.setItem("port",JSON.stringify(port));
    localStorage.setItem("host",JSON.stringify(host));
    window.location.reload();

    }
    return (
        <div style={{ background: "rgb(8, 109, 215)", height: '100%' }}>
            <LineDiv>
                <TitleDiv>Start new Silverwind Dashboard</TitleDiv>
                <FormDiv
                onFinish={handleButtonOnClick}
                    name="basic"
                    layout="vertical"
                    initialValues={{
                        host:host,
                        port:port
                    }}
                    autoComplete="off"
                   
                >
                    <Form.Item
                        label="Silverwind Admin Host"
                        name="host"
                        rules={[
                            {
                                required: true,
                                message: 'Please input silverwind host!',
                            },
                        ]}
                    >
                        <Input onChange={handleHostOnChange}/>
                    </Form.Item>

                    <Form.Item
                        label="Silverwind Admin Port"
                        name="port"
                        rules={[
                            {
                                required: true,
                                message: 'Please input silverwind port!',
                            },
                        ]}
                    >
                        <Input onChange={handlePortOnChange}/>
                    </Form.Item>

   

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <ButtonDiv  htmlType="submit">
                            Start Dashboard
                        </ButtonDiv>
                    </Form.Item>
                </FormDiv>
            </LineDiv>
            {/* </Spin> */}
        </div>
    );

}
export default StartupPage;