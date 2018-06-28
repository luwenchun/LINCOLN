/**
 * 试驾预约评价列表
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import Helper from '../../utils/helper';
import './style/drive.feedback.scss';
import {SERVER_BASE_PATH} from '../../global.config';

const apis = [
  { "id": "driveFdList", "url": "/dealer/api/v1/evaluationResult", format: false }
];

Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

class CDriveFeedbackList extends React.Component {
  constructor(props) {
    super(props);

    let params = Helper.getUrlParams();
    this.state = {
      list: [],
      driveId: params['id'] || '',
      driveType: decodeURIComponent(params['type']) || ''
    };

    Http.get('driveFdList', {"driveId": this.state.driveId}, (res) => {
      if (res && Array.isArray(res.data)) { 
         this.setState({
            list: res.data
         });
      }
    });
  }

  componentDidMount() {

  }

  render() {
    const list = this.state.list;
    const title = '试驾预约评价';
    const rank = function(v) {
       let items = [], i;

       if (v.evaluationType === 1) {
          for (i = 0; i < v.evaluationResult; i++) {
              items.push(<a href="#" className={'score'}></a>);
          }
       } else {
          items = v.evaluationResult;
       }

       return (
          <span className={'view-result'}>
             {items}
          </span>  
       );
    }

    return (
      <div className={'cdrive-feedback-list'}>
          <Helmet>
             <title>{title}</title>
             <meta name="description" content="{title}" />
          </Helmet>
          <ul className={"mui-table-view mui-table-view-striped mui-table-view-condensed"}>
            <li className={"mui-table-view-cell"}>
                <div className={"mui-table"}>
                    <div className={"mui-table-cell mui-col-xs-8"}>
                        <h4 className={"mui-ellipsis"}>NO: {this.state.driveId}</h4>
                        <h5>试驾车型：{this.state.driveType}</h5>
                    </div>
                </div>
            </li>
            <li className={"mui-table-view-cell"}>
              {
                 list.map((v, i) => {
                    return (
                      <p><strong>{v.evaluationItem}</strong>：{rank(v)}</p>
                    );
                 })
              }
            </li>
          </ul>  
      </div>
    );
  }

}

export default CDriveFeedbackList;
