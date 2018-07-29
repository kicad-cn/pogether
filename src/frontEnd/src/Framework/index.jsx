import React from 'react'
import './index.scss'
import {Layout, Menu} from 'antd';
import {Route,Link} from 'react-router-dom'
import ListEntries from '../ListEntries/index'
import {fetchDocs} from "./action";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'


const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;


class mainPage extends React.Component {
    componentDidMount(){
        this.props.dispatch(fetchDocs())
    }
    render() {
        const ListWrap=({match})=> <ListEntries docName={match.params.doc}/>
        const MenuItem = []
        this.props.docs.map(e=>{
            MenuItem.push(
                <Menu.Item key={e.id}><Link to={"/docName/"+e.Name+"/"}>{e.Name}</Link></Menu.Item>
            )
        });
        return (
            <Layout>
                <Header className="frame-header">
                    <div className="logo"/>
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
                                {MenuItem}
                            </Menu>
                        </Sider>
                        <Content className="frame-content">
                            <Route exact path={'/docName/:doc/'} component={ListWrap}/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}

 function  mapStateToProps(state){
    return {
        docs:state.Framework.docs,
        loading:state.Framework.loading
    }
 }
const MainPage =withRouter(connect(mapStateToProps)(mainPage));

export default MainPage;
