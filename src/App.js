import { React, Component } from 'react';

import './App.css';
import router from './component/routerMap'
import Request from './utils/axiosUtils'
import CommonUtils from "./utils/commonUtils";
import {  Row, Col } from 'antd';
import {
  HashRouter  as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

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

  // componentWillMount() {
  //   var storage = window.localStorage;
  //   var token = storage.getItem("token");
  //   console.log(token);
  //   if (token === undefined) {
  //     this.setState({
  //       hasLogin: false
  //     });
  //   }
  //   Request.get("api/checkStatus").then(res => {
  //     if (res.data.resCode ===0) {
  //       this.setState({
  //         userMail: res.data.resMessage
  //       });
  //     } else {
  //       this.setState({
  //         hasLogin: false
  //       });
  //     }
  //   }).catch((e)=>{
  //     this.setState({
  //       hasLogin: false
  //     });
  //   });
  // }

  getKey(){
    return CommonUtils.guid();
  }
  render() {
    const { hasLogin } = this.state;
    console.log("haslogin:"+hasLogin);
    return (
      <Router>
        <MainDiv>
          <MenuDiv align="middle" type="flex" justify="center">
            <Row>
              
              <ColCss span={2} offset={4}>
                <Link to="/">
                  <h4>SilverWind-Dashboard</h4>
                </Link>
              </ColCss>
              <ColCss span={2} offset={1} >
                <Link to="/listenerlist">
                  <h4>Listener List</h4>
                </Link>
              </ColCss>
              {/* <ColCss span={2} >
                <Link to="/">
                  <h4>TCP</h4>
                </Link>
              </ColCss> */}

            
            </Row>
          </MenuDiv>
          <Switch>
            {
              router.map((item, key) => {
                return (
                  <Route key={key} path={item.path} exact render={
                    props => (
                      !item.auth ? (< item.component {...props} key={this.getKey}/>) :
                        (hasLogin ? <item.component {...props}  key={this.getKey}/> : <div/>)
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
