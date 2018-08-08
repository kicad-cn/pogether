import React from 'react'
import { Layout, Menu, Icon} from 'antd';
import { Route, Link } from 'react-router-dom'
import ListEntries from '../ListEntries/index'
import { fetchDocs } from "./action";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import mainLogo from './logo.png'
import favicon from '../logo.png'
import ReactResizeDetector from 'react-resize-detector';
import {Helmet} from "react-helmet";
import './index.scss'


const { Header, Content, Sider } = Layout;


class mainPage extends React.Component {
    constructor(props) {
        super(props)
        this.BreakWidth = 576
        this.triggerDisapperWidth = 813// 当宽度大于该数值时视为屏幕足够宽，不提供trigger控制侧边栏开关。
        //为什么是813?因为iphone x 横屏后宽度为812

        this.state = {
            collapsed: window.innerWidth <= this.BreakWidth ? true : false,
            width:window.innerWidth,
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    componentDidMount() {
        console.log("did mount")
        this.props.dispatch(fetchDocs())
    }
    componentWillUnmount(){

    }
    render() {
        const ListWrap = ({ match }) => <ListEntries docName={match.params.doc} />
        const MenuItem = []

        this.props.docs.map(e => MenuItem.push(
            <Menu.Item key={e.id}><Link to={"/docName/" + e.Name + "/"}>{e.Name}</Link></Menu.Item>)
        );
        return (
            <Layout>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Kicad 文档翻译</title>
                        <link rel="canonical" href="http://translate.kicad.cn" />
                        <link rel="shortcut icon" href={favicon}/>
                    </Helmet>
                    ...
                <ReactResizeDetector handleWidth handleHeight onResize={(e)=>(this.setState({...this.state,width:e}))} />
                <Header className="frame-header" style={{ fontcolor: "black", backgroundColor: "#ffffff" }}>
                    <Icon
                        className={this.state.width<this.triggerDisapperWidth? "trigger" : "trigger-disable"}
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <img alt="logo" src={mainLogo} height={"64px"} />
                    <p>
                        文档翻译
                             </p>
                </Header>
                <Content style={{ padding: '12px 6px' }}>
                    <Layout style={{ background: '#fff' }}>
                        <Sider
                            collapsible
                            breakpoint="lg"
                            collapsed={this.state.collapsed}
                            // onBreakpoint={this.setState({collapsed:true})} 
                            collapsedWidth="0"
                            trigger={null}
                            width={200} style={{ background: '#fff' }}>
                            <Menu
                                mode="inline"
                                style={{ height: '100%' }}
                            >
                                {MenuItem}
                            </Menu>
                        </Sider>
                        <Content className="frame-content">
                            <Route exact path={'/docName/:doc/'} component={ListWrap} />
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        docs: state.Framework.docs,
        loading: state.Framework.loading
    }
}
const MainPage = withRouter(connect(mapStateToProps)(mainPage));

export default MainPage;
