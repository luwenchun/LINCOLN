/**
 *试驾已反馈
 */

import React from 'react';
// import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import fedSheet from './style/drive.feedback.scss';
const title = '试驾已反馈';

const apis = [
  { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
  { "id": "feedBackList", "url": "dealer/api/v1/feedBackList" },
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);


class DriveFeedback extends React.Component {
  constructor(props) {
    super(props);

    const userInfo = Object.assign({}, props['user']);

    this.state = {
      driveId: '',
      driverInfo: {},
      feedBackList: {}

    };

    this.state.driveId = userInfo['driveId'];

  }

  componentDidMount() {
    const that = this;

    Http.get('driverInfo', { driveId: this.state.driveId }, function (data) {
      that.setState({
        driverInfo: data
      })
    })

    Http.get('feedBackList', { driveId: this.state.driveId }, function (data) {
      that.setState({
        feedBackList: data
      })
    })





  }


  btnAction(_name) {
    const userId = this.props['user']['userId'];
    const mobile = this.props['user']['mobile'];
    window.location.href = '/wx/ent/drive?userid=' + userId + '&mobile=' + mobile;
  }


  render() {
    const that = this;
    const info = this.state.driverInfo;
    const fList = this.state.feedBackList;

    return (
      <div className={fedSheet.wrap}>
        <div className={fedSheet['form']}>

          <div className={fedSheet['content']}>



            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>NO:</div>
              <div className={fedSheet['rc']}><span style={{float:'right'}}>{info.driveId}</span></div>
            </div>
            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>预约状态:</div>
              <div className={fedSheet['rc']}><span style={{float:'right',color:'red'}}>{info['statusName']}</span></div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>预约时间：</div>
              <div className={fedSheet['rc']}>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>试驾车型：</div>
              <div className={fedSheet['rc']}>{(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>试驾地址：</div>
              <div className={fedSheet['rc']}>{(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>预约人：</div>
              <div className={fedSheet['rc']}>{info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>联系电话：</div>
              <div className={fedSheet['rc']}><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={fedSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></div>

            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>标签：</div>
              <div className={fedSheet['rc']}>{info['tagsName'] ? info['tagsName'] : ''}</div>
            </div>



            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>备注：</div>
              <div className={fedSheet['rc']}>{info['remark']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>车辆：</div>
              <div className={fedSheet['rc']}>{info['carCode']}-{info['licenseNo']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>鉴赏工程师：</div>
              <div className={fedSheet['rc']}>{info['appreciationEngineerName']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>对比车型：</div>
              <div className={fedSheet['rc']}>{fList['compareModel']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>购车类型：</div>
              <div className={fedSheet['rc']}>{fList['buyTypeName']}</div>
            </div>

            <div className={`${fedSheet.row}  ${!fList.buyType ? fedSheet.show : fedSheet.hide}`}>
              <div className={fedSheet['rt']}>目前座驾：</div>
              <div className={fedSheet['rc']}>{fList['currentCar']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>购车方案：</div>
              <div className={fedSheet['rc']}>{fList['purchasingPlanName']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>预计购车时间：</div>
              <div className={fedSheet['rc']}>{fList['deliveryTimeName']}</div>
            </div>

            <div className={fedSheet['row']}>
              <div className={fedSheet['rt']}>意向交车方式：</div>
              <div className={fedSheet['rc']}>{fList['deliveryTypeName']}</div>
            </div>





            <div className={fedSheet['row']}>
              <div className={fedSheet['toolbox']}>
                <button type="button" className={fedSheet['btn-primary']} onClick={this.btnAction.bind(this, 'detail')}>返回</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }

}

const DriveFeedbackComp = withStyles(fedSheet)(DriveFeedback);

function action({ path, query, hash }) {
  const userInfo = query;
  return {
    chunks: ['drive.feedback'],
    title,
    component: (
      <Layout hide={true}>
        <DriveFeedbackComp user={userInfo} />
      </Layout>
    ),
  };
}

export default DriveFeedback;
