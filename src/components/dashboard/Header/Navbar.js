import React, { useState } from 'react'
import { Typography, Row, Col, Tooltip, Button, Modal, message, Menu } from 'antd'
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { useSidebarContext } from '../../../context/SideBarContext';
import { useThemeContext } from 'context/ThemeContext'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useConnectWallet } from 'context/ConnectWalletContext'
import { Header } from 'antd/es/layout/layout';
const { Title } = Typography;

export default function Navbar() {
    const { siderWidth } = useSidebarContext()
    const { theme, setTheme } = useThemeContext()
    const { state, dispatch } = useConnectWallet()
    const [isAccounts, setisAccounts] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

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
            title: 'No accounts found in the extension',
            content: (
                <div>
                    <p>Make sure you have the polkadot.js extension installed and you have authorised delegate bittensor staking</p>
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

    const style = { width: `calc(100% - ${siderWidth + 15}px)`, marginLeft: siderWidth, transition: "all 0.2s", zIndex: 1000 }

    const menuItems = [
        { label: "Home" },
        { label: "Contact" },
        { label: "Services" },
    ]

    return (
        <>
            <Header className="d-flex px-2 px-md-4 px-lg-5">
                <Menu theme="dark" className='w-100 d-flex justify-content-end' mode="horizontal" items={menuItems} />
            </Header>
            {/* <header className={`dashboard-header position-fixed flex-between dashboard ${theme}`} style={style}>
                <div className='flex-grow-1 me-3'>
                    <Row gutter={16} className='align-items-center'>
                        <Col span={12}>
                            <Title className={`mb-0 ${theme === "dark" ? "text-white" : "text-blue"}`} level={3}>Welcome to Bittensor Staking</Title>
                        </Col>
                    </Row>
                </div>
                <div className='icon-container me-4 d-flex' style={{ cursor: 'pointer' }}>
                    <Tooltip title="Light theme"> <MdOutlineLightMode className="fs-5 me-2" onClick={() => setTheme("light")} /> </Tooltip>
                    <Tooltip title="Dark theme"> <BiMoon className='text-center fs-5' onClick={() => setTheme("dark")} /> </Tooltip>
                </div>
                <div>
                    {
                        !isAccounts ?
                            <Button type="primary" onClick={handleConnectWallet}>Connect Wallet</Button>
                            :
                            <Button type="primary" onClick={() => setModalOpen(true)}>View Account</Button>
                    }
                </div>
            </header> */}
            {/* <Modal title="Accounts" centered open={modalOpen} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} footer={null}   >
                <div className="py-2">
                    {state && state.accounts?.map((account, index) => {
                        return <div key={index} className="card p-2 border- mb-2">
                            <Title level={5} className='mb-0'>{account.meta?.name}</Title>
                            <Typography>{account.address}</Typography>
                        </div>
                    })}
                </div>
            </Modal> */}
        </>
    )
}