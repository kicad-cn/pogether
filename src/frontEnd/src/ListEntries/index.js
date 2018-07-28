import React from 'react'
import {connect} from 'react-redux'
import {toggleEntryEditStatus, TWEAK_OOPERATIONS_ENUM as TweakENUM, tweakEntry,fetchPageData} from './action'

import {Button, Icon, List} from 'antd';
import SingleEntry from './SingleEntry/index'

const IconText = ({type, text, onClick}) => (
    <span onClick={onClick}>
        <Button icon={type}>{text}</Button>
  </span>
);

const extraIcon = {
    ok: <span><Icon type={"check-circle"} style={{color: "#52c41a", fontSize: "32px"}}/></span>,
    error: <span><Icon type={"close-circle"} style={{color: "#a8071a", fontSize: "32px"}}/></span>,
    warning: <span><Icon type={"question-circle"} style={{color: "#fadb14", fontSize: "32px"}}/></span>,
    loading: <span><Icon type={"loading"} spin style={{color: "#1890ff", fontSize: "32px"}}/></span>,
}

class listEntries extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchPageData(this.props.docName,1));
    }
    selectExtraIcon(id) {
        let v = this.props.listData.findIndex(e => e.id === id)
        let Node = extraIcon.ok;
        if (this.props.listData[v].changed==true)
            Node = extraIcon.warning;
        return Node;
    }

    render() {
        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        this.props.dispatch(fetchPageData(this.props.docName,page))
                    },
                    total:this.props.pageMeta.count,
                    pageSize: 5,
                    position:"top",
                    showQuickJumper:true
                }}
                dataSource={this.props.listData}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        actions={[
                            <IconText type="star-o" text="编辑"
                                      onClick={() => this.props.dispatch(toggleEntryEditStatus(item.id))}/>,
                            <IconText type="like-o" text="提交"/>,
                        ]}

                        extra={this.selectExtraIcon(item.id)}
                        style={{paddingTop:"0"}}
                    >
                        <List.Item.Meta
                            description={item.description}
                        />

                        <SingleEntry
                            Entry={{
                                Msgid: item.Msgid,
                                Msgstr: item.Msgstr
                            }}
                            onChange={(ch) => this.props.dispatch(tweakEntry({
                                id: item.id,
                                Msgid: item.Msgid,
                                Msgstr: ch.Msgstr.value
                            }, TweakENUM.update))}
                            disableEdit={!item.editing}

                        />

                    </List.Item>
                )}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        listData: state.data,
        pageMeta:state.pageMeta
    }
}

const ListEntries = connect(mapStateToProps)(listEntries);

export default ListEntries;