import { React, Component, createRef } from 'react'
import { Button, Input, Row, Col, Card, Modal, Form } from 'antd';

import styled from 'styled-components'
import Request from '../utils/axiosUtils'
//注册ToolbarEmoji，将在工具栏出现emoji；注册TextAreaEmoji，将在文本输入框处出现emoji。VideoBlot是我自定义的视频组件，后面会讲，
import UploadComponent from "./uploadComponent"
const MainDiv = styled(Card)`
 height:100%;
`;
const InputDiv = styled.div`
height:10%;
`;
const ButtonRow = styled(Row)`
background:grey;
`
const EditRow = styled(Row)`
margin-top:9px;
`
const PostRow = EditRow

const LoginButton = styled(Button)`
min-height:50px;
border-radius: 15px;
margin-top:10px;
font-weight: 600;
    font-size: 17px;

`
const EditButtonDiv = styled(Button)`

    color:white;

`
const PostButton = styled(Button)`

border-radius: 5px;
font-size: 20px;
    padding-bottom: 0px;
    padding-top: 0px;
    font-weight: 700;
`
const InputCss = styled(Input)`

        min-height:50px;
        border-radius: 15px;
        margin-top:20px;
`
export default class EditPage extends Component {
    formRef1 = createRef();

    constructor(props) {
        super(props);
        this.reactQuillRef = null;
        this.state = {
            textValue: '',
            uploadModelVisible: false,
            insertTitleModelVisible: false,
            editorFocusIndex: 0,
            titleValue: "",
            postId: "",
        };

    }

    componentDidMount() {
        Request.get("/api/post/createFirstDraft").then(res => {
            if (res.data.resCode == 0) {
                this.setState({
                    postId: res.data.resMessage
                });
            }
        });
    }
    onChange(value) {
        this.setState({
            textValue: value
        })
        console.log(value)
    }
    modules = {
        toolbar: "",
    }
    // clickUpload() {
    //     const url = "https://imgsa.baidu.com/forum/w%3D580/sign=05c06c5ba1efce1bea2bc8c29f50f3e8/9d835ced2e738bd426339d9ca78b87d6267ff9c0.jpg";
    //     const quill = this.reactQuillRef.getEditor()
    //     var range = quill.getSelection();
    //     let index = range ? range.index : 0;
    //     quill.insertEmbed(index, "image", url, Quill.sources.USER);//插入图片
    //     quill.setSelection(index + 1);//光标位置加1 
    //     console.log("quill.getSelection.======", quill.getSelection().index)
    // }
    clickUploadPic() {
        console.log("aaaa")
        // Request.get("/api/test");
        this.setState({
            uploadModelVisible: true
        })

    }
    clickInsertTitleButton(e) {
        console.log(e);
        e.preventDefault();
        this.setState({
            insertTitleModelVisible: true
        })
    }


    onInsertSubtitleSubmit = (values) => {
        // values.preventDefault();  // 这样就好了
        const subTitle = values.form1Subtitle;
        const quill = this.reactQuillRef.getEditor()
        // var range = quill.getSelection(false);

        let index = this.state.editorFocusIndex;
        console.log("index:" + index);
        if (index != 0) {
            index = index + 1;
        }
       
        this.formRef1.current.resetFields();
        this.setState({
            insertTitleModelVisible: false
        }, () => {
            setTimeout(() => {
                console.log("blue")
                quill.enable(true);
                quill.focus();
            }, 300);

        });
    };
    handleOk = () => {
        this.setState({ uploadModelVisible: true });
    };

    handleCancel = () => {
        this.setState({ uploadModelVisible: false });
    };
    handleInsertTitleOk = () => {
        this.setState({ insertTitleModelVisible: true });
    };

    handleInsertTitleCancel = () => {
        this.setState({ insertTitleModelVisible: false });
    };
    // clickInsertSecondTitle() {
    //     const quill = this.reactQuillRef.getEditor()
    //     var range = quill.getSelection();
    //     let index = range ? range.index : 0;
    //     quill.insertEmbed(index, "header", "", Quill.sources.USER);//插入图片
    //     // var del=quill.insertText(index, "lsk123");
    //     // del.insert('sdadadadadad', { header: 1 })

    //     quill.setSelection(index);//光标位置加1 
    //     quill.insertText(index, "header is here", Quill.sources.USER);//插入图片
    //     console.log("quill.getSelection.======", quill.getSelection().index)
    // }
    insertPicUrlFunc(picUrl) {
        console.log(picUrl);
        const quill = this.reactQuillRef.getEditor()

        var range = quill.getSelection();
        let index = range ? range.index : 0;
        console.log("index:" + index);

      
        console.log("quill.getSelection.======", quill.getSelection().index)



    }
    handleChangeSelection(e) {
        if (e != null) {
            this.setState({
                editorFocusIndex: e.index
            })

        }
    }

    handlePostButtonClick() {
        const { titleValue, textValue } = this.state;
        var data = {
            postTitle: titleValue,
            postContent: textValue,
            postId: this.state.postId
        };
        Request.post("/api/post/updatePost", data).then(res => {
            console.log(res);
            if (res.data.resCode == 0) {


            }

        });
    }
    handleTitleInputOnchange(e) {
        console.log(e.target.value);
        this.setState({
            titleValue: e.target.value
        });
    }
    render() {
        const { insertTitleModelVisible, uploadModelVisible } = this.state;

        return (
            <>
                <MainDiv>
                    <Row>
                        <Col span={6}></Col>
                        <Col span={12}>
                            <InputDiv>
                                <Input placeholder="Cooking Title" size="large" onChange={(e) => this.handleTitleInputOnchange(e)} />
                            </InputDiv>
                        </Col>
                    </Row>

                    <EditRow>
                        <Col span={12} offset={6}>
                            <ButtonRow>
                                <Col >
                                    <EditButtonDiv onClick={() => this.clickUploadPic()} type="link" >Insert Picture</EditButtonDiv>
                                </Col>
                                <Col >
                                    <EditButtonDiv onClick={(e) => this.clickInsertTitleButton(e)} type="link" >Insert Title</EditButtonDiv>
                                </Col>
                            </ButtonRow>
                           
                            <PostRow>
                                <Col span={3} offset={21}>
                                    <PostButton onClick={() => this.handlePostButtonClick()} type="primary" block size="large">Save</PostButton>
                                </Col>
                            </PostRow>
                        </Col>
                    </EditRow>
                    <Modal visible={uploadModelVisible} onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <UploadComponent insertPicUrlFunc={this.insertPicUrlFunc.bind(this)} postId={this.state.postId} />
                    </Modal>

                    <Modal visible={insertTitleModelVisible} onOk={this.handleInsertTitleOk}
                        onCancel={this.handleInsertTitleCancel}
                        footer={null}

                    >
                        <Form ref={this.formRef1}
                            onFinish={this.onInsertSubtitleSubmit}
                            layout="vertical"
                            autoComplete="false"
                        >
                            <Form.Item name="form1Subtitle" rules={[{ required: true, message: "Please input subtitle!" }]} label="Input Subtitle">
                                <InputCss placeholder="Subtitle" />
                            </Form.Item>
                            <Form.Item>
                                <LoginButton type="primary" block htmlType="submit">Insert Title</LoginButton>
                            </Form.Item>
                        </Form>
                    </Modal>
                </MainDiv>
            </>
        );
    }
}
