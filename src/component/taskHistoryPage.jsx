import { React, Component } from 'react'
import { Row, Col, List, Card, Statistic, Button, Table, Image, Spin, Alert, Modal } from 'antd';
import FilmItem from './filmItem'
import Request from '../utils/axiosUtils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'

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
const LoginOutButton = styled(Button)`
  border-radius: 5px;
  margin-top:20px;

`
const CardDiv = styled(Card)`
border-radius: 5px;
margin-top:20px;
`
const HeaderCardDiv = styled(Card)`
border-radius: 5px;
margin-top:20px;
background:#f5f5f7;
`
const LIMIT = 20;
class TaskHistoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList: [],
            totalCount: 0, taskId: "",
            loading: false,
            isModalVisible: false,
            logDetail: "",
            taskDetail:{}
        };

    }
    topOptions = [
        { label: 'topLeft', value: 'topLeft' },
        { label: 'topCenter', value: 'topCenter' },
        { label: 'topRight', value: 'topRight' },
        { label: 'none', value: 'none' },
    ];

    bottomOptions = [
        { label: 'bottomLeft', value: 'bottomLeft' },
        { label: 'bottomCenter', value: 'bottomCenter' },
        { label: 'bottomRight', value: 'bottomRight' },
        { label: 'none', value: 'none' },
    ];

    columns = [

        {
            title: 'TaskExecuteTime(ms)',
            dataIndex: 'taskExecuteTime',
            key: 'taskExecuteTime',
        },

        {
            title: 'StatusCode',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Date',
            dataIndex: 'dates',
            key: 'dates',
        },
        {
            title: 'Response',
            dataIndex: 'response',
            key: 'response',
            ellipsis: true,
            render: (text, record) => {
                const guid = CommonUtils.guid()
                return (

                    <Button type="link" size="large" key={guid} onClick={() => this.clickDetail(record.response)}>Detail</Button>

                );
            }

        },


    ];
    componentWillMount() {
        console.log("aaa")
        const query = this.props.location.search // '?mailToken=e336f149-f542-4f47-88c1-2403735332d2'
        const taskId = query.substr("?taskId=".length, query.length) // '1'

        this.setState({
            taskId: taskId
        });
        var data = {
            "taskId": taskId,
            "offset": 0,
            "limit": LIMIT,
        }
        Request.get("/api/getTaskByTaskld?taskId="+taskId).then(res => {
            if(res.data.resCode==0){
                this.setState({
                    taskDetail:res.data.resMessage
                });

            }
        });
        Request.post("/api/getTaskHistory", data).then(res => {

            if (res.data.resCode == 0) {

                const hisList = res.data.resMessage.taskHistoryList.map((item) => {

                    const { response, taskStatus, taskExecuteTime, timestamp } = item;

                    return ({
                        taskExecuteTime: taskExecuteTime,
                        status: taskStatus,
                        response: response,
                        dates: timestamp
                    });
                })
                this.setState({
                    historyList: hisList,
                    totalCount: res.data.resMessage.totalCount
                });
            } else {

            }
        });
    }
    pageOnChange = (page, pageSize) => {
        const offset = (Number(page) - 1) * LIMIT;
        var data = {
            "taskId": this.state.taskId,
            "offset": offset,
            "limit": LIMIT,
        }
        this.setState({
            loading: true
        })
        Request.post("/api/getTaskHistory", data).then(res => {

            this.setState({
                loading: false
            })

            if (res.data.resCode == 0) {

                const hisList = res.data.resMessage.taskHistoryList.map((item) => {

                    const { response, taskStatus, taskExecuteTime, timestamp } = item;

                    return ({
                        taskExecuteTime: taskExecuteTime,
                        status: taskStatus,
                        // response:response,
                        dates: timestamp
                    });
                })
                this.setState({
                    historyList: hisList,
                    totalCount: res.data.resMessage.totalCount
                });
            } else {

            }
        });
    }

    getRowkey() {

        return CommonUtils.guid()
    }
    handleOk = () => {
        this.setState({
            isModalVisible: false
        });
    };
    clickDetail(detail) {
        console.log(detail);
        this.setState({
            isModalVisible: true,
            logDetail: detail
        });
    }

    handleCancel = () => {
        this.setState({
            isModalVisible: false
        });
    };

    render() {
        const { totalCount, loading, isModalVisible, logDetail ,taskDetail} = this.state;
        var arr = Object.keys(taskDetail);
        let taskNameShow=""
        let taskCronShow=""
        let taskTypeShow=""
        let taskUrlShow=""
        let taskBodyShow=""
        if(arr.length !== 0){
            const {taskName,taskCron,taskType,taskUrl,taskBody}=taskDetail
            taskNameShow=taskName
            taskCronShow=taskCron
            taskUrlShow=taskUrl
            taskBodyShow=taskBody
            if(taskBodyShow==="")
            taskBodyShow="---"
            if(taskType===0){
                taskTypeShow="Get"
            }else{
                taskTypeShow="Post"
            }
        }
        console.log(taskDetail)

        return (
            <>
                <Modal title="Response" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p>{logDetail}</p>

                </Modal>
                <Row>
                    <Spin tip="Loading..." spinning={loading}>
                        <Col span={18} offset={3}>
                            <HeaderCardDiv>
                                <Row style={{textAlign:"center"}}>
                                <Col span={8}>
                                    <Statistic title="Task Name" value={taskNameShow} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Task Cron" value={taskCronShow}  />
                                </Col>
                            
                                <Col span={8}>
                                    <Statistic title="Task Http Method Type" value={taskTypeShow}  />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Task Http Url" value={taskUrlShow} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Task Http  Body" value={taskBodyShow}  />
                                </Col>
                                </Row>

                            </HeaderCardDiv>
                        </Col>
                        <Col span={18} offset={3}>
                            <CardDiv>
                                <Table
                                    scroll={{ y: 400 }}
                                    rowKey={record => this.getRowkey()}
                                    columns={this.columns}
                                    pagination={{ position: ['bottomRight', 'bottomRight'], defaultPageSize: 20, total: totalCount, onChange: this.pageOnChange, showSizeChanger: false }}
                                    dataSource={this.state.historyList}

                                />
                            </CardDiv>
                        </Col>
                    </Spin>

                </Row>

            </>
        );
    }
}
export default withRouter(TaskHistoryPage);