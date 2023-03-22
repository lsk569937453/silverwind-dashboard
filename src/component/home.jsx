import { React, Component, createRef } from 'react'
import { Row, Col, Result, Card, message, Table, Space, Button, Affix, Modal, Form, Input, Select } from 'antd';
import FilmItem from './filmItem'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from '../utils/axiosUtils'

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import CommonUtils from "../utils/commonUtils"
import { PlusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import styled from 'styled-components'
const Updiv = styled.div`
     height: 40;
  width: 40;
  line-height: 40px;
  border-radius: 4;
  background: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 14;
`;
const LoginButton = styled(Button)`
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;

`
const InputCss = styled(Input)`

        min-height:50px;
        border-radius: 15px;
        margin-top:20px;
`
const CardDiv = styled(Card)`
   margin-top:20px;
  border-radius: 10px;
  background: #F8F8FF;
  
`;
const EditButtonDiv = styled(Button)`
border-radius: 50px;
font-size: 20px;
font-weight: 600;
z-index:9999;
&.ant-btn-lg{
    padding-top:0px;
    padding-bottom:0px;

}

`
const ModalDiv = styled(Modal)`
border-radius:20px;
text-align:center;
.headerTitle{
    font-weight:bold;
    font-size:20px;
}
input{
    height: 38px;
    border-radius: 5px;
}
.ant-form-item-label>label{
    height: 38px;
    font-weight: 600;
}
.ant-select-single .ant-select-selector{
    border-radius: 5px;
}
`
const CronResultCardDiv = styled(Card)`
margin-top:20px;
border-radius:20px;
background: #F5F5F5;
font-weight: 600;
`
const { confirm } = Modal;

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
            ],
            editDiagVisible: false,
            //diag show the post body input
            showReqBody: false,

            editObject: {},
            //for show teh cronResult of the cronExpression
            cronResult: {},
            //for save the item
            currentTaskId: "",
            //show the save result
            isSaveSuccess: false

        };

    }

    componentWillMount() {
        Request.get("/api/getTask").then(res => {
            if (res.data.resCode == 0) {

                const dataArray = res.data.resMessage.map(item => {
                    const { taskId, userId, taskName, taskCron, taskType, taskUrl, taskStatus, taskBody, timestamp } = item;
                    const key = CommonUtils.guid();
                    return ({
                        taskId: taskId,
                        userId: userId,
                        taskName: taskName,
                        taskCron: taskCron,
                        taskType: taskType,
                        taskUrl: taskUrl,
                        taskStatus: taskStatus,
                        taskBody: taskBody,
                        timestamp: timestamp,
                        key: key
                    });

                });
                this.setState({
                    dataSource: dataArray
                });
            }
        });
    }
    formRef1 = createRef();

    onSaveFormSubmit = (values) => {
        let form2TaskType = values.form2TaskType;
        let taskBody = "";
        if (form2TaskType === "Get")
            form2TaskType = 0;
        else {
            form2TaskType = 1;
            taskBody = values.form2ReqBody;
        }
        const { currentTaskId } = this.state;
        const submitData = {
            "taskName": values.form2TaskName, "taskCron": values.form2TaskCron,
            "taskType": form2TaskType, "taskUrl": values.form2TaskUrl, "taskBody": taskBody, "taskId": currentTaskId
        };
        Request.post("/api/updateTask", submitData).then((res) => {
            if (res.data.resCode == 0) {
                this.setState({
                    isSaveSuccess: true
                });
                setTimeout(()=>{
                    window.location.reload();
                },1500)
            } else if (res.data.resCode == -1) {
                message.error('Save failed!');
            }
          

        }).catch(function (error) {
            message.error('login failed!');

            console.log(error);
        });
    }


    columns = [
        {
            title: 'TaskName',
            dataIndex: 'taskName',
            key: 'taskName',
            ellipsis: true,
            align: 'center'    // 设置文本居中的属性


        },
        {
            title: 'TaskCron',
            dataIndex: 'taskCron',
            key: 'taskCron',
            align: 'center'    // 设置文本居中的属性

        },
        {
            title: 'TaskUrl',
            dataIndex: 'taskUrl',
            key: 'taskUrl',
            ellipsis: true,
            align: 'center',

        },
        {
            title: 'TaskType',
            dataIndex: 'taskType',
            key: 'taskType',
            align: 'center'

        },


        {
            title: 'TaskBody',
            dataIndex: 'taskBody',
            key: 'taskBody',
            align: 'center'
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 250,
            align: 'center'    // 设置文本居中的属性


        },
        {
            title: 'TaskStatus',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            align: 'center',
            render: (text, record) => {

                const err = <CloseCircleOutlined style={{ fontSize: '25px', color: 'red' }} />
                return (
                    <>
                        <CheckCircleOutlined style={{ fontSize: '25px', color: 'green' }} />
                    </>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="small">
                    <Button type="link" onClick={() => this.editButtonHandleClick(record)}>Edit</Button>
                    <Button type="link" onClick={() => this.historyButtonHandleClick(record)}>Go History</Button>
                    <Button type="link" danger onClick={() => this.deleteButtonHandleClick(record)}>Delete</Button>
                </Space>
            ),
            align: 'center',
            width: 300,

        },
    ];
    historyButtonHandleClick(record) {
        const { taskName, taskId, taskCron, taskBody, taskUrl, taskType } = record
        let { history } = this.props;
        history.push('/taskHistoryPage?taskId=' + taskId)
    }
    deleteButtonHandleClick(record) {
        const { taskName, taskId, taskCron, taskBody, taskUrl, taskType } = record
        const content = "Task name is '" + taskName + "'\n.Task cron is '" + taskCron + "'\n.Task url is '" + taskUrl + "'";
        confirm({
            title: 'Do you Want to delete this item?',
            icon: <ExclamationCircleOutlined />,
            content: content,
            onOk() {
                const data = { "taskId": taskId };
                Request.post("/api/deleteTask", data).then((res) => {
                    window.location.reload();
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    /**
     * After setstate,then set the value for Form
     * @param {} record 
     */
    editButtonHandleClick(record) {
        const { taskName, taskId, taskCron, taskBody, taskUrl, taskType } = record
        console.log(record)

        this.setState({
            editDiagVisible: true,
            currentTaskId: taskId
        }, () => {
            let reqMehod = "Get"
            if (taskType !== 0) {
                reqMehod = "Post"
                this.setState({
                    showReqBody: true,
                });
            }
            this.formRef1.current.setFieldsValue({
                "form2TaskName": taskName,
                "form2TaskCron": taskCron,
                "form2TaskType": reqMehod,
                "form2TaskUrl": taskUrl,
                "form2ReqBody": taskBody

            });
        });

    }
    addButtonHandleClick() {
        let { history } = this.props;
        history.push({ pathname: '/addTaskPage' })

    }
    onEditFormSubmit = (values) => { }
    handleInsertTitleOk = () => {
        this.setState({ editDiagVisible: true });
    };

    handleInsertTitleCancel = () => {
        this.setState({ editDiagVisible: false });
    };

    onHttpMethodChange(value) {
        console.log(value);
        switch (value) {
            case 'Get':
                this.setState({
                    showReqBody: false
                });
                return;
            case 'Post':
                this.setState({
                    showReqBody: true

                });
                return;
        }
    }
    cronValidator = (rule, value, callback) => {
        if (value === undefined || value === "") {
            return Promise.reject("Please input task task cron!")

        }
        try {
            const array = [];
            array.push(value);
            const data = {
                cronList: array
            }
            return new Promise((resolve, reject) => {
                Request.post("/api/getSingleCronResult", data).then(res => {
                    if (res.data.resCode == 0) {
                        this.setState({
                            cronResult: res.data.resMessage
                        })
                        return resolve();
                    } else {
                        this.setState({
                            cronResult: {}
                        })
                        return reject("The cron express is wrong!");

                    }
                })
            });
        } catch (err) {
            return Promise.reject(err);
        }
        return Promise.resolve()
    }
    urlValidator = (rule, value, callback) => {
        return new Promise((resolve, reject) => {

            if (value === undefined || value === "") {
                return reject("Please input task task url!")
            }
            const isHttp = value.startsWith("http://");
            const isHttps = value.startsWith("https://");
            if (isHttp || isHttps) {
                resolve()
            } else {
                reject("Please input url start with http:// or https://");
            }
        });

    }
    getRowkey() {

        return CommonUtils.guid()
    }

    render() {


        const { editDiagVisible, isSaveSuccess, showReqBody, cronResult } = this.state
        const arr = Object.keys(cronResult);
        return (
            <>
                <Affix offsetBottom={30} style={{ position: "absolute", right: 100, bottom: 50 }}>
                    <EditButtonDiv type="primary" onClick={() => this.addButtonHandleClick()} size="large" icon={<PlusCircleOutlined />}>
                        Add Task
                             </EditButtonDiv>

                </Affix>
                <Row>
                    <Col span={20} offset={2}>
                        <CardDiv>
                            <Table dataSource={this.state.dataSource} columns={this.columns}
                                rowKey={record => this.getRowkey()}
                            />
                        </CardDiv>
                    </Col>
                </Row>
                <div>
                    <ModalDiv visible={editDiagVisible} onOk={this.handleInsertTitleOk}
                        onCancel={this.handleInsertTitleCancel}
                        footer={null}
                        title="Edit Task"

                    >
                        {!isSaveSuccess ?
                            <>
                                <Form ref={this.formRef1}
                                    onFinish={this.onSaveFormSubmit}
                                    autoComplete="false"
                                    labelCol={{ span: 5 }}
                                >
                                    <Form.Item name="form2TaskName" rules={[{ required: true, message: "Please input task name!" }]} label="Task Name">
                                        <Input placeholder="TaskName" />
                                    </Form.Item>
                                    <Form.Item name="form2TaskCron" rules={[{
                                        validator: this.cronValidator
                                    }]} label="Task Cron">
                                        <Input placeholder="TaskCron" />
                                    </Form.Item>
                                    <Form.Item label="Http Method" name="form2TaskType" rules={[{ required: true, message: "Please select task type!" }]} >
                                        <Select onChange={(val) => this.onHttpMethodChange(val)}
                                            placeholder="Select a http method"
                                            size="large"
                                        >
                                            <Select.Option value="Get">Get</Select.Option>
                                            <Select.Option value="Post">Post</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="form2TaskUrl" rules={[{ validator: this.urlValidator }]} label="Task Url">
                                        <Input placeholder="TaskUrl" />
                                    </Form.Item>
                                    {showReqBody ? <Form.Item name="form2ReqBody" rules={[{ required: true, message: "Please input http request body!" }]} label="Request Body">
                                        <Input placeholder="Request Body" />
                                    </Form.Item> : <></>}

                                    <Form.Item>
                                        <Col span={12} offset={6}>
                                            <LoginButton type="primary" block htmlType="submit">Save Task</LoginButton>
                                        </Col>
                                    </Form.Item>
                                </Form>
                                {arr.length == 0 ? <></> :
                                    <CronResultCardDiv title={cronResult.cronExpression + "  Result is:"}>
                                        {
                                            cronResult.result.slice(0, 3).map((item, i) => {

                                                return (<p key={i}>{item}</p>);

                                            })
                                        }
                                    </CronResultCardDiv>
                                }
                            </> :
                            <Result
                                status="success"
                                title="You have success save the item!"
                            />
                        }

                    </ModalDiv>

                </div>

            </>
        );
    }
}
