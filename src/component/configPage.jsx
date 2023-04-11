import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, message, Tabs, Spin } from 'antd';
import { useLocation } from 'react-router-dom'

import Request from '../utils/axiosUtils'

import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'
import styled from 'styled-components'

import BaseConfig from './baseConfig'
import AllowDenyList from './allowDenyList';
import Authentication from './authentication';
import Ratelimit from './ratelimit';
import HealthCheck from './healthCheck';
import AnomalyDetection from './anomalyDetection';
const RowDiv = styled(Row)`
background: rgb(245, 245, 247);

`;
const TabsDiv = styled(Tabs)`
.ant-tabs-content-holder{
    background:white;
}
height : 80vh;
`


function ConfigPage(props) {
    const [appConfig, setAppConfig] = useState({});
    const [baseConfigData, setBaseConfigData] = useState({})
    const [allowDenyData, setAllowDenyData] = useState({})
    const [authenticationData, setAuthenticationData] = useState({})
    const [ratelimitData, setRatelimitData] = useState({})
    const [healthCheckData, setHealthCheckData] = useState({});
    const [anomalyDetectionData, setAnomalyDetectionData] = useState({});
    const [livenessConfigData, setLivenessConfigData] = useState({})
    const [apiServiceId, setApiServiceId] = useState(undefined);
    const [routeId, setRouteId] = useState(undefined);
    const [loading, setLoading] = useState(false);
    // const ratelimitForm=Form.useForm();
    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);
    useEffect(() => {
        var currentApiServiceId = searchParam.get("apiServiceId");
        if (!currentApiServiceId) {
            return;
        }
        var routeId = searchParam.get("routeId");
        if (!routeId) {
            return;
        }
        setApiServiceId(currentApiServiceId);
        setRouteId(routeId);
        requestAppConfig(currentApiServiceId, routeId);
    }, []);
    const requestAppConfig = (currentApiServiceId, routeId) => {
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                const apiServiceConfig = res.data.response_object.api_service_config.filter(item => item.api_service_id === currentApiServiceId)[0];
                const apiConfigs = apiServiceConfig.service_config.routes.filter(item => item.route_id === routeId)[0];
                setAppConfig(apiConfigs);
                constructBaseConfigData(apiConfigs, apiServiceConfig.listen_port, apiServiceConfig.service_config.server_type);
                constructAllowDenyData(apiConfigs);
                constructAuthenticationData(apiConfigs);
                constructRatelimitData(apiConfigs);
                constructHealthCheckData(apiConfigs);
                constructAnomalyDetectionData(apiConfigs);
                console.log(apiConfigs);
            }
        });

    }
    const constructBaseConfigData = (appConfig, currentPort, server_type) => {
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
            serverType: server_type,
            port: port,
            prefix: prefix,
            routeAlgorighm: routeAlgorighm,
            isCreate: currentPort,
        });
    }
    const constructAllowDenyData = (appConfig) => {
        let allowDenyList = appConfig?.allow_deny_list?.map((item) => {
            let typeLabel = item.limit_type;
            if (typeLabel === "AllowAll") {
                typeLabel = "ALLOW-ALL";
            } else if (typeLabel === "DenyAll") {
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
        if (!type) {
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
            bucketCapacity: appConfig.ratelimit?.capacity,
            ratePerUnit: appConfig.ratelimit?.rate_per_unit,
            ip: appConfig.ratelimit?.limit_location?.value,
            headerKey: appConfig.ratelimit?.limit_location?.key,
            headerValue: appConfig.ratelimit?.limit_location?.value,
            unitType: appConfig.ratelimit?.unit?.type,
            // form:ratelimitForm,
        });
    }
    const constructHealthCheckData = (appConfig) => {
        let defaultType = "None";
        let type = appConfig?.health_check?.type;
        if (type == null) {
            type = defaultType;
        }
        setHealthCheckData({
            healthCheckType: type,
            interval: appConfig.health_check?.base_health_check_param?.interval,
            timeout: appConfig.health_check?.base_health_check_param?.timeout,
            path: appConfig.health_check?.path,
            // form:ratelimitForm,
        });
        setLivenessConfigData({
            minLivenessCount: appConfig.liveness_config?.min_liveness_count,
        });
    }
    const constructAnomalyDetectionData = (appConfig) => {
        let defaultType = "None";
        let type = appConfig?.anomaly_detection?.type;
        if (type == null) {
            type = defaultType;
        }
        setAnomalyDetectionData({
            anomalyDetectionType: type,
            consecutive5xx: appConfig.anomaly_detection?.consecutive_5xx,
            ejectionSecond: appConfig.anomaly_detection?.base_anomaly_detection_param?.ejection_second,
            // form:ratelimitForm,
        });
        setLivenessConfigData({
            minLivenessCount: appConfig.liveness_config?.min_liveness_count,
        });
    }
    const getTabs = () => {
        const baseConfigPage = {
            label: `Base Config`,
            key: 1,
            children: <BaseConfig baseConfigData={baseConfigData} setBaseConfigData={setBaseConfigData} />,
        };
        const allowDenyListPage = {
            label: `Allow Deny List`,
            key: 2,
            children: <AllowDenyList allowDenyData={allowDenyData} setAllowDenyData={setAllowDenyData} />,
        };
        const authenticationPage = {
            label: `Authentication`,
            key: 3,
            children: <Authentication authenticationData={authenticationData} setAuthenticationData={setAuthenticationData} />,
        };
        const ratelimitPage = {
            label: `Rate limit`,
            key: 4,
            children: <Ratelimit ratelimitData={ratelimitData} setRatelimitData={setRatelimitData} />,
        };
        const healthCheckPage = {
            label: `Health Check`,
            key: 5,
            children: <HealthCheck healthCheckData={healthCheckData} setHealthCheckData={setHealthCheckData} livenessConfigData={livenessConfigData}
                setLivenessConfigData={setLivenessConfigData} />,
        };
        const anomalyDetectionPage = {
            label: `Anomaly Detection`,
            key: 6,
            children: <AnomalyDetection anomalyDetectionData={anomalyDetectionData} setAnomalyDetectionData={setAnomalyDetectionData} livenessConfigData={livenessConfigData}
                setLivenessConfigData={setLivenessConfigData} />,
        };
        return [baseConfigPage, allowDenyListPage, authenticationPage, ratelimitPage, healthCheckPage, anomalyDetectionPage];

    };
    const handleSaveButtonOnClick = () => {
        if (!checkBeforeRequest()) {
            return false;
        }
        if (!apiServiceId) {
            createApiServiceConfigOrAddRoute();
        } else {
            updateRouteByRouteId();
        }

    }
    const checkBeforeRequest = () => {
        if (!baseConfigData.serverType) {
            message.error('Please select the server type!');
            return false;
        }
        if (baseConfigData.serverType === "HTTPS") {
            if (!baseConfigData.certificateSource) {
                message.error('Please select the certificateSource!');
            }
            if (baseConfigData.certificateSource === "manual") {
                if (!baseConfigData.certPerm) {
                    message.error('Please fill the cert perm!');
                    return false;
                }
                if (!baseConfigData.keyPerm) {
                    message.error('Please fill the key perm!');
                    return false;
                }
            }
            if (baseConfigData.certificateSource === "letsencrypt") {
                if (!baseConfigData.mailName) {
                    message.error('Please fill the mail name!');
                    return false;
                }
                if (!baseConfigData.domainName) {
                    message.error('Please fill the domain name!');
                    return false;
                }
            }

        }
        if (!baseConfigData.port) {
            message.error('Please fill the port!');
            return false;
        }
        if (!baseConfigData.prefix) {
            message.error('Please fill the prefix!');
            return false;
        }
        if (!baseConfigData.routeAlgorighm) {
            message.error('Please select the routeAlgorighm!');
            return false;
        }
        if (!baseConfigData.tableData || baseConfigData.tableData.length === 0) {
            message.error('Please fill the route!');
            return false;
        }
        if (authenticationData.authenticationType && authenticationData.authenticationType !== "None") {
            if (authenticationData.authenticationType === "ApiKeyAuth") {
                if (!authenticationData.authenticationObj?.key || !authenticationData.authenticationObj?.value) {
                    message.error('Please fill the key and value for Authentication!');
                    return false;
                }
            } else if (authenticationData.authenticationType === "BasicAuth") {
                if (!authenticationData.authenticationObj?.credentials) {
                    message.error('Please fill the credentials for Authentication!');
                    return false;
                }
            }
        }
        if (ratelimitData.ratelimitType && ratelimitData.ratelimitType !== "None") {
            if (ratelimitData.ratelimitType === "TokenBucketRateLimit") {
                if (!ratelimitData.bucketCapacity) {
                    message.error('Please fill the bucket capacity for rate limit!');
                    return false;
                }
            }
            if (!ratelimitData.ratePerUnit) {
                message.error('Please fill the rate per unit for rate limit!');
                return false;
            }
            if (!ratelimitData.unitType) {
                message.error('Please fill the ratelimit unit type for rate limit!');
                return false;
            }
            if (!ratelimitData.limitLocationType) {
                message.error('Please fill the limit location type for rate limit!');
                return false;
            }

            if (ratelimitData.limitLocationType === "IP") {
                if (!ratelimitData.ip) {
                    message.error('Please fill the ip for rate limit!');
                    return false;
                }
                if (!CommonUtils.checkIsIPV4(ratelimitData.ip)) {
                    message.error('Please fill the legal ip for rate limit!');
                    return false;
                }
            }
            if (ratelimitData.limitLocationType === "Header") {
                if (!ratelimitData.headerKey) {
                    message.error('Please fill the headerKey for rate limit!');
                    return false;
                }
                if (!ratelimitData.headerValue) {
                    message.error('Please fill the headerValue for rate limit!');
                    return false;
                }
            }

        }
        if (healthCheckData.healthCheckType && healthCheckData.healthCheckType !== "None") {
            if (!healthCheckData.interval) {
                message.error('Please fill the interval for the health check!');
                return false;
            }
            if (!healthCheckData.timeout) {
                message.error('Please fill the timeout for the health check!');
                return false;
            }
            if (!healthCheckData.path) {
                message.error('Please fill the path for the health check!');
                return false;
            }
            if (!livenessConfigData.minLivenessCount) {
                message.error('Please fill the min liveness count for the health check!');
                return false;
            }
        }
        if (anomalyDetectionData.anomalyDetectionType && anomalyDetectionData.anomalyDetectionType !== "None") {
            if (!anomalyDetectionData.consecutive5xx) {
                message.error('Please fill the count of consecutive 5xx for the health check!');
                return false;
            }
            if (!anomalyDetectionData.ejectionSecond) {
                message.error('Please fill the ejection second for the health check!');
                return false;
            }
            if (!livenessConfigData.minLivenessCount) {
                message.error('Please fill the min liveness count for the health check!');
                return false;
            }
        }


        return true;

    }
    const createApiServiceConfigOrAddRoute = async () => {

        let cert_str = baseConfigData.serverType === "Https" ? baseConfigData.certPerm : null;
        let key_str = baseConfigData.serverType === "Https" ? baseConfigData.keyPerm : null;
        if (baseConfigData.serverType === "Https" && baseConfigData.certificateSource === "letsencrypt") {
            let requestData = {
                "mail_name": baseConfigData.mailName,
                "domain_name": baseConfigData.domainName,
            };
            setLoading(true);
            const data = await Request.post("/letsEncryptCertificate", requestData).then(res => {
                if (res.data?.response_code === 0) {
                    const { key_perm, certificate_perm } = res.data.response_object;
                    return { keyPerm: key_perm, certPerm: certificate_perm };
                }
            }).catch(error => {

                return undefined;
            });
            setLoading(false);

            if (!data) {
                message.error({
                    content: 'Get the certificate of letsEncrypt error,please try agagin or fill the certificate  mannually!',
                    duration: 3,
                });
                return;
            }
            const { keyPerm, certPerm } = data;
            cert_str = certPerm;
            key_str = keyPerm;
        }



        const newRoute = createRoute();
        const newServiceConfig = {
            "listen_port": baseConfigData.port,
            "service_config": {
                "server_type": baseConfigData.serverType,
                "cert_str": cert_str,
                "key_str": key_str,
                "routes": [
                    newRoute
                ]
            }
        };
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                const apiConfigs = res.data.response_object.api_service_config;
                const portIsContained = apiConfigs.some(item => item.listen_port === baseConfigData.port);
                let newApiConfigs = {};
                if (portIsContained) {
                    newApiConfigs = apiConfigs.map(config => {
                        if (config.listen_port === baseConfigData.port) {
                            config.service_config.routes = [...config.service_config.routes, newRoute];
                        }
                        return config;
                    });
                } else {
                    newApiConfigs = [...apiConfigs, newServiceConfig];
                }


                Request.post("/appConfig", newApiConfigs).then(res => {
                    message.info({
                        content: 'Save listener successfully!',
                        duration: 3,
                        onClose: () => {
                            let { history } = props;
                            history.push('/listenerlist');
                        }
                    });
                }).catch(error => {
                    message.error({
                        content: 'Save listener error,the error is ' + error.message,
                        duration: 3,
                    });
                });

            }
        });
    };


    const createRoute = () => {
        const isWeightRoute = baseConfigData.routeAlgorighm === "WeightBasedRoute";
        const isHeaderBasedRoute = baseConfigData.routeAlgorighm === "HeaderBasedRoute";

        const routes = baseConfigData.tableData.map((item) => ({
            "base_route": {
                "endpoint": item.endpoint,
                "try_file": null
            },
            ...(isWeightRoute) && { weight: item.weight },
            ...(isHeaderBasedRoute) && { header_key: item.headerkey },
            ...(isHeaderBasedRoute) && {
                header_value_mapping_type: {
                    type: item.headerValueType,
                    value: item.headerValueMatch
                }
            },
        }));
        return {
            "route_id": routeId,
            "host_name": null,
            "matcher": {
                "prefix": baseConfigData.prefix,
                "prefix_rewrite": "ssss"
            },
            "anomaly_detection": collectAnomalyDetectionData(),
            "allow_deny_list": collectAllowDenyData(),
            "authentication": collectAuthenticationData(),
            "ratelimit": collectRatelimitData(),
            "health_check": collectHealthcheckData(),
            "liveness_config": collectLivessConfigData(),
            "route_cluster": {
                "type": baseConfigData.routeAlgorighm,
                "routes": routes
            }
        };
    }
    const collectLivessConfigData = () => {
        const flag1 = !healthCheckData.healthCheckType || healthCheckData.healthCheckType === "None";
        const flag2 =
            !anomalyDetectionData.anomalyDetectionType || anomalyDetectionData.anomalyDetectionType === "None";

        if (flag1 && flag2) {
            return null;
        }

        return { min_liveness_count: livenessConfigData.minLivenessCount };
    }
    const updateRouteByRouteId = () => {
        const newBaseRoute = createRoute();
        Request.get("/appConfig").then(res => {
            if (res.data.response_code === 0) {
                let apiConfigs = res.data.response_object.api_service_config;
                let newApiConfigs = apiConfigs.map(config => {
                    if (config.api_service_id === apiServiceId) {
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
                    message.info("Save listener successfully!");
                });

            }
        });
    }
    const collectAllowDenyData = () => {
        if (!allowDenyData.allowDenyList) {
            return null;
        }
        return allowDenyData.allowDenyList.map((item) => ({
            limit_type: item.type,
            value: item.value
        }));
    };
    const collectHealthcheckData = () => {
        if (!healthCheckData.healthCheckType || healthCheckData.healthCheckType === "None") {
            return null;
        }
        const data = {
            type: healthCheckData.healthCheckType,
            base_health_check_param: {
                timeout: healthCheckData.timeout,
                interval: healthCheckData.interval
            },
            path: healthCheckData.path
        };
        return data;
    };
    const collectAnomalyDetectionData = () => {
        if (!anomalyDetectionData.anomalyDetectionType || anomalyDetectionData.anomalyDetectionType === "None") {
            return null;
        }
        const data = {
            type: anomalyDetectionData.anomalyDetectionType,
            consecutive_5xx: anomalyDetectionData.consecutive5xx,
            base_anomaly_detection_param: {
                ejection_second: anomalyDetectionData.ejectionSecond,
            },
        };
        return data;
    };
    const collectAuthenticationData = () => {
        if (!authenticationData.authenticationType || authenticationData.authenticationType === "None") {
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
        if (!ratelimitData.ratelimitType || ratelimitData.ratelimitType === "None") {
            return null;
        }

        const isTokenBucket = ratelimitData.ratelimitType === "TokenBucketRateLimit";
        const isLocationOnIP = ratelimitData.limitLocationType === "IP";
        const data = {
            type: ratelimitData.ratelimitType,
            rate_per_unit: ratelimitData.ratePerUnit,
            unit: {
                type: ratelimitData.unitType
            },
            ...(isTokenBucket) && { capacity: ratelimitData.bucketCapacity },
            limit_location: {
                type: ratelimitData.limitLocationType,
                ...(isLocationOnIP) && { value: ratelimitData.ip },
                ...(!isLocationOnIP) && { key: ratelimitData.headerKey },
                ...(!isLocationOnIP) && { value: ratelimitData.headerValue },

            }
        };
        return data;

    };

    return (
        <div style={{ paddingTop: "20px", background: "#f5f5f7", height: "100%" }}>
            <Spin size="large" spinning={loading}>
                <RowDiv>
                    <Col xs={{ span: 16, offset: 4 }} style={{ height: "60vh" }}>
                        <Card title={apiServiceId === undefined ? "New Config" : "Change Config"} extra={<Button type="primary" onClick={handleSaveButtonOnClick}>Save</Button>}>
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
            </Spin>
        </div>
    );

}
export default withRouter(ConfigPage);