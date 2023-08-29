import React, { useEffect, useState } from 'react'
import { Button, Drawer, Menu, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { items } from "pages/Dashboard/SidebarItems"
import { useThemeContext } from 'context/ThemeContext';
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'

export default function Navbar() {
    const { theme, setTheme } = useThemeContext()
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isNavbarShadowed, setIsNavbarShadowed] = useState(false);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setIsNavbarShadowed(true);
        } else {
            setIsNavbarShadowed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        <>
            <nav className={`navbar navbar-expand-lg py-3 custom-navbar sticky-top dashboard ${theme} ${isNavbarShadowed ? "shadow" : ""} `}>
                <div className="container-fluid">
                    <a className="navbar-brand me-5" href="#">LOGO</a>
                    <button className="navbar-toggler" type="button" onClick={toggleDrawer} data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav me-auto ">
                            <Link to="/" className={`nav-link ${theme === "dark" ? "text-white" : "text-dark"}`}>Home</Link>
                            <Link to="/balance" className={`nav-link ${theme === "dark" ? "text-white" : "text-dark"}`} href="#">Balance</Link>
                            <Link to="/vote" className={`nav-link ${theme === "dark" ? "text-white" : "text-dark"}`} href="#">Vote</Link>
                            <Link to="/" className={`nav-link ${theme === "dark" ? "text-white" : "text-dark"}`} href="#">Buy Tao</Link>
                        </div>
                        <div className='icon-container me-3 d-flex' style={{ cursor: 'pointer' }}>
                            <Tooltip title="Light theme"> <MdOutlineLightMode className="fs-5 me-2" onClick={() => setTheme("light")} /> </Tooltip>
                            <Tooltip title="Dark theme"> <BiMoon className='text-center fs-5' onClick={() => setTheme("dark")} /> </Tooltip>
                        </div>
                        <div>
                            <Button type='primary' className='text-uppercase rounded-5 px-4 '>Connect</Button>
                        </div>
                    </div>
                </div>
            </nav>
            <Drawer
                title={
                    <div className='d-flex justify-content-between align-items-baseline'>
                        <span>LOGO</span>
                        <Button type='primary' className="px-4 text-uppercase rounded-5">
                            Connect
                        </Button>
                    </div>
                }
                placement="left"
                onClose={toggleDrawer}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
                className='custome-drawer'
            >
                <div className='py-4'>
                    <Menu theme='light' mode="inline" items={items} />
                </div>
            </Drawer>
        </>
    )
}
