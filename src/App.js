import logo from './logo.svg';
import { React, Component } from 'react';
import LoginPage from './component/login'

import './App.css';
import Home from './component/home'
import HomeNew from './component/homeNew'
import Topics from './component/topics'
import EditPage from './component/editPage'
import router from './component/routerMap'
import Request from './utils/axiosUtils'
import CommonUtils from "./utils/commonUtils";
import { Button, Row, Col, Affix } from 'antd';
import {
  HashRouter  as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import PropTypes from "prop-types";

import styled from 'styled-components'

const MainDiv = styled.div`
height:95%;
`;
const MenuDiv = styled.div`
background:rgba(0,0,0,0.8);
/* color: #fff; */
padding-top:15px;
padding-bottom:15px;
h4{ 
  font-family:'Microsoft YaHei';
  color:#f5f5f7;
}
`;
const ColCss = styled(Col)`
text-align:left;
`
class App extends Component {


  constructor(props) {
    super(props);
    this.state = ({
      hasLogin: true,
      userMail: ""
    })

  }

  componentWillMount() {
    var storage = window.localStorage;
    var token = storage.getItem("token");
    console.log(token);
    if (token === undefined) {
      this.setState({
        hasLogin: false
      });
    }
    Request.get("api/checkStatus").then(res => {
      if (res.data.resCode == 0) {
        this.setState({
          userMail: res.data.resMessage
        });
      } else {
        this.setState({
          hasLogin: false
        });
      }
    }).catch((e)=>{
      this.setState({
        hasLogin: false
      });
    });
  }

  getKey(){
    return CommonUtils.guid();
  }
  render() {
    const { hasLogin, userMail } = this.state;
    console.log("haslogin:"+hasLogin);
    return (
      <Router>
        <MainDiv>
          <MenuDiv align="middle" type="flex" justify="center">
            <Row>
              
              <ColCss span={2} offset={4}>
                <Link to="/dashboard">
                  <h4>Silver-Dashboard</h4>
                </Link>
              </ColCss>
              <ColCss span={2} >
                <Link to="/httpPage">
                  <h4>HTTP</h4>
                </Link>
              </ColCss>
              <ColCss span={2} >
                <Link to="/">
                  <h4>TCP</h4>
                </Link>
              </ColCss>

            
            </Row>
          </MenuDiv>
          <Switch>
            {
              router.map((item, key) => {
                return (
                  <Route key={key} path={item.path} exact render={
                    props => (
                      !item.auth ? (< item.component {...props} key={this.getKey}/>) :
                        (hasLogin ? <item.component {...props}  key={this.getKey}/> : <LoginPage {...props} />)
                    )
                  } />
                )
              })
            }
          </Switch>
        </MainDiv>
      </Router>
    );
  }
}

export default App;
