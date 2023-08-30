import React, { useEffect, useState } from 'react'
import { Button, Drawer, Menu, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { items } from "pages/Dashboard/SidebarItems"
import { useThemeContext } from 'context/ThemeContext';
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { LiaBarsSolid } from 'react-icons/lia'

export default function Navbar() {
    const { theme, setTheme } = useThemeContext()
    const [selectedItem, setSelectedItem] = useState("");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isNavbarShadowed, setIsNavbarShadowed] = useState(false);


    useEffect(() => {
        let keys = window.location.pathname.split("/")
        if (keys.length === 2 || (keys.length === 3 && !keys[2])) {
            setSelectedItem("home")
        } else {
            setSelectedItem(keys[2])
        }
    }, [])

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
                    <img src={`${theme === "dark" ? window.logoLight : window.logoDark} `} className='img-fluid me-5' alt="Bittensor Staking" />
                    <button className="navbar-toggler rounded-5 py-2 px-2" type="button" onClick={toggleDrawer} data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span ></span> */}
                        {
                            theme === "dark" ?
                                <LiaBarsSolid className="navbar-toggler-icon text-white" />
                                :
                                <LiaBarsSolid className="navbar-toggler-icon" />

                        }
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
                            <Button type='primary' className='px-4 custom-btn' size='large' shape="round">Connect</Button>
                        </div>
                    </div>
                </div>
            </nav>

            <Drawer
                title={
                    <div className='d-flex justify-content-between'>
                        <img src={`${theme === "dark" ? window.logoLight : window.logoDark}`} alt="Bittensor Staking" />
                        <Button type='primary' className='px-4 custom-btn' size='large' shape="round">
                            Connect
                        </Button>
                    </div>
                }
                placement="left"
                onClose={toggleDrawer}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
                className={`custome-drawer dashboard ${theme}`}
            >
                <div className='py-4'>
                    {selectedItem && <Menu theme='dark' mode="inline" items={items} defaultSelectedKeys={[selectedItem]} className={`dashboard ${theme}`} />}
                </div>
            </Drawer>
        </>
    )
}
