/**
 * 我的试驾预约列表
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style/drive.list.scss';
import '../../components/mui/css/mui.min.scss';
import Http from '../../utils/http';
import {SERVER_BASE_PATH} from '../../global.config';
import $ from 'jquery';
import Helper from '../../utils/helper';


const apis = [
  { "id": "driveList", "url": "/dealer/api/v1/userDriveList", format: false },
];

Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);
let data = [], _this;

class CDriveList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        dataSource: []
    };
    _this = this;
  }

  componentDidMount() {
      Http.get('driveList', {}, function(res) {
          if (res && Array.isArray(res.data)) {
              _this.setState({dataSource: res.data});
          }
      });

      $('.cdrive-list').on('click', 'li', function(e) {
         _this.linkTo(this);
      });
  }

  linkTo(o) { console.log(o)
      let id = o.getAttribute('data-id'),
          data = this.state.dataSource,
          len  = data.length, i, selected;

      for (i = 0; i < len; i++) {
          if (data[i].driveId == id) {
              selected = data[i];
              break;  
          }
      }

      if (selected) {
          //Helper.setData('drive_detail', JSON.stringify(selected));
          document.location.href = '/wchat/cdriveDetail?id=' + id;
      }
  }

  render() { 
      let list = this.state.dataSource;
      let listItems = list.map((v, i) => {
        let color = this.state.statusName == '待试驾' || this.state.statusName == '待确认' ? '#e46a6c' : '#8e8e8e';
        return (<li className={"mui-table-view-cell"} key={i} data-id={v.driveId}>
              <div className={"mui-table"}>
                  <div className={"mui-table-cell mui-col-xs-8"}>
                      <h4 className={"mui-ellipsis"}>NO: {v.driveId}</h4>
                      <h5>试驾车型：{v.carName}</h5>
                      <p className={"mui-h6 mui-ellipsis"}>试驾时间：{v.applyTime}</p>
                  </div>
                  <div className={"mui-table-cell mui-col-xs-3 mui-text-right"}>
                      <span className={"mui-h5"}>{v.typeName}</span>
                      <span className={"bottom-state st"} style={{'color': color}}>{v.statusName}</span>
                  </div>
              </div>
          </li>)
      });

      if (list.length <= 0) {
          listItems = <li className={"mui-table-view-cell no-data"}>没有查找到相关试驾预约记录</li>
      }
      const title = '我的试驾预约';
      return (
         <div className={"mui-content cdrive-list"}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content="{title}" />
            </Helmet>
            <ul className={"mui-table-view mui-table-view-striped mui-table-view-condensed"}>
               {listItems}
            </ul>  
         </div>
      );
  }

}

export default CDriveList;
