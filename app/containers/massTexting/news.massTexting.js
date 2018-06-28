/**
 *咨询管理-发布新闻页面
 */

import React from 'react';
import Http from '../../utils/http';
import PropTypes from 'prop-types';
import NewsEdit from './components/massTexting';
import history from '../../utils/history';
import './style/news.edit.scss';
import DMCUtil from '../../utils/DMCUtil'
import {SERVER_BASE_PATH} from '../../global.config';
import {
  Form, Select, InputNumber, Switch, Radio, DatePicker,
  Slider, Button, Upload, Icon, Rate, Input, Checkbox,
  Row, Col, Modal,
} from 'antd';
import RichText from '../../components/RichText/RichText';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

const title = '群发';
let uuid = 0;
const apis = [
  {"id":"activityDetail","url":"community/activity/detail"},
];

const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

const activityDto = {
            "content": "",
            "contentType": 1,
            "endDate": "",
            "labelId": 0,
            "labelName": "",
            "newsSummary": "",
            "newsUrl": "",
            "previewPhone": "",
            "startDate": "",
            "status": 0,
            "thirdPartLink": "",
            "title": "",
            "titleImage": ""
}

class NewsEditPage extends React.Component {
  constructor(props) {
      super(props);
     
      //1001:抢购活动,1002:报名活动,1003:普通活动
      this.state = {
        formFieldValues:{...activityDto},
      }
  
    };


    componentDidMount() {
     this.setState({
      formFieldValues:{...this.state.formFieldValues,...{id:null}}
     })
    }

 
  render() {
    const { state } = this
    const { formFieldValues } = state

      return (
        <div className='wrap' style={{'padding':'12px'}}>
          <NewsEdit formFieldValues={formFieldValues} />
        </div>
      );
    };
 
}
const NewsEditPageWithForm = Form.create()(NewsEditPage);
// const NewsEditComp=withStyles(s)(NewsEditPageWithForm);

// function action({ path, query, hash, Authorization }) {

//   const currentAuthorization = DMCUtil.getCurrent(Authorization)
//   return {
//     chunks: ['news.editManu'],
//     title,
//     component: (
//       <Layout hide={true}>
//         <NewsEditComp currentAuthorization={currentAuthorization} />
//       </Layout>
//     ),
//   };
// }

export default NewsEditPageWithForm;
