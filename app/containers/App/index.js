
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route ,Link,NavLink} from 'react-router-dom';
// import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import DriveList from 'containers/drive/drive.list';
import DriveDetail from 'containers/drive/drive.detail';
import DriveAdd from 'containers/drive/drive.add';
import Complete from 'containers/drive/complete';
import DriveDoing from 'containers/drive/drive.doing';
import DriveDispatch from 'containers/drive/drive.dispatch';
import Resource from 'containers/drive/resource';
import DriveFeedback from 'containers/drive/drive.feedback';
import DriveConfirm from 'containers/drive/drive.confirm';
import DriveStartoff from 'containers/drive/drive.startoff';





import CDriveAdd from 'containers/cdrive/drive.add';
import CDriveMap from 'containers/cdrive/drive.map';
// import CDriveSearch from 'containers/cdrive/drive.search';
import CDriveList from 'containers/cdrive/drive.list';
import CDriveDetail from 'containers/cdrive/drive.detail';
import CDriveFeedback from 'containers/cdrive/drive.feedback';
import CDriveRegister from 'containers/cdrive/drive.register';
import CDriveFeedbackList from 'containers/cdrive/drive.feedback.list';

import Chat from 'containers/chat/Loadable';
// import News from 'containers/news/Loadable';
import Sublist from 'containers/drivepc/sublist';
import Subadd from 'containers/drivepc/subadd';
import Subdep from 'containers/drivepc/subdep';
import MaterialList from 'containers/materialList/Loadable';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  width: 100%;
  display: flex;
  min-height: 100%;
  // padding: 0 16px;
  flex-direction: column;
  >div:nth-of-type(2){ margin-left: 240px;}
`;


export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s"
        defaultTitle="LINCOLN"
      >
        <meta name="description" content="LINCOLN" />
      </Helmet>

      <Switch>
        
        {/* 微信公众平台 */}

        <Route path="/wchat/driveList" component={DriveList} />
        <Route path="/wchat/driveDetail" component={DriveDetail} />
        <Route path="/wchat/driveAdd" component={DriveAdd} />
        <Route path="/wchat/complete" component={Complete} />
        <Route path="/wchat/drivedispatch" component={DriveDispatch} />
        <Route path="/wchat/drivedoing" component={DriveDoing} />
        <Route path="/wchat/resource" component={Resource} />
        <Route path="/wchat/driveconfirm" component={DriveConfirm} />
        <Route path="/wchat/drivestartoff" component={DriveStartoff} />
        <Route path="/wchat/drivefeedback" component={DriveFeedback} />




        {/* 微信C端 */}
        <Route path="/wchat/cdriveAdd" component={CDriveAdd} />
        <Route path="/wchat/cdriveMap" component={CDriveMap} />
        <Route path="/wchat/cdriveList" component={CDriveList} />
        <Route path="/wchat/cdriveDetail" component={CDriveDetail} />
        <Route path="/wchat/cdriveFeeback" component={CDriveFeedback} />
        <Route path="/wchat/cdriveRegister" component={CDriveRegister} />
        <Route path="/wchat/cdriveFeedbackList" component={CDriveFeedbackList} />

        {/* PC后台 */}
        <Route path="/saicui/chat" component={Chat} alt='在线客服'/>
        <Route path="/saicui/materialList" component={MaterialList}  alt='图文素材管理'/>
        {/* <Route path="/saicui/news" component={News}  alt='资讯Demo'/> */}
        <Route path="/saicui/sublist" component={Sublist}  alt='预约列表'/>
        <Route path="/saicui/subadd" component={Subadd}  alt='预约新增'/>
        <Route path="/saicui/subdep" component={Subdep}  alt='预约配置'/>


        <Route exact path="/" component={NotFoundPage} />
        <Route path="" component={NotFoundPage} />
      </Switch>

    </AppWrapper>
  );
}
