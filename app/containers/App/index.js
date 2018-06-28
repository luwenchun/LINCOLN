
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';
import DriveList from 'containers/drive/drive.list';
import DriveDetail from 'containers/drive/drive.detail';
import DriveAdd from 'containers/drive/drive.add';
import Complete from 'containers/drive/complete';

import CDriveAdd from 'containers/cdrive/drive.add';
import CDriveMap from 'containers/cdrive/drive.map';
import CDriveSearch from 'containers/cdrive/drive.search';
import CDriveList from 'containers/cdrive/drive.list';
import CDriveDetail from 'containers/cdrive/drive.detail';
import CDriveFeedback from 'containers/cdrive/drive.feedback';
import CDriveRegister from 'containers/cdrive/drive.register';
import CDriveFeedbackList from 'containers/cdrive/drive.feedback.list';

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

// const visible = location.host === 'localhost:3000';
const visible = false;

export default function App() {
  // export default class App extends React.Component {
  // render() {
  return (
    // <AppWrapper history={this.props.history}>
    <AppWrapper>
      <Helmet
        titleTemplate="%s"
        defaultTitle="后台"
      >
        <meta name="description" content="后台" />
      </Helmet>
      {/* <Header /> */}
      {visible
        ? <Sidebar history={this.props.history} />
        : ""}

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/wchat/drive" component={DriveList} />
        <Route path="/wchat/driveDetail" component={DriveDetail} />
        <Route path="/wchat/driveAdd" component={DriveAdd} />
        <Route path="/wchat/complete" component={Complete} />

        
        <Route path="/wchat/cdriveAdd" component={CDriveAdd} />
        <Route path="/wchat/cdriveMap" component={CDriveMap} />
        <Route path="/wchat/cdriveList" component={CDriveList} />
        <Route path="/wchat/cdriveDetail" component={CDriveDetail} />
        <Route path="/wchat/cdriveFeeback" component={CDriveFeedback} />
        <Route path="/wchat/cdriveRegister" component={CDriveRegister} />
        <Route path="/wchat/cdriveFeedbackList" component={CDriveFeedbackList} />
        <Route path="" component={NotFoundPage} />
      </Switch>

      {/* <Footer /> */}
    </AppWrapper>
  );
  // }
}
