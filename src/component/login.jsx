import { React, Component, createRef } from 'react'
import { Row, Col, List, Card, BackTop, message, Button, Input, Space, Form, Result } from 'antd';
import styled from 'styled-components'
import Request from '../utils/axiosUtils'


const MainDiv = styled.div`
margin-top:50px;

`
const InputCss = styled(Input)`

        min-height:50px;
        border-radius: 15px;
        margin-top:10px;
`
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
const LoginButton = styled(Button)`
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;

`
const RegisterButton = styled(Button)`

background:#18aaff;
border-color:#18aaff;
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;
`
const ForgetButton = styled(Button)`
`

class LoginPage extends Component {
    //  history = useHistory()

    formRef1 = createRef();
    formRef2 = createRef();
    formRef3 = createRef();

    constructor(props) {
        super(props)
        this.state = {
            // startRegister: false,
            // startVlidateMail: false
            pageStatus: 0,//0-default,1-register,2-send Mail Success


        }

    }
    componentDidMount(){
        this.formRef1.current.setFieldsValue({
            form1Email: "admin@test.com",
            form1Password:"123456"
      })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.location.key !== this.props.location.key) {
            // this.setState({
            //     startRegister: false,
            // });
            // this.formRef1.current.setFieldsValue({
            //     form1Email: "",
            //     form1Password: ""
            // })
            window.location.reload()
        }
    }
    // formRef1 = React.createRef();
    // formRef2 = React.createRef();


    shiftToRegisterClick() {
        this.setState({
            pageStatus: 1
        });

    }
    handleOnClickForgetButton(){
        this.setState({
            pageStatus: 3
        });
    }
    validateMessages = {
        required: '${label} is required!',
        types: {
            email: '请输入正确的邮箱格式！',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.formRef2.current
        if (value && value !== getFieldValue('password1')) {
            return Promise.reject("两次输入的密码不一致");
        }

        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        return Promise.resolve();

    }
    clickRegister() {

    }

    onLogin = (values) => {
        console.log('Success:', values);
        Request.post("/api/login", { "userEmail": values.form1Email, "password": values.form1Password }).then((res) => {
            if (res.data.resCode == 0) {
                var token = res.data.resMessage;
                var storage = window.localStorage;
                storage.setItem("token", token);
                let { history } = this.props;
                // history.replace({pathname:`/`})
                // history.push({ pathname: "/empty" });
                // history.push({ pathname: "/" });
                window.location.reload();
                // history.go(0);
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
    };
    onRegister = (values) => {
        console.log('Success:', values);
        Request.post("/api/register", { "userEmail": values.form2Email, "password": values.password1 }).then((res) => {
            if (res.data.resCode == 0) {
                this.setState({
                    pageStatus: 2
                })
            }
        });
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    onResetPassword = (values) => {
        Request.post("/api/user/resetPasswordSendMail", { "email": values.form3Email }).then((res) => {
            if (res.data.resCode == 0) {
                this.setState({
                    pageStatus: 4
                })
            }else {
                message.error("Reset mail has been failed!")
            }
        });
    };
    renderMainPage() {
        const { pageStatus } = this.state;
        if (pageStatus === 0) {
            return (
                <>
                    <Form ref={this.formRef1}


                        onFinish={this.onLogin}
                        onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item name="form1Email" rules={[{ required: true, message: "Please input email!" }, { type: 'email', message: 'Please input the email format!' }]}>

                            <InputCss placeholder="Email" />

                        </Form.Item>
                        <Form.Item name="form1Password" rules={[{ required: true, message: "Please input password!" }, { min: 6, message: 'The length of the password at least 6!', }]}>

                            <InputPsswordCss
                                placeholder="Password" autoComplete="new-password"
                            />
                        </Form.Item>


                        <Row align="top">
                            <Col offset={20}>
                                <ForgetButton type="link" onClick={()=>this.handleOnClickForgetButton()}>Forget Password</ForgetButton>
                            </Col>
                        </Row>
                        <Form.Item>
                            <LoginButton type="primary" block htmlType="submit">Sign In</LoginButton>
                        </Form.Item>
                    </Form>

                    <RegisterButton type="primary" block onClick={() => this.shiftToRegisterClick()}>Sign On</RegisterButton>
                </>
            );

        }
        if (pageStatus == 1) {
            return (<>
                <Form onFinish={this.onRegister}
                    onFinishFailed={this.onFinishFailed} ref={this.formRef2}
                    autoComplete="off">

                    <Form.Item
                        name="nickName"
                        rules={[{ required: true, message: "Please input nickName!" }, { min: 3, message: 'The length of the nickName is at least 3!', },]}
                    >
                        <InputCss
                            placeholder="nickName" autoComplete="new-password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="form2Email" rules={[{ required: true, message: "Please input email!" }, { type: 'email', message: 'Please input the email format!' }]}>

                        <InputCss placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password1"
                        rules={[{ required: true, message: "Please input password" }, { min: 6, message: 'The length of the password is at least 6!', }]}>
                        <InputPsswordCss
                            placeholder="Password" autoComplete="new-password"
                        />

                    </Form.Item>


                    <Form.Item>
                        <RegisterButton type="primary" block htmlType="submit">Sign On</RegisterButton>
                    </Form.Item>
                </Form>

            </>);
        }
        if (pageStatus === 2) {
            return (<Result
                status="success"
                title="Successfully Register!Please Validate Your Email!"

            />);
        }
        if (pageStatus === 3) {
            return (<>
                <Form onFinish={this.onResetPassword}
                    onFinishFailed={this.onFinishFailed} ref={this.formRef3}
                    autoComplete="off">
                    <Form.Item
                        name="form3Email" rules={[{ required: true, message: "Please input email!" }, { type: 'email', message: 'Please input the email format!' }]}>

                        <InputCss placeholder="Email" />
                    </Form.Item>

                    <Form.Item>
                        <RegisterButton type="primary" block htmlType="submit">Reset  Password</RegisterButton>
                    </Form.Item>
                </Form>

            </>);
        }
        if (pageStatus === 4) {
            return (<Result
                status="success"
                title="Successfully Reset password!Please Validate Your Email!"

            />);
        }
    }

    render() {
        const mainPage=this.renderMainPage();

        return (
            <>
                <Row align="middle" type="flex" justify="center">
                    <Col span={8}></Col>
                    <Col span={8}>
                        <MainDiv>
                            {
                                mainPage
                            }

                        </MainDiv>

                    </Col>
                    <Col span={8}></Col>
                </Row>
            </>
        )
    }
}
export default LoginPage;