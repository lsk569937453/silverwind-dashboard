import { React, Component } from 'react'
import { Row, Col, List, Card, Button, Avatar } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faThumbsUp as fathumbsHasUped} from '@fortawesome/free-solid-svg-icons'
import {faThumbsUp}from '@fortawesome/free-regular-svg-icons'


const CardDiv = styled(Card)`
 
    font-size: 1.2em;
    text-align: center;
    border-radius: 20px;
    margin-top:10px;
    background-color:whitesmoke;
    .ant-card-body{
        padding:0px;
    }
    
`;
const RowDiv = styled.div`
    margin-top:10px;
    margin-bottom:10px;
`;
export default class FilmItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false
        }
    }

    thumbsUpClicked(){
        this.setState({
            display:!this.state.display
        });

    };
    render() {
        return (
            <CardDiv>
               
                <Col>
                    <RowDiv>
                        <Row>
                            <Col span='8' offset={2}>
                                <Row type="flex" justify="center" align="middle">
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    <span>猜猜我是谁</span>
                                </Row>
                            </Col>

                            <Col span='8'>
                                <Row type="flex" justify="center" align="middle">
                                    <Col span="12">
                                    <Button type="link" icon={<EditOutlined />} ></Button>
                                    </Col>
                                    <Col span="12">
                                    {
                                        this.state.display?                                    <Button type="link" icon={<FontAwesomeIcon icon={fathumbsHasUped} />} onClick={()=>this.thumbsUpClicked()} ></Button>
                                        :                                    <Button type="link" icon={<FontAwesomeIcon icon={faThumbsUp} />} onClick={()=>this.thumbsUpClicked()} ></Button>
                                    }
                                    </Col>
                                </Row>
                                

                            </Col>
                        </Row>
                    </RowDiv>

                </Col>
            </CardDiv>
        );

    }

}