import  React,  { useState }from 'react';
import useLocalStorage from "use-local-storage";
import StartupPage from "./component/startupPage"
import './App.css';
import router from './component/routerMap'
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
function App(props) {

  const [hasLogin, setHasLogin] = useState(true)
  const [host, setHost] = useLocalStorage("host",undefined);

  // let { history } = props;
  // history.push('/listenerlist');

  const getKey=()=>{
    return CommonUtils.guid();
  }
  const handleResetButtonOnClick=()=>{
    localStorage.clear();
    window.location.reload();
  }
  const dashboardPage=()=>{
    return  ( 
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
              <ColCss span={2} offset={12}>
                <Link  onClick={handleResetButtonOnClick}>
                  <h4>Reset Dashboard</h4>
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
                      !item.auth ? (< item.component {...props} key={getKey}/>) :
                        (hasLogin ? <item.component {...props}  key={getKey}/> : <div/>)
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
  const mainPage=()=>{
    if(host){
      return dashboardPage();
    }else{
      return <StartupPage/>;
    }
    
  }
  return (<>
    {
      
      mainPage()
    }
    </>
  );
}

export default App;
