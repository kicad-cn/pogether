import React from 'react';
import {Progress} from "antd";
import PropTypes from 'prop-types';
import {Row, Col, Button} from 'antd'
import {connect} from 'react-redux'
import SingleEntry from "./SingleEntry/index";
import {HotKeys} from 'react-hotkeys';
import {editMsgstr, pushAndfetch, fetchMsgid,fetchMeta,requestDocMeta, REQUEST_DOC_META_ENUM as metaENUM} from "./action";
import './index.scss'


class slideEntries extends React.Component {
    constructor(props) {
        super(props);
        this.KeyHandler = {
            'snapLeft': (event) => this.handleclick()
        };
        this.map = {
            'snapLeft': 'ctrl+enter',
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleclick = this.handleclick.bind(this);
    }

    handleInput(ch) {
        console.log(ch)
        this.props.dispatch(editMsgstr(ch.Msgstr.value));
    }

    handleclick() {



        this.props.dispatch(pushAndfetch({
                docName: this.props.docName,
                id: this.props.id,
                Msgstr: this.props.Msgstr
            },
        ));
        this.props.dispatch(requestDocMeta(metaENUM.localUpdate));
    }

    componentDidMount() {
        this.props.dispatch(fetchMsgid());
        this.props.dispatch(fetchMeta(this.props.docName));
    }

    render() {
        let Prog;
        let translated =this.props.meta_total - this.props.meta_untranslated;
        let percent = Math.ceil(100*translated/this.props.meta_total);
        if (!this.props.meta_success)
            Prog =  <Progress status="exception"/>;
        else if ( this.props.meta_isfetching)
            Prog =  <Progress status="active" showInfo={false}/>;
        else if (percent === 100)
            Prog =  <Progress status="success" percent={percent} format={percent=>translated+'/'+this.props.meta_total}/>;
        else
            Prog =  <Progress status="active" percent={percent} format={percent=>translated+'/'+this.props.meta_total}/>;


        return (
            <HotKeys handlers={this.KeyHandler} keyMap={this.map}>
                <Row className={"progress-bar"}>
                    <Col span={16} offset={4}>
                        {Prog}
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col xs={22} sm={22} xl={22} className={"slide-entries"}>
                        <div className="single-entry">
                            <SingleEntry
                                InputDisable={this.props.isEnding}
                                Entry={{
                                    Msgid: this.props.Msgid,
                                    Msgstr: this.props.Msgstr,
                                }}
                                onChange={this.handleInput}
                            />
                        </div>
                    </Col>

                    {/*<Col xs={4} sm={1} xl={2}>*/}
                    {/*<div className="icon-button" onClick={this.handleclick}>*/}
                    {/*<Icon type="right" className="icon next"*/}
                    {/*style={{*/}
                    {/*color: this.state.rightHighlight ? this.mainColor : "black",*/}
                    {/*fontSize: '32px'*/}
                    {/*}}*/}
                    {/*onMouseEnter={() => this.setState({rightHighlight: !this.state.rightHighlight})}*/}
                    {/*onMouseLeave={() => this.setState({rightHighlight: !this.state.rightHighlight})}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*</Col>*/}
                </Row>
                <Row>
                    <Col xl={{offset: 19, span: 3}}
                         xs={{offset: 18, span: 2}}>
                        <Button disabled={this.props.isEnding}
                                onClick={this.handleclick}
                        >提交翻译</Button>
                    </Col>

                </Row>
            </HotKeys>
        );
    }
}

function mapStateToProps(state) {
    const {remoteInfo, local} = state;
    return {
        Msgstr: local.Msgstr,
        Msgid: remoteInfo.fetch.Msgid,
        id: remoteInfo.fetch.id,
        isEnding: remoteInfo.fetch.isEnding,

        meta_success:remoteInfo.meta.success,
        meta_isfetching:remoteInfo.meta.isFetching,
        meta_total: remoteInfo.meta.TotalEntries,
        meta_untranslated:remoteInfo.meta.Untranslated,
    };

}

slideEntries.propTypes = {
    Entry: PropTypes.object,
    docName: PropTypes.string,
};

const SlideEntries = connect(mapStateToProps)(slideEntries);


export default SlideEntries;