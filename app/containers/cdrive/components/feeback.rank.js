/**
 * Rank component
 */

import React from 'react';
import Mui from '../../../utils/ui.plugin';
import Helper from '../../../utils/helper';
import '../style/feedback.rank.scss';

let _this, ids = [], evt = [];

export default class FeedbackRank extends React.Component {
    constructor(props) {
        super(props);
        this.items = {};
        this.selected = {};
        this.state = {
            id: this.props.id || ""
        };
        ids.push(this.props.id);
        _this = this;
    }

    componentDidMount() { 
        if (ids.length > 0) {
            ids.forEach((v) => {
                if (evt.indexOf(v) === -1) { 
                    Mui.$('.rank-' + v).on('tap', 'a', function(e) {
                        _this.selectRank(this, v);
                    });
                    evt.push(v);
                }
            });
        }
    }

    selectRank(o, k) {
        let item  = o.className,
            rank  = o.getAttribute('data-id'),
            elements = [],
            len   = 0,
            count = 0;

        if (_this.items[k] == null) {
            _this.items[k] = o.parentElement.parentElement.parentElement;
        }    

        elements = Array.prototype.slice.call(_this.items[k].querySelectorAll('li'));
        len = elements.length;

        for (let i = 0; i < len; i++) {
            let cls = elements[i].firstElementChild.className;
            if (cls.indexOf('active') !== -1) {
                count++;
            }
        }

        if (rank == 1 && item.indexOf('active') !== -1 && count < 2) {
            o.classList.remove('active'); 
        } else {
            elements.forEach(v => {
                let el = v.firstElementChild,
                    id = el.getAttribute('data-id');
                    el.classList.remove('active');
                if (id <= rank) {
                    el.classList.add('active');
                }
            });
        }

        _this.selected[k] = rank;
        Helper.setData('feedback_rank', JSON.stringify(_this.selected));
    }

    render() {
        return (
            <div className={this.state.id ? 'rank-' + this.state.id : ''}>
                <ol className={'ui-rank'}>
                    <li><a className={'star-sign'} href="#" data-id="1"></a></li>
                    <li><a className={'star-sign'} href="#" data-id="2"></a></li>
                    <li><a className={'star-sign'} href="#" data-id="3"></a></li>
                    <li><a className={'star-sign'} href="#" data-id="4"></a></li>
                    <li><a className={'star-sign'} href="#" data-id="5"></a></li>
                </ol> 
            </div>
        );
    }
}