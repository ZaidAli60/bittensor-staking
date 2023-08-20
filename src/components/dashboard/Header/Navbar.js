import React, { useState } from 'react'
import { Typography, Input, Row, Col, Dropdown, Tooltip, Button, message, Modal } from 'antd'
import { BsShieldLockFill, BsFillPersonFill } from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { SearchOutlined } from "@ant-design/icons"
import { MdNotifications } from 'react-icons/md'
import { useSidebarContext } from '../../../context/SideBarContext';
import pic1 from "assets/images/pic.jpg"
import { useThemeContext } from 'context/ThemeContext'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useConnectWallet } from 'context/ConnectWalletContext'


const { Title } = Typography;

export default function Navbar() {

    const { siderWidth } = useSidebarContext()
    const { theme, toggleTheme } = useThemeContext()
    const { state, dispatch } = useConnectWallet()
    const [isAccounts, setisAccounts] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);

    console.log('state', state)
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
                message.error("No accounts found in the extension")
            }
        } catch (error) {
            console.error('Error connecting to Polkadot extension:', error);
            message.error("Error connecting to Polkadot extension:")
        }
    };

    const style = { width: `calc(100% - ${siderWidth + 15}px)`, marginLeft: siderWidth, transition: "all 0.2s", zIndex: 1000 }

    return (
        <>
            <header className="dashboard-header position-fixed flex-between dashboard" style={style}>
                <div className='flex-grow-1 me-3'>
                    <Row gutter={16} className='align-items-center'>
                        <Col span={12}>
                            <Title className={`mb-0 text-blue opacity-75`} level={3}>Welcome to Bittensor Staking</Title>
                        </Col>
                        <Col span={12} className='text-end'>
                            <Input size="large" className="mw-600px border-0 shadow" placeholder="Search Bitten..." prefix={<SearchOutlined />} />
                        </Col>
                    </Row>
                </div>
                <div className="card align-center flex-row" style={{ maxWidth: 430 }}>
                    <div className='icon-container btn' onClick={toggleTheme}>
                        {theme === "dark" ? <Tooltip title="Light theme"> <BiMoon className='text-center fs-5' /> </Tooltip> : <Tooltip title="Dark theme"> <MdOutlineLightMode className="fs-5" /> </Tooltip>}
                    </div>
                    {
                        !isAccounts ?
                            <Button type="primary" onClick={handleConnectWallet}>Connect Wallet</Button>
                            :
                            <Button type="primary" onClick={() => setModalOpen(true)}>Connected</Button>
                    }
                </div>
            </header>
            <Modal
                title="Accounts"
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >

            </Modal>
        </>
    )
}