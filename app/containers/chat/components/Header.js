import React from 'react';
import '../style/header.scss';

export default class Header extends React.Component {
    componentWillMount() {
        this.setState({
            user: []
        })

    }
    componentDidMount() {

    }
    render() {
        return(
            <div className={'head'}>
                <div alt='log'></div>
                <div>
                    <i className={'iconfont'} alt='搜索'>&#xe607;</i>
                    <input type="text" onChange={this.searchVal.bind(this)}/>
                </div>
            </div>
        )
    }
    searchVal(e) { 
        // console.log(e.target.value)
        this.props.search(e.target.value);
    }
    // componentWillReceiveProps() { }
}
