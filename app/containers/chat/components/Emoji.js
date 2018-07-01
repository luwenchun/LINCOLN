import React from 'react';
import '../style/Emoji.scss';

export default class Emoji extends React.Component {
    constructor(){
        super();
        this.state = {
            list:[
                "😩","😲","😞","😵","😰","😒","😍","😤","😜","😝","😋","😘","😚","😷","😳","😃","😆","😁","😂","😄","😢","😭","😨","😣","😡","😌","😖","😔","😱","😪","😏","😓","😥","😫","😉","😺","😸","😹","😽","😻","😿","😼","🙀","🙋","🙌","🙍","🙏","🔥","🎁","🎄","🎅","🎈","🎉","👮","👱","👲","👳","👴","👵","👶","👷","👸","👯","👻","👼","👽","👾","👿","💀","💂","💃","🌻","🌴","🌵","🌾","🍎","🍊","🍓","👀","👂","👃","👄","👅","💅","👦","👧","👨","👩","👫","🎍","🎎","🎓","🎏","🎐","🎃","📞","📱","📲","📠","💻","💽","💾","💿","📀","🎵","🎶","🎼","💜","💝","💢","💤","💦","💨","💩","💪","✨","🔔","✊","👊","👍","☝","👆","👇","👈","👉","👋","👏","👌","👎","👐","🌀","🌂","🌙","🌟","🍀","🌷","🌱","🍁","🌸","🌹","🍂","🍃","🌺"
                ],
        }
    }
    componentWillMount(){
    }
    componentDidMount(){}
    render(){
        const Item = this.state.list.map((item, index)=>{
            return (
                <span key={index} onClick={this.change.bind(this, item)}>{item}</span>
            )
        })
        return(
            <div className={`${'emoji'} ${this.props.show ? 'show' : 'hide'}`}>
                {Item}
            </div>
        )
    }
    change(v){
        this.props.check(v)
    }
}
