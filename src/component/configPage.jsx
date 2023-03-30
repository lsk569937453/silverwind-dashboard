import React, { useState, useEffect } from 'react'
import { Row, Col,  Card, Button,  Tabs} from 'antd';
import { useLocation } from 'react-router-dom'

import Request from '../utils/axiosUtils'

import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'
import styled from 'styled-components'

import BaseConfig from './baseConfig'
import AllowDenyList from './allowDenyList';
import Authentication from './authentication';
import Ratelimit from './ratelimit';
const RowDiv = styled(Row)`
background: rgb(245, 245, 247);

`;
const TabsDiv = styled(Tabs)`
.ant-tabs-content-holder{
    background:white;
}
height : 60vh;
`


function ConfigPage(props) {
    const [appConfig, setAppConfig] = useState({});
    const [baseConfigData, setBaseConfigData] = useState({})
    const [allowDenyData, setAllowDenyData] = useState({})
    const [authenticationData, setAuthenticationData] = useState({})
    const [ratelimitData, setRatelimitData] = useState({})
    const [port, setPort] = useState('undefined');
    const [routeId, setRouteId] = useState('undefined');
    // const ratelimitForm=Form.useForm();
    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);
    useEffect(() => {
        var port = searchParam.get("port");
        if (port === undefined || port === null) {
            return;
        }
        var routeId = searchParam.get("routeId");
        if (routeId === undefined || routeId === null) {
            return;
        }
        setPort(port);
        setRouteId(routeId);
        requestAppConfig(port, routeId);
    }, []);
    const requestAppConfig = (currentPort, routeId) => {
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config.filter(item => item.listen_port === currentPort)[0].service_config.routes.filter(item => item.route_id === routeId)[0];
                setAppConfig(apiConfigs);
                constructConfigData(apiConfigs, currentPort);
                constructAllowDenyData(apiConfigs);
                constructAuthenticationData(apiConfigs);
                constructRatelimitData(apiConfigs);
                console.log(apiConfigs);
            }
        });

    }
    const constructConfigData = (appConfig, currentPort) => {
        const tableData = appConfig?.route_cluster?.routes.map(item => ({
            endpoint: item.base_route.endpoint,
            key: CommonUtils.guid(),
            weight: item.weight ? item.weight : 100,
            headerkey: item.header_key ? item.header_key : "user-agent",
            headerValueType: item.header_value_mapping_type?.type ? item.header_value_mapping_type?.type : "Text",
            headerValueMatch: "test"
        }));
        const port = currentPort;
        const prefix = appConfig?.matcher?.prefix;
        const routeAlgorighm = appConfig?.route_cluster?.type;
        setBaseConfigData({
            tableData: tableData,
            port: port,
            prefix: prefix,
            routeAlgorighm: routeAlgorighm
        });
    }
    const constructAllowDenyData = (appConfig) => {
        let allowDenyList = appConfig?.allow_deny_list?.map((item) => {
            let typeLabel = item.limit_type;
            if (typeLabel === "ALLOWALL") {
                typeLabel = "ALLOW-ALL";
            } else if (typeLabel === "DENYALL") {
                typeLabel = "DENY-ALL";
            }
            return {
                "type": item.limit_type,
                "typeLabel": typeLabel,
                "value": item.value,
                "key": CommonUtils.guid()
            };
        });
        if (allowDenyList == null) {
            allowDenyList = [];
        }
        setAllowDenyData({
            allowDenyList: allowDenyList
        });
    }
    const constructAuthenticationData = (appConfig) => {
        let defaultType = "None";
        let type = appConfig?.authentication?.type;
        if (type == null) {
            type = defaultType;
        }

        setAuthenticationData({
            authenticationType: type,
            authenticationObj: appConfig?.authentication
        });
    }
    const constructRatelimitData = (appConfig) => {
        let defaultType = "None";
        let defaultLimitLocationType = "IP";
        let type = appConfig?.ratelimit?.type;
        let limitLocationType = appConfig.ratelimit?.limit_location?.type;
        if (type == null) {
            type = defaultType;
        }
        if (limitLocationType == null) {
            limitLocationType = defaultLimitLocationType;
        }

        setRatelimitData({
            ratelimitType: type,
            limitLocationType: limitLocationType,
            bucketCapacity:appConfig.ratelimit?.capacity,
            ratePerUnit:appConfig.ratelimit?.rate_per_unit,
            ip:appConfig.ratelimit?.limit_location?.value,
            headerKey:appConfig.ratelimit?.limit_location?.key,
            headerValue:appConfig.ratelimit?.limit_location?.value,
            unitType:appConfig.ratelimit?.unit?.type,
            // form:ratelimitForm,
        });
    }
    const getTabs = () => {
        const firstPage = {
            label: `Base Config`,
            key: 1,
            children: <BaseConfig baseConfigData={baseConfigData} setBaseConfigData={setBaseConfigData} />,
        };
        const secondPage = {
            label: `Allow Deny List`,
            key: 2,
            children: <AllowDenyList allowDenyData={allowDenyData} setAllowDenyData={setAllowDenyData} />,
        };
        const thirdPage = {
            label: `Authentication`,
            key: 3,
            children: <Authentication authenticationData={authenticationData} setAuthenticationData={setAuthenticationData} />,
        };
        const forthPage = {
            label: `Rate limit`,
            key: 4,
            children: <Ratelimit ratelimitData={ratelimitData} setRatelimitData={setRatelimitData} />,
        };
        return [firstPage, secondPage, thirdPage, forthPage];

    };
    const handleSaveButtonOnClick = () => {
        if (port === undefined) {

        } else {
            updateRoute();
        }
    }
    const updateRoute = () => {
        // ratelimitForm.submit();
        const isWeightRoute = baseConfigData.routeAlgorighm === "WeightBasedRoute";
        const isHeaderBasedRoute = baseConfigData.routeAlgorighm === "HeaderBasedRoute";

        const routes = baseConfigData.tableData.map((item) => ({
            "base_route": {
                "endpoint": item.endpoint,
                "try_file": null
            },
            ...(isWeightRoute) && { weight: item.weight },
            ...(isHeaderBasedRoute) && { header_key: item.weight },
            ...(isHeaderBasedRoute) && {
                header_value_mapping_type: {
                    type: item.headerValueType,
                    value: item.headerValueMatch
                }
            },
        }));
        const newBaseRoute = {
            "route_id": routeId,
            "host_name": null,
            "matcher": {
                "prefix": baseConfigData.prefix,
                "prefix_rewrite": "ssss"
            },
            "allow_deny_list": collectAllowDenyData(),
            "authentication": collectAuthenticationData(),
            "ratelimit": collectRatelimitData(),
            "route_cluster": {
                "type": baseConfigData.routeAlgorighm,
                "routes": routes
            }
        }
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config;
                setAppConfig(apiConfigs);
                let newApiConfigs = apiConfigs.map(config => {
                    if (config.listen_port === port) {
                        config.service_config.routes = config.service_config.routes.map(item => {
                            if (item.route_id === routeId) {
                                return newBaseRoute;
                            }
                            return item;
                        });
                    }
                    return config;
                });


                Request.post("/appConfig", newApiConfigs).then(res => {
                    // window.location.reload();
                });

            }
        });
    }
    const collectAllowDenyData = () => {
        return allowDenyData.allowDenyList.map((item) => ({
            limit_type: item.type,
            value: item.value
        }));
    };
    const collectAuthenticationData = () => {
        if (authenticationData.authenticationType === "None") {
            return null;
        }
        const isApiKeyAuth = authenticationData.authenticationType === "ApiKeyAuth";
        const isBasicAuth = authenticationData.authenticationType === "BasicAuth";
        return {
            type: authenticationData.authenticationType,
            ...(isApiKeyAuth) && { key: authenticationData.authenticationObj.key },
            ...(isApiKeyAuth) && { value: authenticationData.authenticationObj.value },
            ...(isBasicAuth) && { credentials: authenticationData.authenticationObj.credentials },

        };
    };
    const collectRatelimitData = () => {
        if(ratelimitData.ratelimitType==="None"){
            return null;
        }
    
        const isTokenBucket=ratelimitData.ratelimitType==="TokenBucketRateLimit";
        const isLocationOnIP=ratelimitData.limitLocationType==="IP";
        const data= {
            type: ratelimitData.ratelimitType,
            rate_per_unit: ratelimitData.ratePerUnit,
            unit: {
                type: ratelimitData.unitType
            },
            ...(isTokenBucket) && { capacity: ratelimitData.bucketCapacity},
            limit_location: {
                type: ratelimitData.limitLocationType,
                ...(isLocationOnIP) && {value: ratelimitData.ip},
                ...(!isLocationOnIP) && {key: ratelimitData.headerKey},
                ...(!isLocationOnIP) && {value: ratelimitData.headerValue},

            }
        };
        return data;

    };

    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>
            <RowDiv>
                <Col xs={{ span: 16, offset: 4 }} style={{ height: "60vh" }}>
                    <Card title={port === undefined ? "New Config" : "Change Config"} extra={<Button type="primary" onClick={handleSaveButtonOnClick}>Save</Button>}>
                        <TabsDiv
                            // centered={true}
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            items={getTabs()}
                        />
                    </Card>
                </Col>

            </RowDiv>
        </div>
    );

}
export default withRouter(ConfigPage);