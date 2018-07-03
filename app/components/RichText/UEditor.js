import React from 'react';
import UE from './ueditor/ueditor.all';


let initCount = true;

class Ueditor extends React.Component {
    static defaultProps = {
        config: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            config: {
            }
        };
    }

    componentDidMount() {
        this.initEditor()
    }

    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        UE.delEditor('UEdContent');
    }

    initEditor() {
        const { config } = { ...this.state };
        const ueEditor = UE.getEditor('UEdContent', {});
        const self = this;

        ueEditor.ready((ueditor) => {
            if (!ueditor) {
                UE.delEditor(id);
                self.initEditor();
            }
            // 设置默认值
            if (typeof self.nextProps.defaultValue != 'undefined') {
                ueEditor.setContent(self.nextProps.defaultValue);
            }
        })
        ueEditor.addListener('contentChange', (e) => {
            const htmlStr = ueEditor.getContent();
            self.props.onChange(htmlStr);
        })
    }

    render() {
        return (
            <div id='UEdContent' name="content" type="text/plain" style={{lineHeight:'20px'}}></div>
        )
    }
}
export default Ueditor;