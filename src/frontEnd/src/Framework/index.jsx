import React from 'react'
import {BackTop, Icon, Layout, Menu, Progress, Spin} from 'antd';
import {Link, Route, withRouter} from 'react-router-dom'
import ListEntries from '../ListEntries/index'
import {fetchDocs} from "./action";
import {connect} from 'react-redux';
import mainLogo from './logo.png'
import favicon from '../logo.png'
import ReactResizeDetector from 'react-resize-detector';
import {Helmet} from "react-helmet";
import './index.scss'
import './index.moble.scss'
// import axios from 'axios';
// import JSEncrypt from 'jsencrypt'

const {Header, Content, Sider} = Layout;


class mainPage extends React.Component {
    constructor(props) {
        super(props)

        let re=new RegExp('/docName/(.*?)/')
        let match=re.exec(this.props.location.pathname)
        let selectedMenuKey=null;
        if(re!==null&&match!=null){
             selectedMenuKey="menuitem"+match[1];
        }
        this.BreakWidth = 576;
        this.triggerDisapperWidth = 813// 当宽度大于该数值时视为屏幕足够宽，不提供trigger控制侧边栏开关。
        this.Mobile = window.innerWidth<this.triggerDisapperWidth

        //为什么是813?因为iphone x 横屏后宽度为812
        this.state = {
            collapsed: window.innerWidth <= this.BreakWidth ,
            width: window.innerWidth,
            selectedMenuKey
        }
        this.handleScroll= this.handleScroll.bind(this)
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handleScroll(){
        if(this.Mobile)
            this.setState({collapsed:true})


    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);

        // console.log("did mount")
        // let message = 'Hello world!';
        // let publicKey = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvphII+/jn73y5bpG9yCz198ac\n+IuqcTpGZJTjZojD1AMfoI8iDOvhmWmU+pBZhVTzpRFUc7djkG9TCpsbIaj/BMws\nH3+KlYhj5EECk2/CeXPX43FMcMi/acIVq60DqRYK60sbpYth4xjht56F2Uy/a71r\nWSIiYxIhr9t0JEmZQQIDAQAB\n-----END PUBLIC KEY-----"
        // let pri = "-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCvphII+/jn73y5bpG9yCz198ac+IuqcTpGZJTjZojD1AMfoI8i\nDOvhmWmU+pBZhVTzpRFUc7djkG9TCpsbIaj/BMwsH3+KlYhj5EECk2/CeXPX43FM\ncMi/acIVq60DqRYK60sbpYth4xjht56F2Uy/a71rWSIiYxIhr9t0JEmZQQIDAQAB\nAoGBAKQszV6oZZYkOqf3uTFyENQ2q+W8So8dFiMFkEScaejgGatOH3rsKO3MvusI\n6DNEdIrnFrOhFSByuBseJqvNYm6tilBztRzZ6/is5hOd22HmAxziIvFk+o52XCM6\ns0pLt7l/gBjbEsL6wRbsZBTgv5GvJkeEgir+EwDdpF2umlMhAkEAxtEuBZaidc4I\ndaIdU6j1sIDTt+B4tHAu+5hH6YLxdboAtRQB9TS6bKCsxy3utflI+buYrqyAyReT\n5n20FqPuVwJBAOIrAuyEb9WaQAvlmuj8y8awNEJNHA148mLzxMULud+iOnWhwGiC\nIDONXPg3nU2RPM+4pIQasb+zNhaCPuMvxicCQQCPvndOtQ06rT7yhcY8UWFpPotU\nW2gJ1T4yy3PawcCABH40bYXI2lma5kRlMbFwQg7f+CE40SG/wls9f07wO4+7AkA8\n+4n7Si55cvEIBC4D2n37ofFFW1NQEqeQpNgOpX3F3hFTPH0L8OJL5DcIOr6wdpPm\nEoxRjn0VCnZwFUhtq6kLAj8EzNOiaqLKyGZyoKPAmI3b3SIIwtSFMsvgbPzfs4Lg\nsVTk8JRQMmamnJyk+bcAPtcFF/vO+sFAes8/cm1sU0g=\n-----END RSA PRIVATE KEY-----"
        //
        // let encry = new JSEncrypt();
        // encry.setPublicKey(publicKey)
        // let encrypted = encry.encrypt(message);
        //
        // let decrypt = new JSEncrypt();
        // decrypt.setPrivateKey(pri);
        // let uncrypted = decrypt.decrypt(encrypted);
        // console.log(encrypted)
        //
        // console.log("unc",uncrypted);
        // console.log(publicKey)
        // console.log(pri)
        //
        // encry.setPublicKey(publicKey);
        // axios.post('http://localhost:8000/user/test/',{
        //     payload:encrypted
        //
        // });
        this.props.dispatch(fetchDocs())
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);


    }
    menuItemClick(selectedMenuKey){
        if(this.Mobile)
            this.toggle()
        this.setState({
            selectedMenuKey
        })





    }

    render() {
        // const ListWrap = ({match}) => <ListEntries docName={match.params.doc}/>
        const DocRouters = this.props.docs.map(e =>
            <Route key={'Route'+e.Name} exact path={'/docName/' + e.Name + '/'} render={() => <ListEntries docName={e.Name}/>}/>
        )

        let MenuItem;

        if (!this.props.loading) {
            MenuItem = this.props.docs.map(e =>
                <Menu.Item key={'menuitem'+e.Name}>
                    <Link to={"/docName/" + e.Name + "/"} className={"menu-item-link"} onClick={()=>this.menuItemClick('menuitem'+e.Name)}>
                        {e.Name}
                        <Progress status={"active"}
                                  percent={Math.round(100 - e.UntranslatedEntries * 100 / e.TotalEntries)}
                                  type={"circle"} width={30} className={"inline-progress"}/>
                    </Link>
                </Menu.Item>);
        }
        else {
            MenuItem = () => {
            };
        }


        return (
            <Layout>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>Kicad 文档翻译</title>
                    <link rel="canonical" href="http://translate.kicad.cn"/>
                    <link rel="shortcut icon" href={favicon}/>
                </Helmet>
                <ReactResizeDetector handleWidth handleHeight
                                     onResize={(e) => (this.setState({...this.state, width: e}))}/>
                <Header className="frame-header" style={{fontcolor: "black", backgroundColor: "#ffffff"}}>
                    <Icon
                        className={this.state.width < this.triggerDisapperWidth ? "trigger" : "trigger-disable"}
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <img alt="logo" src={mainLogo} height={"64px"}/>
                    <p>
                        文档翻译
                    </p>
                    <Icon type={"user"} className={"login-button"} onClick={() => console.log("hit")}/>
                </Header>

                <Content className="frame-content">
                    <Layout style={{background: '#fff', height: 'fit-content',}}>
                        <Sider
                            collapsible
                            breakpoint="lg"
                            collapsed={this.state.collapsed}
                            // onBreakpoint={this.setState({collapsed:true})}
                            trigger={null}
                            collapsedWidth="0"
                            style={{background: '#fff'}}
                            className={"frame-sider"}

                        >
                            <Spin tip={"加载列表.."} spinning={this.props.loading} delay={200}
                                  className={"menu-spin-wrapper"}/>

                            <Menu
                                mode="inline"
                                style={{height: '100%'}}
                                selectedKeys={[this.state.selectedMenuKey]}
                            >
                                {MenuItem}
                            </Menu>
                        </Sider>
                        <Content>
                            {/*<Route exact path={'/docName/:doc/'} render={ListWrap}/>*/}
                            {DocRouters}
                        </Content>
                    </Layout>
                </Content>
                <div>
                    <BackTop visibilityHeight={150}/>
                </div>
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
