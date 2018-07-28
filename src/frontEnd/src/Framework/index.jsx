import React from 'react'
import './index.scss'
import {Layout, Menu} from 'antd';
import {Route,Link} from 'react-router-dom'
import ListEntries from '../ListEntries/index'

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;


class MainPage extends React.Component {

    render() {
        const ListWrap=({match})=> <ListEntries docName={match.params.doc}/>

        return (
            <Layout>
                <Header className="frame-header">
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{lineHeight: '64px'}}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '24px 50px'}}>
                    <Layout style={{background: '#fff'}}>
                        <Sider width={200} style={{background: '#fff'}}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{height: '100%'}}
                            >
                                <Menu.Item key="1"><Link to={"/docName/cvpcb"}> cvpcb</Link></Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </Menu>
                        </Sider>
                        <Content className="frame-content">
                            <Route path={'/docName/:doc'} component={ListWrap}/>



                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}

export default MainPage;
