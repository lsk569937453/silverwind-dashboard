import React, { useState } from 'react'
import { Button, InputNumber, Typography, Table, Form, Input } from 'antd';

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


const { TextArea } = Input;


function BaseConfig(props) {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

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
                        value: 'TEXT',
                        label: 'Text',
                    },
                    {
                        value: 'REGEX',
                        label: 'Regex',
                    },
                    // {
                    //     value: 'SPLIT',
                    //     label: 'Split',
                    // },

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


    const edit = (record) => {
        form2.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const handleDeleteButtonClick = (record) => {
        const { key } = record;
        const newTableData = props.baseConfigData.tableData.filter(item => item.key !== key);
        props.setBaseConfigData(prevData => ({
            ...prevData,
            tableData: newTableData
        }))
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
                props.setBaseConfigData(prevData => ({
                    ...prevData,
                    tableData: newData
                }))

                setEditingKey('');
            } else {
                newData.push(row);
                props.setBaseConfigData(prevData => ({
                    ...prevData,
                    tableData: newData
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
        const defaultRoute = { endpoint: "http://192.168.0.1:4450", key: key, weight: 100, headerkey: "user-agent", headerValueType: "TEXT", headerValueMatch: "test" };
        const oldData = props.baseConfigData?.tableData ? props.baseConfigData?.tableData : [];
        const newTableData = [...oldData, defaultRoute];
        props.setBaseConfigData(prevData => ({
            ...prevData,
            tableData: newTableData
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
        props.setBaseConfigData(prevData => ({
            ...prevData,
            routeAlgorighm: value
        }))

        // setRouteAlgorighm(value);
    };
    const handleServerTypeOnChange = (value) => {
        props.setBaseConfigData(prevData => ({
            ...prevData,
            serverType: value
        }))

        // setRouteAlgorighm(value);
    };
    const onFinish = (values) => {
        console.log(values);
    };


    const handlePortInputChange = (value) => {
        props.setBaseConfigData(prevData => ({
            ...prevData,
            port: value
        }))
    }
    const handleKeyPermInputChange = (e) => {
        props.setBaseConfigData(prevData => ({
            ...prevData,
            keyPerm: e.target.value
        }))
    }
    const handleCertPermInputChange = (e) => {
        props.setBaseConfigData(prevData => ({
            ...prevData,
            certPerm: e.target.value
        }))
    }
    const prefixInputOnchange = (e) => {
        props.setBaseConfigData(prevData => ({
            ...prevData,
            prefix: e.target.value
        }))
    }
    return (
        <div style={{ padding: 20 }}>
            <Form {...layout} form={form1} name="control-hooks" onFinish={onFinish}
                fields={[
                    {
                        name: ["port"],
                        value: props.baseConfigData.port
                    },
                    {
                        name: ["prefix"],
                        value: props.baseConfigData.prefix
                    },
                    {
                        name: ["routeAlgorighm"],
                        value: props.baseConfigData.routeAlgorighm
                    }
                ]}
            >
                { props.baseConfigData.isCreate ?<></>:
                <Form.Item
                    name="serverType"
                    label="Server Type"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >

                    <Select
                        placeholder="Select the server type!"
                        onChange={handleServerTypeOnChange}
                        allowClear
                    >
                        <Option value="HTTP">HTTP</Option>
                        <Option value="HTTPS">HTTPS</Option>

                    </Select>

                </Form.Item>}
                {
                    (props.baseConfigData?.serverType === "HTTPS") ?
                        <Form.Item
                            name="certPerm"
                            label="Cert Perm"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <TextArea autoSize={{
                                minRows: 2,
                                maxRows: 2,
                            }} onChange={handleCertPermInputChange} />

                        </Form.Item> : <></>
                }
                {
                    (props.baseConfigData?.serverType === "HTTPS") ?
                        <Form.Item
                            name="keyPerm"
                            label="Key Perm"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <TextArea autoSize={{
                                minRows: 2,
                                maxRows: 2,
                            }} onChange={handleKeyPermInputChange} />

                        </Form.Item> : <></>
                }
                {
                    props.baseConfigData.isCreate ? <></> :
                        <Form.Item
                            name="port"
                            label="Port"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <InputNumber onChange={handlePortInputChange} min={0} max={65535} />
                        </Form.Item>
                }
                <Form.Item
                    name="prefix"
                    label="Prefix"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input onChange={prefixInputOnchange} />
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
                        placeholder="Select a route algorighm!"
                        onChange={onRouteAlgorighmChange}
                        allowClear
                    >
                        <Option value="PollRoute">Poll</Option>
                        <Option value="RandomRoute">Random</Option>
                        <Option value="WeightBasedRoute">Weight</Option>
                        <Option value="HeaderBasedRoute">HeaderBased</Option>

                    </Select>

                </Form.Item>


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


            </Form>
        </div>
    );


}
export default BaseConfig;