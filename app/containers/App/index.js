
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
// import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import DriveList from 'containers/drive/drive.list';
import DriveDetail from 'containers/drive/drive.detail';
import DriveAdd from 'containers/drive/drive.add';
import Complete from 'containers/drive/complete';

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
import Drivepc from 'containers/drivepc/sublist';
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
        <Route path="/wchat/drive" component={DriveList} />
        <Route path="/wchat/driveDetail" component={DriveDetail} />
        <Route path="/wchat/driveAdd" component={DriveAdd} />
        <Route path="/wchat/complete" component={Complete} />

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
        <Route path="/saicui/drivepc" component={Drivepc}  alt='预约列表'/>


        <Route exact path="/" component={NotFoundPage} />
        <Route path="" component={NotFoundPage} />
      </Switch>

    </AppWrapper>
  );
}
