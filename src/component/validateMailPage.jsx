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
class ValidateMailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasValidMail: false,
            validateStatus:-1,
        };

    }

    componentWillMount() {
        const query = this.props.location.search // '?mailToken=e336f149-f542-4f47-88c1-2403735332d2'
        const mailToken = query.substr("?mailToken=".length, query.length) // '1'
        console.log(mailToken);

        var data={
            "emailToken":mailToken
        }
        Request.post("/api/validateEmail",data).then(res => {
            this.setState({
                hasValidMail: true
            });
            if (res.data.resCode == 0) {
                this.setState({
                    validateStatus: 0
                });
            }else{
                this.setState({
                    validateStatus: -1
                });
            }
        });
    }


    clickToEdit() {
        let { history } = this.props;
        // history.push({pathname: '/editPage'})
        history.push({ pathname: '/postDetailPage' })

    }

    generateRow(hasValidMail,validateStatus){
        if(!hasValidMail)
        return (<></>);
        if(validateStatus===-1)
        return (<Result
                            status="error"
                            title="Validate Error!"
                        />);
        return  (<Result
            status="success"
            title="Validate Success!"
        />);

    }
    render() {
        const { hasValidMail,validateStatus } = this.state;
        const validateStatusDiv=this.generateRow(hasValidMail,validateStatus);
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
export default withRouter(ValidateMailPage);