import React, { useEffect, useState } from 'react'
import { Button, Drawer, Dropdown, Menu, Modal, Tooltip, Typography, message } from 'antd'
import { Link } from 'react-router-dom';
import { data } from "pages/Dashboard/SidebarItems"
import { useThemeContext } from 'context/ThemeContext';
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { LiaBarsSolid } from 'react-icons/lia'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useConnectWallet } from 'context/ConnectWalletContext';
import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography

export default function Navbar() {
    const { theme, setTheme } = useThemeContext()
    const [selectedItem, setSelectedItem] = useState("home");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isNavbarShadowed, setIsNavbarShadowed] = useState(false);
    const { state, dispatch } = useConnectWallet()
    const [isAccounts, setisAccounts] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

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

    const handleConnectWallet = async () => {
        try {
            await web3Enable('Bittensor-Staking'); // Enable your app to access the extension
            const accounts = await web3Accounts(); // Get the list of accounts from the extension

            if (accounts.length > 0) {
                const allAccounts = accounts
                dispatch({ type: 'SET_ACCOUNTS', payload: allAccounts })
                setisAccounts(true)
                message.success("Wallet connected successfully!")
            } else {
                console.log('No accounts found in the extension');
                error()
            }
        } catch (error) {
            console.error('Error connecting to Polkadot extension:', error);
            message.error("Error connecting to Polkadot extension")
        }
    };

    const error = () => {
        Modal.error({
            title: 'Wallet account not detected',
            content: (
                <div>
                    <p>Please ensure that the Polkadot JS extension is properly installed and that you have granted the necessary authorization for application access.</p>
                    <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer" className='text-primary'>Install Polkadot.js Extension</a>
                </div>
            ),
            centered: true,
            okButtonProps: {
                style: {
                    background: '#0d1321',     // Change the background color
                    color: 'white',         // Change the text color
                },
            },
        });
    };

    const items = [
        {
            label: <a className='custom-navbar text-decoration-none text-uppercase fw-bold' href="https://www.gate.io/trade/TAO_USDT" target="_blank" rel="noopener noreferrer">Gate.io</a>,
            key: '0',
        },
        {
            label: <a className='custom-navbar text-decoration-none fw-bold' href="https://www.mexc.com/exchange/TAO_USDT" target="_blank" rel="noopener noreferrer">MEXC</a>,
            key: '1',
        },
        {
            label: <a className='custom-navbar text-decoration-none fw-bold' href="https://www.bitget.com/spot/TAOUSDT?type=spot" target="_blank" rel="noopener noreferrer">BITGET</a>,
            key: '2',
        },
        {
            label: <a className='custom-navbar text-decoration-none fw-bold' href="https://www.bitmart.com/trade/en-US?symbol=%24TAO_USDT" target="_blank" rel="noopener noreferrer">BITMART</a>,
            key: '3',
        },
        {
            label: <a className='custom-navbar text-decoration-none fw-bold' href="https://tensor.exchange/" target="_blank" rel="noopener noreferrer">TENSOR EXCHANGE</a>,
            key: '4',
        },
    ];

    return (
        <>
            <nav className={` navbar navbar-expand-lg px-xxl-5 custom-lg-padding custom-xxl-padding py-3 custom-navbar sticky-top dashboard ${theme} ${isNavbarShadowed ? "shadow" : ""}`}>
                <div className="container-fluid px-xxl-5 px-lg-4">
                    <img src={`${theme === "dark" ? window.logoLight : window.logoDark}`} className='img-fluid me-5' style={{ width: "170px", height: "auto" }} alt="Bittensor Staking" />
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav me-auto">
                            <Link to="/" className={`nav-link fw-bold ${theme === "dark" ? "text-white" : "text-dark"}`} style={{ fontSize: "16px" }}>Homes</Link>
                            <Link to="/balance" className={`nav-link fw-bold ${theme === "dark" ? "text-white" : "text-dark"}`} style={{ fontSize: "16px" }}>Balance</Link>
                            <Link to="/vote" className={`nav-link fw-bold ${theme === "dark" ? "text-white" : "text-dark"}`} style={{ fontSize: "16px" }} >Vote</Link>
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()} className={`nav-link fw-bold ${theme === "dark" ? "text-white" : "text-dark"} `} style={{ fontSize: "16px" }}>Buy Tao <DownOutlined className="fw-bold" style={{ fontSize: "12px" }} /></a>
                            </Dropdown>
                        </div>
                    </div>
                    <a href="http://" ></a>
                    <div className='icon-container me-3 d-flex' style={{ cursor: 'pointer' }}>
                        <Tooltip title="Light theme"> <MdOutlineLightMode className="fs-5 me-2" onClick={() => setTheme("light")} /> </Tooltip>
                        <Tooltip title="Dark theme"> <BiMoon className='text-center fs-5' onClick={() => setTheme("dark")} /> </Tooltip>
                    </div>
                    <div className="d-none d-lg-block">
                        {
                            !isAccounts ?
                                <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`px-4 custom-btn`} size="large" shape="round" onClick={handleConnectWallet}>Connect</Button>
                                :
                                <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`px-4 custom-btn`} size="large" shape="round" onClick={() => setModalOpen(true)}>View Account</Button>
                        }
                    </div>
                    <button className="navbar-toggler rounded-5 py-2 px-2" type="button" onClick={toggleDrawer} data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        {theme === "dark" ?
                            <LiaBarsSolid className="navbar-toggler-icon text-white" style={{ fontSize: "14px" }} />
                            :
                            <LiaBarsSolid className="navbar-toggler-icon" style={{ fontSize: "14px" }} />
                        }
                    </button>
                </div>
            </nav>

            <Drawer
                title={
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='me-2'>
                            <img src={`${theme === "dark" ? window.logoLight : window.logoDark}`} className='img-fluid' style={{ width: "170px", height: "auto" }} alt="Bittensor Staking" />
                        </div>
                        <div>
                            {
                                !isAccounts ?
                                    <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`px-3 custom-btn`} shape="round" onClick={handleConnectWallet}>Connect</Button>
                                    :
                                    <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`px-3 custom-btn`} shape="round" onClick={() => setModalOpen(true)}>View Account</Button>
                            }
                        </div>
                    </div>
                }
                placement="left"
                onClose={toggleDrawer}
                open={drawerVisible}
                bodyStyle={{ padding: 0 }}
                className={`custom-drawer dashboard ${theme}`}
            >
                <div className='py-4'>
                    {selectedItem && <Menu theme='dark' mode="inline" defaultSelectedKeys={[selectedItem]} className={`dashboard ${theme}`}>
                        {data.map((item) => (
                            <Menu.Item
                                key={item.key}
                                icon={item.icon}
                                onClick={() => {
                                    item.onClick && item.onClick();
                                    toggleDrawer(); // Close the drawer when a menu item is clicked
                                }}
                            >
                                {item.label}
                            </Menu.Item>
                        ))}
                    </Menu>}
                    {/* {selectedItem && <Menu theme='dark' mode="inline" items={items} defaultSelectedKeys={[selectedItem]} className={`dashboard ${theme}`} />} */}
                </div>
            </Drawer>

            <Modal className={`custom-navbar dashboard ${theme === "dark" ? "account-modal" : ''} `} title="Accounts" centered open={modalOpen} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} footer={null}   >
                <div className="py-2">
                    {state && state.accounts?.map((account, index) => {
                        return <div key={index} className={`card p-2 border-1 mb-2 ${theme === "dark" && "bg-secondary text-white"}`}>
                            <Title level={5} className={`mb-0 ${theme === "dark" && "text-white"}`}>{account.meta?.name}</Title>
                            <Typography className={`${theme === "dark" && "text-white"}`}>{account.address}</Typography>
                        </div>
                    })}
                </div>
            </Modal>
        </>
    )
}
