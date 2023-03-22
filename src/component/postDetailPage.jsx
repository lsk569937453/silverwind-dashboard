import { React, Component } from 'react'
import { Row, Col, List, Card, Divider, Button, Input, Image } from 'antd';
import FilmItem from './filmItem'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import Request from '../utils/axiosUtils'

import styled from 'styled-components'
const { TextArea } = Input;

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
const MainDiv = styled.div`
  background: #F8F8FF;

`

const ReviewRow = styled(Row)`
margin-top:20px;
`
const PublishButton = styled(Button)`
margin-top:10px;
border-radius:5px;
float:right;

`
const H2Div = styled.h2`
font-weight: bold;
`
const H1Div = styled.h1`
font-size:24px;
    font-weight:700;
    `
const CardReview = styled(Card)`
border-radius:10px;
`
const HeaderCard = styled(Card)`
margin-top:20px;
margin-bottom:20px;
border-radius:30px;

.ant-card-head-title{
    font-size:24px;
    font-weight:700;

}

`
export default class PostDetailPage extends Component {
    modules = {
        toolbar: "",
    }
    constructor(props) {
        super(props);
        this.state = ({
            post: [],
        })

    }

    componentWillMount() {
        console.log("asdadadas");
        Request.get("/api/post/getRandomList").then(res => {
            if (res.data.resCode == 0) {
                this.setState({
                    post: res.data.resMessage
                });
            }
        });
    }
    render() {
        console.log("asdadadas");

        const { post } = this.state;
        console.log(post);
        var post0 = post[0];
        const len = post.length;

        return (
            <>

                <MainDiv>
                    <Row>
                      
                        <Col span={12} offset={6}>
                            {len == 0 ? <Button /> :
                                <HeaderCard>
                                    <Row>
                                        <Col span={24}>
                                            <H1Div>{post0.postTitle}</H1Div>
                                        </Col>
                                        <Divider />
                                       
                                    </Row>
                                </HeaderCard>
                            }
                        </Col>
                    </Row>
                    <ReviewRow>
                        <Col span={20} offset={6}>
                            <H2Div>Review</H2Div>
                        </Col>
                        <Col span={12} offset={6}>
                            <CardReview>
                                <Row>
                                    <Col span={24}>
                                        <TextArea rows={4} />
                                    </Col>
                                    <Col span={4} offset={20} >
                                        <PublishButton type="primary">Publish</PublishButton>
                                    </Col>
                                </Row>
                            </CardReview>
                        </Col>

                        <Col span={4} />
                    </ReviewRow>
                </MainDiv>


            </>
        );
    }
}
