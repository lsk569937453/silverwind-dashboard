import React, { useState} from 'react'
import { Row, Col, message,  Button, Input } from 'antd';
import { Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


import CommonUtils from '../utils/commonUtils'



function AllowDenyList(props) {
    // const [allowDenyList, setAllowDenyList] = useState([]);
    const [ipInput, setIpInput] = useState("");
    const [allowDenyType, setAllowDenyType] = useState("ALLOW");
    const [ipInputEnable, setIpInputEnable] = useState(true);

    const handleDelAllowDenyList = (key) => {
        const newAllowDenyList=props.allowDenyData.allowDenyList.filter(item => item.key !== key);
        props.setAllowDenyData({
            allowDenyList:newAllowDenyList
        });

    };
    const renderAllowDenyList = () => {
        const allowDenyList=props.allowDenyData?.allowDenyList;
        if(allowDenyList===null||allowDenyList.length===0){
            return;
        }


        return props.allowDenyData.allowDenyList.map((item) => (
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
                    <Col span={2}>
                        <p style={{marginLeft:10,marginTop:3}}>{item.typeLabel}</p>
                    </Col>
                    <Col span={2} offset={1}>
                        <p style={{marginLeft:10}}>{item.value}</p>
                    </Col>
                </Row>
            </div>
        ));
    }
    const handleAddAllowDenyList = () => {

        let flag = false;
        if (allowDenyType === "ALLOW" || allowDenyType === "DENY") {
            flag = true;
        }
        if (flag) {
            const checkResult = CommonUtils.checkIsIPV4(ipInput);
            if (!checkResult) {
                message.error('IP or Ip Range is illegal!');
                return;
            }
        }
        let allowDenyTypeLabel=allowDenyType;
        if(allowDenyTypeLabel==="ALLOWALL"){
            allowDenyTypeLabel="ALLOW-ALL";
        }else if(allowDenyTypeLabel==="DENYALL"){
            allowDenyTypeLabel="DENY-ALL";
        }
        const key = CommonUtils.guid();
        const data = {
            "type": allowDenyType,
            "typeLabel":allowDenyTypeLabel,
            "value": !flag ? "" : ipInput,
            "key": key,
        };
        const newAllowDenyList=[...props.allowDenyData.allowDenyList, data];
        props.setAllowDenyData({
            allowDenyList:newAllowDenyList
        });
        // setAllowDenyList([...allowDenyList, data]);
        setIpInput("");
    };
    const handleAllowDenyTypeOptionOnChange = (value) => {
        if (value === "ALLOWALL" || value === "DENYALL") {
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
                label: 'ALLOW-ALL',
            },
            {
                value: 'DENYALL',
                label: 'DENY-ALL',
            },
        ];

    }
    const ipOnChange = (e) => {
        setIpInput(e.target.value);
    }
    return (
        <div style={{padding:20}}>
           
            <Row style={{marginBottom:20}}>
                    <Col offset={6}>
                        <Button
                            type="dashed"
                            onClick={handleAddAllowDenyList}
                            icon={<PlusOutlined />}
                        >
                        </Button>
                    </Col>
                    <Col span={2}>
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
                {renderAllowDenyList()}
        </div>
    );


}
export default AllowDenyList;