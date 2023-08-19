import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { items } from "./SidebarItems"
import Header from "components/dashboard/Header"
import Routes from "./Routes"
import { useSidebarContext } from '../../context/SideBarContext';
import logo from "assets/images/logo1.png"
import { useThemeContext } from 'context/ThemeContext';

const { Text } = Typography
const { Content, Sider } = Layout;

export default function Dashboard() {
    const { theme } = useThemeContext()
    const { isCollapsed, setIsCollapsed, siderWidth } = useSidebarContext();
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        let keys = window.location.pathname.split("/")
        if (keys.length === 2 || (keys.length === 3 && !keys[2])) {
            setSelectedItem("home")
        } else {
            setSelectedItem(keys[2])
        }
    }, [])

    return (
        <Layout hasSider>
            <div >
                <Sider breakpoint="xl" width={250}
                    collapsible
                    collapsed={isCollapsed}
                    onCollapse={val => { setIsCollapsed(val); sessionStorage.setItem("isCollapsed", val) }}
                    className={`overflow-auto position-fixed scroll-hidden dashboard ${theme}`}
                    style={{ zIndex: 100, height: "calc(100vh - 30px)" }}
                >
                    <Link to="/"><img src={logo} alt={window.appName} className='img-fluid d-block my-5 mx-auto' style={{ width: isCollapsed ? 64 : 135, transition: "all 0.2s" }} /></Link>
                    {selectedItem && <Menu theme='dark' mode="inline" items={items} defaultSelectedKeys={[selectedItem]} className={`dashboard ${theme}`} />}
                </Sider>
            </div>
            <Layout className="site-layout dashboard">
                <Header />
                <Content className='px-15px pb-15px' style={{ marginLeft: siderWidth, transition: "all 0.2s", marginTop: 109 }}>
                    <Routes />
                </ Content >
            </Layout>
        </Layout>
    )
}