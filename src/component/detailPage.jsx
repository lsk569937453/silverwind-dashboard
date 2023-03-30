import React, { useState, useEffect } from 'react'
import { Row, Col, message,  Button,  Modal, Input } from 'antd';
import { useLocation } from 'react-router-dom'

import Request from '../utils/axiosUtils'
import { Table } from 'antd';
import { Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'
import styled from 'styled-components'

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
    padding-top: 10px;

`;

const RowDiv = styled(Row)`
background: rgb(245, 245, 247);
`;

function DetailPage(props) {
    const [tableData, setTableData] = useState([]);
    const [allowDenyList, setAllowDenyList] = useState([]);
    const [port, setPort] = useState(0);
    const [serviceConfig, setServiceConfig] = useState({});
    const [ipInput, setIpInput] = useState("");
    const [allowDenyType, setAllowDenyType] = useState("ALLOW");
    const [authenticationType, setAuthenticationType] = useState("None");
    const [authenticationObj, setAuthenticationObj] = useState({});

    const [ipInputEnable, setIpInputEnable] = useState(true);
    const [currentRouteId, setCurrentRouteId] = useState("");
    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authenticationIsModalOpen, setAuthenticationIsModalOpen] = useState(false);


    useEffect(() => {
        var port = searchParam.get("port");
        if (port === undefined || port === null) {
            return;
        }
        setPort(port);
        requestAppConfig(port);

    }, []);
    const requestAppConfig = (currentPort) => {
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config;
                let portConfig = apiConfigs.filter(config => config.listen_port === currentPort)[0];

                let newTableData = portConfig.service_config.routes.map((item) => ({
                    matchPrefix: item.matcher.prefix,
                    allowDenyList: item.allowDenyList,
                    authentication: item.authentication,
                    ratelimit: item.ratelimit,
                    route_cluster: item.route_cluster,
                    routeId: item.route_id,
                }));
                setTableData(newTableData);
                setServiceConfig(serviceConfig => ({
                    ...serviceConfig,
                    ...portConfig
                }));
            }
        });

    }

    const handleSubmitAllowDenyList = () => {
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config;
                // setAppConfig(apiConfigs);
                let newApiConfigs = apiConfigs.map(config => {
                    if (config.listen_port === port) {
                        config.service_config.routes = config.service_config.routes.map(item => {
                            if (item.route_id === currentRouteId) {
                                let resObj = allowDenyList.map((item) => ({
                                    limit_type: item.type.toUpperCase(),
                                    value: item.value,

                                }));
                                item.allow_deny_list = resObj;
                            }
                            return item;
                        });
                    }
                    return config;
                });


                Request.post("/appConfig", newApiConfigs).then(res => {
                    window.location.reload();
                });

            }
        });
        setIsModalOpen(false);
    };

    const handleSubmitAuthentication = () => {
        authenticationObj.type = authenticationType;

        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config;
                // setAppConfig(apiConfigs);
                let newApiConfigs = apiConfigs.map(config => {
                    if (config.listen_port === port) {
                        config.service_config.routes = config.service_config.routes.map(item => {
                            if (item.route_id === currentRouteId) {
                                if (authenticationType === "None") {
                                    item.authentication = null;
                                } else
                                    item.authentication = authenticationObj;
                            }
                            return item;
                        });
                    }
                    return config;
                });


                Request.post("/appConfig", newApiConfigs).then(res => {
                    window.location.reload();
                });

            }
        });
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleAuthenticationCancel = () => {
        setAuthenticationIsModalOpen(false);
    }

    const addNewAllowDenyListButtonClick = (record) => {
        let tempAllowDenyList = serviceConfig.service_config.routes.filter(s => s.route_id === record.routeId)[0].allow_deny_list;
        if (tempAllowDenyList !== undefined && tempAllowDenyList.length > 0) {
            let s = tempAllowDenyList.map(s => ({
                type: s.limit_type,
                value: s.value,
            }));
            setAllowDenyList(s);
        }

        setCurrentRouteId(record.routeId);
        setIsModalOpen(true);

    }
    const addNewAuthenticationButtonClick = (record) => {
        let tempAuthentication = serviceConfig.service_config.routes.filter(s => s.route_id === record.routeId)[0].authentication;
        if (tempAuthentication?.type !== undefined) {
            setAuthenticationType(tempAuthentication.type);
        }
        setAuthenticationObj(tempAuthentication);
        setCurrentRouteId(record.routeId);
        setAuthenticationIsModalOpen(true);

    }
    const columns = [
        {
            title: 'matchPrefix',
            dataIndex: 'matchPrefix',
            key: "matchPrefix",

        },
        {
            title: 'allowDenyList',
            dataIndex: 'allowDenyList',
            key: "allowDenyList",
            render: (text, record) => {
                return text === undefined ? (<a style={{ "cursor": "pointer" }} onClick={() => addNewAllowDenyListButtonClick(record)}>Edit</a>) : text
            }

        },
        {
            title: 'authentication',
            dataIndex: 'authentication',
            key: "authentication",
            render: (text, record) => {
                return <a style={{ "cursor": "pointer" }} onClick={() => addNewAuthenticationButtonClick(record)}>Edit</a>
            }
        },
        {
            title: 'ratelimit',
            dataIndex: 'ratelimit',
            key: "ratelimit",

        },
        {
            title: 'route_cluster',
            dataIndex: 'route_cluster',
            key: "route_cluster",
        },

    ];
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
        const key = CommonUtils.guid();
        const data = {
            "type": allowDenyType,
            "value": !flag ? "" : ipInput,
            "key": key,
        };
        setAllowDenyList([...allowDenyList, data]);
        setIpInput("");
    };
    const handleDelAllowDenyList = (key) => {
        setAllowDenyList(allowDenyList.filter(item => item.key !== key))
    };
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const handleAllowDenyTypeOptionOnChange = (value) => {
        if (value === "ALLOWALL" || value === "DENYALL") {
            setIpInputEnable(false);
        } else {
            setIpInputEnable(true);
        }
        setAllowDenyType(value);
    };
    const handleAuthenticationTypeOptionOnChange = (value) => {

        setAuthenticationType(value);
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
    const authenticationOption = () => {
        return [
            {
                value: 'ApiKeyAuth',
                label: 'ApiKeyAuth',
            },
            {
                value: 'BasicAuth',
                label: 'BasicAuth',
            },
            {
                value: 'None',
                label: 'None',
            },
        ];

    }
    const renderAllowDenyList = () => {

        if (allowDenyList.length === 0) {
            return;
        }
        return allowDenyList.map((item) => (
            <div key={item.key}>
                <Row>
                    <Col>
                        <Button
                            type="dashed"
                            danger
                            onClick={(e) => handleDelAllowDenyList(item.key)}
                            icon={<MinusCircleOutlined />}
                        >
                        </Button>
                    </Col>
                    <Col offset={1}>
                        <p>{item.type}</p>
                    </Col>
                    <Col offset={1}>
                        <p>{item.value}</p>
                    </Col>
                </Row>
            </div>
        ));
    }
    const ipOnChange = (e) => {
        setIpInput(e.target.value);
    }
    const authenticationCredentialsOnChange = (e) => {
        setAuthenticationObj(authenticationObj => ({
            ...authenticationObj,
            credentials: e.target.value
        }));
    };
    const authenticationValueOnChange = (e) => {
        setAuthenticationObj(authenticationObj => ({
            ...authenticationObj,
            value: e.target.value
        }));
        console.log(authenticationObj);
    };
    const authenticationKeyOnChange = (e) => {
        setAuthenticationObj(authenticationObj => ({
            ...authenticationObj,
            key: e.target.value
        }));
        console.log(authenticationObj);

    };
    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>
            <Modal title="Add Allow-Deny Ip List" open={isModalOpen} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitAllowDenyList}>
                        Submit
                    </Button>,
                ]}>
                {renderAllowDenyList()}
                <Row>
                    <Col>
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

            </Modal>
            <Modal title="Edit Authentication" open={authenticationIsModalOpen} onCancel={handleAuthenticationCancel}
                footer={[
                    <Button key="back" onClick={handleAuthenticationCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitAuthentication}>
                        Submit
                    </Button>,
                ]}>
                <Row>
                    <Col span={6}>
                        <Select
                            defaultValue={authenticationType}
                            style={{ width: 120 }}
                            options={authenticationOption()}
                            onChange={handleAuthenticationTypeOptionOnChange}
                        />
                    </Col>
                    <Col offset={1} span={12}>
                        {
                            authenticationType === "ApiKeyAuth" ?
                                (<Row>
                                    <Col span={10}>
                                        <Input placeholder="header key:" value={authenticationObj?.key} onChange={authenticationKeyOnChange} />
                                    </Col>
                                    <Col span={12} offset={1}>
                                        <Input placeholder="value:" value={authenticationObj?.value} onChange={authenticationValueOnChange} />
                                    </Col>
                                </Row>) : (
                                    authenticationType === "BasicAuth" ?
                                        (<Input placeholder="credentials" value={authenticationObj?.credentials} onChange={authenticationCredentialsOnChange} />) :
                                        (<div />)
                                )
                        }
                    </Col>
                </Row>

            </Modal>
            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} >

                    <RowDiv >
                        <Col xs={{ span: 4 }} >

                            <LineDiv>
                                <APIFontDiv>PORT</APIFontDiv>
                                <FontDiv>:{port}</FontDiv>
                            </LineDiv>
                        </Col>
                        <Col xs={{ span: 4 }} >
                            <LineDiv>
                                <APIFontDiv>TYPE</APIFontDiv>
                                <FontDiv>:{serviceConfig?.service_config?.server_type ?? ""}</FontDiv>
                            </LineDiv>
                        </Col>
                        <Col span={16}></Col>

                        <Col span={24}>
                            <EntrypointsDiv>ROUTES:</EntrypointsDiv>
                            <Table columns={columns} dataSource={tableData} onChange={onChange} rowKey="matchPrefix" />
                        </Col>
                    </RowDiv>

                </Col>


            </RowDiv>
            {/* </Spin> */}
        </div>
    );

}
export default withRouter(DetailPage);