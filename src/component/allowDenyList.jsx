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
        span: 3,
    },
    wrapperCol: {
        span: 3,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 2,
        span: 10,
    },
};



function AllowDenyList(props) {
    const [allowDenyList, setAllowDenyList] = useState([]);
    const [ipInput, setIpInput] = useState("");
    const [allowDenyType, setAllowDenyType] = useState("ALLOW");
    const [ipInputEnable, setIpInputEnable] = useState(true);

    const handleDelAllowDenyList = (key) => {
        setAllowDenyList(allowDenyList.filter(item => item.key !== key))
    };
    const renderAllowDenyList = () => {

        if (allowDenyList.length == 0) {
            return;
        }
        return allowDenyList.map((item) => (
            <div key={item.key}>
                <Row>
                    <Col offset={6}>
                        <Button
                            type="dashed"
                            danger
                            onClick={(e) => handleDelAllowDenyList(item.key)}
                            icon={<MinusCircleOutlined />}
                        >
                        </Button>
                    </Col>
                    <Col>
                        <p style={{marginLeft:10}}>{item.type}</p>
                    </Col>
                    <Col offset={2}>
                        <p style={{marginLeft:10}}>{item.value}</p>
                    </Col>
                </Row>
            </div>
        ));
    }
    const handleAddAllowDenyList = () => {

        let flag = false;
        if (allowDenyType == "ALLOW" || allowDenyType == "DENY") {
            flag = true;
        }
        if (flag) {
            const checkResult = CommonUtils.checkIsIPV4(ipInput);
            if (!checkResult) {
                message.error('IP or Ip Range is illegal!');
                return;
            }
        }
        const key = CommonUtils.guid();
        const data = {
            "type": allowDenyType,
            "value": !flag ? "" : ipInput,
            "key": key,
        };
        setAllowDenyList([...allowDenyList, data]);
        setIpInput("");
    };
    const handleAllowDenyTypeOptionOnChange = (value) => {
        if (value == "ALLOWALL" || value == "DENYALL") {
            setIpInputEnable(false);
        } else {
            setIpInputEnable(true);
        }
        setAllowDenyType(value);
    };
    const allowDenyOption = () => {
        return [
            {
                value: 'ALLOW',
                label: 'ALLOW',
            },
            {
                value: 'DENY',
                label: 'DENY',
            },
            {
                value: 'ALLOWALL',
                label: 'ALLOWALL',
            },
            {
                value: 'DENYALL',
                label: 'DENYALL',
            },
        ];

    }
    const ipOnChange = (e) => {
        setIpInput(e.target.value);
    }
    return (
        <div style={{padding:20}}>
            {renderAllowDenyList()}
            <Row>
                    <Col offset={6}>
                        <Button
                            type="dashed"
                            onClick={handleAddAllowDenyList}
                            icon={<PlusOutlined />}
                        >
                        </Button>
                    </Col>
                    <Col>
                        <Select
                            defaultValue={allowDenyType}
                            style={{ width: 120 }}
                            options={allowDenyOption()}
                            onChange={handleAllowDenyTypeOptionOnChange}

                        />
                    </Col>
                    <Col offset={1}>
                        <Input placeholder="IP or IP_RANGE" value={ipInput} disabled={!ipInputEnable} onChange={ipOnChange} />
                    </Col>
                </Row>

        </div>
    );


}
export default AllowDenyList;