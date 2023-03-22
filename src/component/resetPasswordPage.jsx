import { React, Component, createRef } from 'react'
import { Row, Col, Form, Input, BackTop, Button, Carousel, Image, Result } from 'antd';
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
const InputPsswordCss = styled(Input.Password)`

        min-height:50px;
        border-radius: 15px;
        margin-top:10px;

        :-webkit-autofill {
            color: #2a2a2a !important;
        }

        &::-webkit-autofill  {
            -webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
            -webkit-animation-name: autofill;
            -webkit-animation-fill-mode: both;
           
         }
       
`
const ResetButton = styled(Button)`

background:#18aaff;
border-color:#18aaff;
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;

`
class ResetPaswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetToken: "",
            resetStatus: 0
        };

    }
    formRef = createRef();

    componentWillMount() {
        const query = this.props.location.search // '?mailToken=e336f149-f542-4f47-88c1-2403735332d2'
        const resetToken = query.substr("?resetToken=".length, query.length) // '1'

        if (resetToken === "" || resetToken === undefined) {
            return;
        }
        this.setState({
            resetToken: resetToken
        });

    }


    clickToEdit() {
        let { history } = this.props;
        // history.push({pathname: '/editPage'})
        history.push({ pathname: '/postDetailPage' })

    }
    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.formRef.current
        if (value && value !== getFieldValue('formPassowrd1')) {
            return Promise.reject("The two passwords are inconsistent!");
        }

        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        return Promise.resolve();

    }

    handleResetButton=(values)=>{
        const {formPassowrd1} = values;
        const {resetToken} = this.state;
        const data={
            token:resetToken,
            password:formPassowrd1
        }
        Request.post("/api/user/resetPassword", data).then(res => {
            if (res.data.resCode == 0) {
                    this.setState({
                        resetStatus:1
                    });

            } else {
                this.setState({
                    resetStatus:-1
                });
            }
        });

    }
    generateRow() {
        const { resetStatus, resetToken } = this.state;

        if (resetStatus === 0)
            return (<>
                <Form ref={this.formRef} onFinish={this.handleResetButton}>

                    <Row>
                        <Col span={8} offset={8}>
                            <Form.Item
                                name="formPassowrd1" rules={[{ required: true, message: "Please input password!" }, { min: 6, message: 'The length of the password at least 6!', }
                               ]}

                            >
                                <InputPsswordCss
                                    placeholder="Password" autoComplete="new-password"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={8}>
                            <Form.Item
                                name="formPassowrd2" rules={[{ required: true, message: "Please input password!" }, { min: 6, message: 'The length of the password at least 6!', },{
                                    validator:this.handleConfirmPassword
                                }]}
                            >
                                <InputPsswordCss
                                    placeholder="Confirm Password" autoComplete="new-password"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={8} >
                            <ResetButton type="primary" htmlType="submit" block>Reset</ResetButton>
                        </Col>
                    </Row>
                </Form>

            </>);
        if (resetStatus === -1)
            return (<Result
                status="error"
                title="Reset Password Error!"
            />);
        return (<Result
            status="success"
            title="Reset Password Success!"
        />);

    }
    render() {
        const validateStatusDiv = this.generateRow();
        return (
            <>
                <Row>
                    <Col span={24}>
                        {
                            validateStatusDiv
                        }
                    </Col>
                </Row>
            </>
        );
    }
}
export default withRouter(ResetPaswordPage);