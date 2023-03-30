import React, { useState } from 'react'
import {   Button, InputNumber,  Typography,  Table,  Form, Input } from 'antd';

import { Select } from 'antd';

import CommonUtils from '../utils/commonUtils'


const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
        
    },
    wrapperCol: {
        span: 3,
    },
};




function BaseConfig(props) {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    // const [tableData, setTableData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    // const [port,setPort]=useState(props.port);
    // const [prefix,setPrefix]=useState(props.appConfig?.matcher?.prefix);
    // useEffect(() => {
    //     setPrefix(props.appConfig?.matcher?.prefix);
    //     setRouteAlgorighm(props.appConfig?.route_cluster?.type);
    //     // const defaultRoute = { endpoint: "http://192.168.0.1", key: key, weight: 100, headerkey: "user-agent", headerValueType: "Text", headerValueMatch: "test" };

    //     let tableData=props.appConfig?.route_cluster?.routes.map(item=>({
    //         endpoint:item.base_route.endpoint,
    //         key:CommonUtils.guid(),
    //         weight:item.weight?item.weight:100,
    //         headerkey: item.header_key?item.header_key:"user-agent",
    //         headerValueType: item.header_value_mapping_type?.type?item.header_value_mapping_type?.type:"Text", 
    //         headerValueMatch: "test"

    //     }));
    //     setTableData(tableData);
      
    // }, [props.appConfig]);
    const isEditing = (record) => record.key === editingKey;

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        let inputNode = {};
        if (dataIndex === "weight") {
            inputNode = <InputNumber min={0} max={100} defaultValue={100} />;
        } else if (dataIndex === "headerValueType") {
            inputNode = <Select
                defaultValue="Text"
                style={{
                    width: 120,
                }}
                options={[
                    {
                        value: 'Text',
                        label: 'Text',
                    },
                    {
                        value: 'Regex',
                        label: 'Regex',
                    },
                    {
                        value: 'Split',
                        label: 'Split',
                    },

                ]}
            />
        } else {
            inputNode = <Input />;
        }
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    // const handleEditButtonOnClick = (record) => {
    //     const { key } = record;
    //     setTableData(tableData.filter(item => item.key != key))
    // }
    const edit = (record) => {
        form2.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const handleDeleteButtonClick=(record)=>{
        const { key } = record;
        const newTableData=props.baseConfigData.tableData.filter(item => item.key !== key);
        props.setBaseConfigData(prevData=>({
            ...prevData,
            tableData:newTableData
        }))
        // props.setBaseConfigData((baseConfigData)=>{
        //     const tableData=baseConfigData.tableData;
        //     baseConfigData.tableData=tableData.filter(item => item.key != key);
        //     return baseConfigData;
        // });
        // setTableData(tableData=>tableData.filter(item=>item.key!=record.key))
    };  
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form2.validateFields();
            const newData = [...props.baseConfigData.tableData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                // setTableData(newData);
                props.setBaseConfigData(prevData=>({
                    ...prevData,
                    tableData:newData
                }))

                setEditingKey('');
            } else {
                newData.push(row);
                // setTableData(newData);
                props.setBaseConfigData(prevData=>({
                    ...prevData,
                    tableData:newData
                }))

                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Endpoint',
            dataIndex: 'endpoint',
            editable: true,

        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Typography.Link
                            onClick={cancel}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Cancel
                        </Typography.Link>
                    </span>
                ) : (
                    <span>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{
                                marginRight: 8,
                            }}>
                        Edit
                    </Typography.Link>
                     <Typography.Link disabled={editingKey !== ''} onClick={() => handleDeleteButtonClick(record)} style={{
                                marginRight: 8,
                            }}>
                        Delete
                    </Typography.Link>
                    </span>
                );
            },
        },
    ];
    const mergedColumns = () => getColumn().map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const addRowButtonClick = () => {
        const key = CommonUtils.guid();
        const defaultRoute = { endpoint: "http://192.168.0.1:4450", key: key, weight: 100, headerkey: "user-agent", headerValueType: "Text", headerValueMatch: "test" };
        // setTableData(tableData => [...tableData, defaultRoute]);
        console.log(defaultRoute);
        // props.setBaseConfigData(prevStyle =>{
        //     baseConfigData.tableData.push(defaultRoute);
        //     return baseConfigData;
        // });
        const newTableData = [...props.baseConfigData.tableData,defaultRoute]; 
        props.setBaseConfigData(prevData=>({
            ...prevData,
            tableData:newTableData
        }))

    }
    const getColumn = () => {
        if (props.baseConfigData.routeAlgorighm === "WeightBasedRoute") {
            const weightColumn = {
                title: 'Weight',
                dataIndex: 'weight',
                editable: true,

            };
            return [columns[0], weightColumn, columns[1]]
        }
        if (props.baseConfigData.routeAlgorighm === "HeaderBasedRoute") {
            const headerKeyColumn = {
                title: 'Header Key',
                dataIndex: 'headerkey',
                editable: true,
            };
            const headerValueTypeColumn = {
                title: 'Header Value Type',
                dataIndex: 'headerValueType',
                editable: true,
            };
            const headerValueColumn = {
                title: 'Header Value',
                dataIndex: 'headerValueMatch',
                editable: true,
            };
            return [columns[0], headerKeyColumn, headerValueTypeColumn, headerValueColumn, columns[1]]
        }
        return columns;
    }
    const onRouteAlgorighmChange = (value) => {
          props.setBaseConfigData(prevData=>({
            ...prevData,
            routeAlgorighm:value
        }))

        // setRouteAlgorighm(value);
    };
    const onFinish = (values) => {
        console.log(values);
    };


    const handlePortInputChange=(e)=>{
        let oldData=props.port;
        props.setAppConfig(e.target.value);
        console.log(oldData);
    }
    const prefixInputOnchange=(e)=>{
        props.setBaseConfigData(prevData=>({
            ...prevData,
            prefix:e.target.value
        }))
    }
    return (
        <div style={{padding:20}}>
        <Form {...layout} form={form1} name="control-hooks" onFinish={onFinish}
            // initialValues={{ routeAlgorighm: routeAlgorighm}}
            fields={[
                {
                name:["port"],
                value:props.baseConfigData.port
                },
                {
                    name:["prefix"],
                    value:props.baseConfigData.prefix
                },
                {
                    name:["routeAlgorighm"],
                    value:props.baseConfigData.routeAlgorighm
                }
            ]}
        >
            <Form.Item
                name="port"
                label="Port"
                rules={[
                    {
                        required: true,
                    },
                ]}>
                    {/* <div>{props.appConfig.listen_port}</div> */}
                <Input  onChange={handlePortInputChange}/>
            </Form.Item>
            <Form.Item
                name="prefix"
                label="Prefix"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input onChange={prefixInputOnchange}/>
            </Form.Item>
            <Form.Item
                name="routeAlgorighm"
                label="Route Algorighm"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >

                <Select
                    placeholder="Select a option and change input text above"
                    onChange={onRouteAlgorighmChange}
                    allowClear
                >
                    <Option value="PollRoute">Poll</Option>
                    <Option value="RandomRoute">Random</Option>
                    <Option value="WeightBasedRoute">Weight</Option>
                    <Option value="HeaderBasedRoute">HeaderBased</Option>

                </Select>

            </Form.Item>
            {/* <Form.Item
                name="routeCluster"
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
            >
                {({ getFieldValue }) =>
                    getFieldValue('gender') === 'other' ? (
                        <Form.Item
                            name="customizeGender"
                            label="Customize Gender"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    ) : null
                }
            </Form.Item> */}

            <Form.Item
                wrapperCol={{ span: 16 }}
                name="RouteCluster"
                label="Route Cluster"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >   <div>
                <Button type="link" onClick={addRowButtonClick}>Add One Route</Button>

                <Form form={form2} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        scroll={{
                            y: 240,
                        }}
                        bordered
                        dataSource={props.baseConfigData.tableData}
                        columns={mergedColumns()}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Form>
                </div>

            </Form.Item>

            {/* <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item> */}
        </Form>
        </div>
    );


}
export default BaseConfig;