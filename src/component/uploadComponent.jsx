
import { React, Component } from 'react'
import { Button, Upload, Col, Card, Row, Divider, Image, Icon } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Request from '../utils/axiosUtils'
import {
    HomeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    DoubleRightOutlined,
} from '@ant-design/icons';
import styled from 'styled-components'
const CheckCircleOutlinedDiv = styled(CheckCircleOutlined)`
  font-size: 25px;
  color: green
 `;
const CloseCircleOutlinedDiv = styled(CloseCircleOutlined)`
 font-size: 25px;
 color: red
`;
const SyncOutlinedDiv = styled(SyncOutlined)`
font-size: 25px;
color: blue
`;
const CardDiv = styled(Card)`
border-radius:25px;
margin-top:10px;
background:#efecec;
.ant-card-body{
    border-radius:25px;
    padding: 0px;

}
`;
export default class UploadComponent extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            fileList: [
                //   {
                //     uid: '-1',
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'http://www.baidu.com/xxx.png',
                //   },
            ],
        })

    }


    handleChange = info => {
        console.log(info)
        let fileList = this.state.fileList.concat(info.fileList)

        let hash = {}
        fileList = fileList.reduce((item, next) => {
            if (!hash[next.uid]) {
                hash[next.uid] = true
                item.push(next)
            }
            return item
        }, [])


        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        // fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        this.setState({ fileList: fileList });
    };

    customRequest(data) {
        const formData = new FormData();
        formData.append("pic", data.file);
        formData.append("postId", this.props.postId);
        Request.post("/api/upload/uploadPic", formData).then(res => {
            console.log(res);
            if (res.data.resCode == 0) {
                const files = this.state.fileList;
                files.map(file => {
                    if (file.uid === data.file.uid) {
                        file.status = 'done'
                        file.url = res.data.resMessage
                    }
                });
                this.setState({
                    fileList: files
                })
            } else {
                const files = this.state.fileList;
                files.map(file => {
                    if (file.uid === data.file.uid) {
                        file.status = 'error'
                    }
                });
                this.setState({
                    fileList: files
                })
            }
            //   this.fileList.push({
            //     uid: res.data, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            //     name: data.file.name, // 文件名
            //     status: "done", // 状态有：uploading done error removed
            //     response: res // 服务端响应内容
            //   });
        }).catch((e)=>{
            const files = this.state.fileList;
            files.map(file => {
                if (file.uid === data.file.uid) {
                    file.status = 'error'
                }
            });
            this.setState({
                fileList: files
            })
        });
    }
    insertPictureButtonClick(picUrl) {
        this.props.insertPicUrlFunc(picUrl)//这个地方把值传递给了props的事件当中


    }
    generateImageList(item, that) {
        console.log("status" + item);
        var srcUrl = item.url;
        if (srcUrl === undefined)
            srcUrl = "error"
        let stateIcon = null;
        let isDisabled = true;

        if (item.status === undefined || item.status == "uploading") {
            stateIcon = <SyncOutlinedDiv spin />;
        } else if (item.status == "error") {
            stateIcon = <CloseCircleOutlinedDiv />;
        } else {
            isDisabled = false;
            stateIcon = <CheckCircleOutlinedDiv />;
        }
        return (
            <Col span={24} key={item.uid}>
                <CardDiv>
                    <Row justify="center" align="middle" type="flex" >
                        <Col span={8} offset={2}>
                            <Image width={100}
                                height={100}
                                fallback="data:image/png;base64,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"
                                src={srcUrl}></Image>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>

                            {stateIcon}

                        </Col>
                        <Col span={8}>
                            <Button type="primary" icon={<DoubleRightOutlined />} disabled={isDisabled} onClick={() => that.insertPictureButtonClick(srcUrl)}>
                                Insert Picture
                            </Button>
                        </Col>
                    </Row>
                </CardDiv>
            </Col>)
            ;
    }


    render() {
        const props = {
            // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            customRequest: this.customRequest.bind(this),
            onChange: this.handleChange,
            multiple: true,
        };
        var that = this;
        const listItem = this.state.fileList.map((item) => this.generateImageList(item, that));

        return (
            <>

                <Upload  {...props}
                    accept=".jpeg,.jpg,.png,.gif,.bmp"
                    fileList={[]}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Divider></Divider>
                <Row>
                    {listItem}
                </Row>


            </>
        );
    }
}

