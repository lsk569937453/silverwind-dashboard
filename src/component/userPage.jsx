import { React, Component } from 'react'
import { Row, Col, List, Card, BackTop, Button, Carousel, Image,Result } from 'antd';
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
const LoginOutButton=styled(Button)`
  border-radius: 5px;
  margin-top:20px;

`
class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasValidMail: false,
            validateStatus:-1,
        };

    }

    componentWillMount() {
       
    }

    handleLoginOutClick(){
        var storage = window.localStorage;

        storage.removeItem("token");
        window.location.reload();

    }


    render() {
        return (
            <>
                <Row>
                    <Col span={12} offset={6}>
                    <LoginOutButton type="primary" block  danger size="large" onClick={()=>this.handleLoginOutClick()}>Sign Out</LoginOutButton>
                    </Col>
                </Row>
            </>
        );
    }
}
export default withRouter(UserPage);