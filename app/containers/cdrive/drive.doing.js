/**
 *试驾预约试驾中
 */

import React from 'react';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import doSheet from './style/drive.doing.scss';
const title = '试驾预约试驾中';

const apis = [
  {"id":"driverInfo","url":"dealer/api/v1/driverInfo"},
  {"id":"driveFinished","url":"dealer/api/v1/driveFinished"},
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);


class DriveDoing extends React.Component {
  constructor(props) {
   
    super(props);

    const userInfo = Object.assign({},this.props['user']);

    this.state = {
      userInfo:userInfo,
      params:{
        userId:'',
        mobile:'',
        carCode:''
      },
      driverInfo:{

      }
    };

    this.state['params']['userId'] = this.props['user']['userId'];
    this.state['params']['mobile'] = this.props['user']['mobile'];


  }


  btnAction(_driveId){

    
    const userId = this.state['userInfo']['userId'];
    const mobile = this.state['userInfo']['mobile'];
    const params = {
        userid:userId,
        mobile:mobile
    }

    console.log('试驾中点击完成试驾按钮触发传递参数=====',{driveId:_driveId,userId:userId})
    Http.get('driveFinished',{driveId:_driveId,userId:userId},(callback)=>{

      console.log('完成试驾按钮callback=====',this.state['userInfo']['userId']); 


      window.location.href = `/wx/ent/drive${Http.transGetParams(params)}`;
      
    })
   
  }


  componentDidMount(){
    
    const driverInfoParams = {
      driveId:this.state['userInfo']['driveId'],
      userId:this.state['userInfo']['userId']
    }
    Http.get('driverInfo',driverInfoParams,(callback)=>{

      console.log('试驾中试驾详情数据=====',callback);
      this.setState({
        driverInfo:Object.assign({},callback)
      })
      
    })

  }

 
  render() {
    const that = this;
    const info = this.state.driverInfo;
    return (
      <div className={doSheet.wrap}>
            <div className={doSheet['form']}>
          <div className={doSheet['content']}>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']} style={{width:'28%'}}>预约编号：</div>
              <div className={doSheet['rc']} style={{width:'60%'}}>{info['driveId']}</div>
              <div className={doSheet['st']}>试驾中</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>试驾车型：</div>
              <div className={doSheet['rc']}>{(info['carTypeName'] ? info['carTypeName'] : '')+(info['carTypeName']&&info['carName']?' , ':'')+(info['carName'] ? info['carName'] : '')}</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>预约时间：</div>
              <div className={doSheet['rc']}>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>试驾地址：</div>
              <div className={doSheet['rc']}>{(info['proviceName']?info['proviceName']:'')+(info['regionName']?info['regionName']:'')+(info['address']?info['address']:'')}</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>预约人：</div>
              <div className={doSheet['rc']}>{info['userName']+' , '+(info['appellation']?info['appellation']:'女士')}</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>联系电话：</div>
              <div className={doSheet['rc']}><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={doSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>标签：</div>
              <div className={doSheet['rc']}>{info['tagsName']?info['tagsName']:''}</div>
            </div>
            
            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>备注：</div>
              <div className={doSheet['rc']}>{info['remark']}</div>
            </div>

            <div className={doSheet['row']}>
              <div className={doSheet['rt']}>车辆：</div>
              <div className={doSheet['rc']}>{info['carCode']}-{info['licenseNo']}</div>
            </div>

          </div>
        </div>

      <div className={doSheet['toolbox']}>
        <button type="button" className={doSheet['btn-primary']} onClick={this.btnAction.bind(this,info['driveId'])}>完成试驾</button>
      </div>

      </div>

    );
  }
 
}

const DriveDoingComp = withStyles(doSheet)(DriveDoing);

function action({path, query, hash}) {
  const userInfo = query;
  return {
    chunks: ['drive.doing'],
    title,
    component: (
      <Layout hide={true}>
        <DriveDoingComp user={userInfo} />
      </Layout>
    ),
  };
}

export default action;
