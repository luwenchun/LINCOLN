/**
 *试驾已反馈
 */

import React from 'react';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import canSheet from './style/drive.cancel.scss';
const title = '试驾已取消';

const apis = [
  {"id":"driverInfo","url":"dealer/api/v1/driverInfo"},
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);


class DriveCancel extends React.Component {
  constructor(props) {
    super(props);

    const userInfo = Object.assign({},props['user']);

    this.state = {
      driveId:'',
      driverInfo:{

      }
    };

    this.state.driveId = userInfo['driveId'];

  }

  componentDidMount() {
    const that = this;

    Http.get('driverInfo',{driveId:this.state.driveId},function(data){

      that.setState({
        driverInfo:data
      })

    })
  }


  btnAction(_name){
    const userId = this.props['user']['userId'];
    const mobile = this.props['user']['mobile'];
    window.location.href = '/wx/ent/drive?userid='+userId+'&mobile='+mobile;
  }

 
  render() {
    const that = this;
    const info = this.state.driverInfo;
   
    return (
      <div className={canSheet.wrap}>
            <div className={canSheet['form']}>
          
          <div className={canSheet['content']}>

            

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>NO：</div>
              <div className={canSheet['rc']}><span style={{float:'right'}}>{info['driveId']}</span></div>
            </div>
            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>预约状态：</div>
              <div className={canSheet['rc']}><span style={{float:'right',color:'red'}}>{info['statusName']}</span></div>
            </div>

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>预约时间：</div>
              <div className={canSheet['rc']}>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</div>
            </div>

           
            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>试驾车型：</div>
              <div className={canSheet['rc']}>{(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}</div>
            </div>     

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>试驾地址：</div>
              <div className={canSheet['rc']}>{(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}</div>
            </div>                   

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>预约人：</div>
              <div className={canSheet['rc']}>{info['userName']+' , '+(info['sex']?info['sex']:'女士')}</div>
            </div>

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>联系电话：</div>
              <div className={canSheet['rc']}><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={canSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></div>
            </div>


            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>标签：</div>
              <div className={canSheet['rc']}>{info['tagsName']?info['tagsName']:''}</div>
            </div>



            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>备注：</div>
              <div className={canSheet['rc']}>{info['remark']}</div>
            </div>

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>车辆：</div>
              <div className={canSheet['rc']}>{info['carCode']?info['carCode']:''}{info['licenseNo']&&info['carCode']?' - ':''}{info['licenseNo']?info['licenseNo']:''}</div>
            </div>

            <div className={canSheet['row']}>
              <div className={canSheet['rt']}>鉴赏工程师：</div>
              <div className={canSheet['rc']}>{info['appreciationEngineerName']}</div>
            </div>

            <div className={canSheet['row']}>
            <div className={canSheet['toolbox']}>
                <button type="button" className={canSheet['btn-primary']} onClick={this.btnAction.bind(this,'detail')}>返回</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }
 
}

const DriveCancelComp = withStyles(canSheet)(DriveCancel);

function action({path, query, hash}) {
  const userInfo = query;
  return {
    chunks: ['drive.cancel'],
    title,
    component: (
      <Layout  hide={true}>
        <DriveCancelComp user={userInfo} />
      </Layout>
    ),
  };
}

export default action;
