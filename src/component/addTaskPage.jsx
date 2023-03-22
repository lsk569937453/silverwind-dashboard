import { React, Component } from 'react'
import { Row, Col, List, Card, BackTop, Button, Carousel, message, Result, Form, Input, Select, Collapse } from 'antd';
import FilmItem from './filmItem'
import Request from '../utils/axiosUtils'
import { debounce } from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom'

import CommonUtils from '../utils/commonUtils'

import styled from 'styled-components'
import { EditOutlined } from '@ant-design/icons';
import expressionUtils from "../utils/expression";
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
const CarouselDiv = styled(Col)`
margin-top:10px;
`
const EditButtonDiv = styled(Button)`
border-radius: 10px;
font-size: 20px;
font-weight: 600;
&.ant-btn-lg{
    padding-top:0px;
    padding-bottom:0px;

}

`
const { Panel } = Collapse;

const LoginButton = styled(Button)`
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;

`
const CronResultCardDiv = styled(Card)`
margin-top:20px;
border-radius:20px;
background: #F5F5F5;
font-weight: 600;
`
const CardDiv = styled(Card)`
margin-top:20px;
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
class AddTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            demoArray: [],
            showReqBody: false,
            cronResult: {},
            showAddResult: 0,
            jumpCount:5

        };

    }

    onAddFormSubmit = (values) => {
        let form2TaskType = values.form2TaskType;
        let taskBody = "";
        if (form2TaskType === "Get")
            form2TaskType = 0;
        else {
            form2TaskType = 1;
            taskBody = values.form2ReqBody;
        }



        const submitData = {
            "taskName": values.form2TaskName, "taskCron": values.form2TaskCron,
            "taskType": form2TaskType, "taskUrl": values.form2TaskUrl, "taskBody": taskBody
        };
        Request.post("/api/addTask", submitData).then((res) => {
            if (res.data.resCode == 0) {
               this.setState({
                   showAddResult:1
               });
               let drawLoadInterval=setInterval(() => {
                   const {jumpCount}=this.state;
                   if(jumpCount==0){
                    clearInterval(drawLoadInterval);
                    let { history } = this.props;
                    history.push({pathname: '/'})
            
                   }else{
                   this.setState({
                       jumpCount:jumpCount-1
                   })
                }
                   
               }, 1000);
            } else if (res.data.resCode == -1) {
                message.error('Login failed!');
            }
            else if (res.data.resCode == -3) {
                message.error('Email was not validated!');
            }

        }).catch(function (error) {
            message.error('login failed!');

            console.log(error);
        });
    }
    componentWillMount() {
        const array = expressionUtils.getDemoExpression().map((item) => {
            return item["cron"];
        });
        const data = {
            cronList: array
        };
        Request.post("/api/getMultiCronResult", data).then(res => {
            if (res.data.resCode == 0) {
                this.setState({
                    demoArray: res.data.resMessage
                });
            }
        });
    }


    callback(key) {
        console.log(key);
    }


    generate(item) {
        const key = CommonUtils.guid();
        return (
            <Panel header={item.cronExpression} key={key}>
                {
                    item.result.map((v, i) => {
                        return <p key={i}>{v}</p>
                    })
                }
            </Panel>
        );

    }
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
    generateAddResult(){
        const { jumpCount } = this.state;
        const title="Successfully Add the task!Page will jump in "+jumpCount+" seconds";

        return (
            <Result
            status="success"
            title={title}
        />
        );
    }

    render() {

        const demoThree = this.state.demoArray.map((item) => this.generate(item));
        const { showReqBody, cronResult, showAddResult } = this.state;

        const arr = Object.keys(cronResult);
        const generateAddResult=this.generateAddResult();
        return (
            <>
                <Row>
                    <Col span={11} offset={1}>
                        {showAddResult == 0 ? <CardDiv>
                            <h3 className="headerTitle">Add Task</h3>
                            <Form ref={this.formRef2}
                                onFinish={this.onAddFormSubmit}
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
                                        <LoginButton type="primary" block htmlType="submit">Add Task</LoginButton>
                                    </Col>
                                </Form.Item>
                            </Form>
                        </CardDiv> :
                                generateAddResult}
                    </Col>
                    <Col span={10} offset={1}>
                        <CardDiv>
                            <h3 className="headerTitle">Cron Expression Result</h3>

                            <Collapse defaultActiveKey={['1']} onChange={() => this.callback()}>
                                {
                                    demoThree
                                }
                            </Collapse>
                            {
                                arr.length == 0 ? <></> :
                                    <CronResultCardDiv title={cronResult.cronExpression + "  Result is:"}>
                                        {
                                            cronResult.result.map((item, i) => {
                                                return (<p key={i}>{item}</p>);
                                            })
                                        }
                                    </CronResultCardDiv>
                            }
                        </CardDiv>
                    </Col>
                </Row>
            </>
        );
    }
}
export default withRouter(AddTaskPage);