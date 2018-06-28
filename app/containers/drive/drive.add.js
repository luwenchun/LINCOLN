/**
 *新建试驾单
 */

import React from 'react';
//import Layout from '../../components/Layout';
import Http from '../../utils/http';
//import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import addSheet from './style/drive.add.scss';
const title = '新建试驾单';

const apis = [
  {"id":"driverInfo","url":"dealer/api/v1/driverInfo"},
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);


class DriveAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailInfo:{

      }
    };
  }

  componentDidMount() {
  
  }


  btnAction(_name){
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

 
  render() {
    const that = this;
    function getData(){
      Http.get('driverInfo',function(data){
        that.state['detailInfo'] = Object.assign({},data);
      })
    }
   
    return (
      <div className={addSheet.wrap}>
            <div className={addSheet['form']}>
            <div className={addSheet['header']}>
              <span>{this.state.detailInfo['applyTime']}</span>
              <span className={addSheet['status']}>{this.state.detailInfo['statusName']}</span>
            
            </div>
          <div className={addSheet['content']}>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>NO：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['driveId']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>试驾车型：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['carCode']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>试驾地址：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['address']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>预约人：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['userName']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>联系电话：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['userPhone']}</div>
              <div className={addSheet['toolbox']}>
                <button type="button" className={addSheet['btn-primary']} onClick={this.btnAction.bind(this,'detail')}>详情</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }
 
}



export default DriveAdd;
