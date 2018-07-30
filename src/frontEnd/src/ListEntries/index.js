import React from 'react'
import { connect } from 'react-redux'
import {
    fetchPageData, toggleEntryEditStatus, TWEAK_OOPERATIONS_ENUM as TweakENUM, tweakEntry
    , pushAndrefetch, setPageFilter
} from './action'

import { HotKeys } from 'react-hotkeys';
import { Button, Checkbox, Col, Icon, List, Pagination, Row, Progress } from 'antd';
import SingleEntry from './SingleEntry/index'

const IconText = ({ type, text, onClick, disable }) => (
    <span onClick={onClick}>
        <Button disabled={disable} icon={type}>{text}</Button>
    </span>
);
const extraIcon = {
    ok: <span><Icon type={"check-circle"} style={{ color: "#52c41a", fontSize: "32px" }} /></span>,
    error: <span><Icon type={"close-circle"} style={{ color: "#a8071a", fontSize: "32px" }} /></span>,
    warning: <span><Icon type={"exclamation-circle"} style={{ color: "#fadb14", fontSize: "32px" }} /></span>,
    loading: <span><Icon type={"loading"} spin style={{ color: "#1890ff", fontSize: "32px" }} /></span>,
    untranslated: <span><Icon type={"question-circle"} style={{ color: "#1890ff", fontSize: "32px" }} /></span>,

}

class listEntries extends React.Component {
    constructor(props) {
        super(props)
        this.KeyHandler = {
            'snapLeft': (event) => console.log("hi"),
            'toggleNext': (event) => console.log("had")
        };
        this.map = {
            'snapLeft': 'ctrl+enter',
            'toggleNext': 'ctrl+alt+j',
        };
    }

    componentDidMount() {
        this.props.dispatch(fetchPageData(this.props.docName, 1, this.props.filter));
    }

    selectExtraIcon(id) {
        let v = this.props.listData.find(e => e.id === id);
        let Node = extraIcon.ok;
        if (!v.Translated)
            Node = extraIcon.untranslated;
        if (v.changed === true)
            Node = extraIcon.warning;
        if (v.loading === true)
            Node = extraIcon.loading;
        return Node;
    }

    selectAction(id) {
        let v = this.props.listData.find(e => e.id === id);
        let list = [];

        if (!v.editing)
            list.push(<IconText type="edit" text={v.Translated ? "修改" : "翻译"} onClick={() => this.props.dispatch(toggleEntryEditStatus(id))} />);
        else {
            list.push(<IconText type="edit" text={"结束修改"} onClick={() => this.props.dispatch(toggleEntryEditStatus(id))} />);
            list.push(<IconText disable={v.Msgstr.length === 0} type="upload" text="提交" onClick={
                () => {
                    this.props.dispatch(pushAndrefetch(this.props.docName, id, v));
                    this.props.dispatch(toggleEntryEditStatus(id))
                }
            } />);
        }
        return list
    }

    render() {
        return (
            <HotKeys handlers={this.KeyHandler} keyMap={this.map}>
                <Row type={"flex"} justify="space-between">
                    <Checkbox
                        checked={this.props.filter.untranslated}
                        onChange={(e) => {
                            console.log(e.target.checked);
                            this.props.dispatch(setPageFilter({ untranslated: e.target.checked }))
                            this.props.dispatch(fetchPageData(this.props.docName, 1, { ...this.props.filter, untranslated: e.target.checked }));
                        }
                        }
                    >仅显示未翻译的条目</Checkbox>
                    <Col span={4}>

                        <Progress percent={50} size="small" status="active" />

                    </Col>
                    <Pagination
                        onChange={(page) => {
                            this.props.dispatch(fetchPageData(this.props.docName, page, this.props.filter));
                        }}
                        total={this.props.pageMeta.count}
                        pageSize={5}
                        position="top"
                        showQuickJumper={true}
                        current={this.props.pageMeta.currentPage}
                    />
                </Row>
                <Row>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={this.props.listData}
                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                actions={this.selectAction(item.id)}
                                extra={this.selectExtraIcon(item.id)}
                            >
                                <SingleEntry
                                    Entry={{
                                        Msgid: item.Msgid,
                                        Msgstr: item.Msgstr
                                    }}
                                    onChange={(ch) => this.props.dispatch(tweakEntry({
                                        id: item.id,
                                        Msgid: item.Msgid,
                                        Msgstr: ch.Msgstr.value,
                                        fieldValidate: ch.error === undefined,
                                    }, TweakENUM.update))

                                    }
                                    disableEdit={!item.editing}
                                    fieldError={!item.fieldValidate}
                                    Translated={item.Translated}
                                />
                            </List.Item>
                        )}
                    />
                </Row>
            </HotKeys>
        )
    }
}

function mapStateToProps(state) {
    return {
        listData: state.ListEntries.data,
        pageMeta: state.ListEntries.pageMeta,
        filter: {
            untranslated: state.ListEntries.pageMeta.untranslated,

        }
    }
}

const ListEntries = connect(mapStateToProps)(listEntries);

export default ListEntries;