/**
 * Home 链接
 */
import React from 'react';
import '../style/home.link.scss';

export default class HomeLink extends React.Component {
    constructor(props) {
        super(props);
    }

    linkTo() {
        //document.location.href = '/';
    }

    render() {
        return (
            <div className={'cdrive-home-box'} onClick={this.linkTo}>
              <a href="javascript:void(0)" className={'cdrive-home-nav'} ></a>
              <i className={'mui-icon mui-icon-home'}></i>
          </div>
        );
    }
} 