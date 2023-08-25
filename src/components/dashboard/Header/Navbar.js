import React, { useState } from 'react'
import { Typography, Row, Col, Tooltip, Button, Modal, message } from 'antd'
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { useSidebarContext } from '../../../context/SideBarContext';
import { useThemeContext } from 'context/ThemeContext'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useConnectWallet } from 'context/ConnectWalletContext'
const { Title } = Typography;

export default function Navbar() {
    const { siderWidth } = useSidebarContext()
    const { theme, toggleTheme } = useThemeContext()
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

    return (
        <>
            <header className="dashboard-header position-fixed flex-between dashboard" style={style}>
                <div className='flex-grow-1 me-3'>
                    <Row gutter={16} className='align-items-center'>
                        <Col span={12}>
                            <Title className={`mb-0 text-blue opacity-75`} level={3}>Welcome to Bittensor Staking</Title>
                        </Col>
                    </Row>
                </div>
                <div className='icon-container me-4' onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                    {theme === "dark" ? <Tooltip title="Light theme"> <BiMoon className='text-center fs-5' /> </Tooltip> : <Tooltip title="Dark theme"> <MdOutlineLightMode className="fs-5" /> </Tooltip>}
                </div>
                <div>
                    {
                        !isAccounts ?
                            <Button type="primary" onClick={handleConnectWallet}>Connect Wallet</Button>
                            :
                            <Button type="primary" onClick={() => setModalOpen(true)}>View Account</Button>
                    }
                </div>
            </header>
            <Modal title="Accounts" centered open={modalOpen} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} footer={null}   >
                <div className="py-2">
                    {state && state.accounts?.map((account, index) => {
                        return <div key={index} className="card p-2 border- mb-2">
                            <Title level={5} className='mb-0'>{account.meta?.name}</Title>
                            <Typography>{account.address}</Typography>
                        </div>
                    })}
                </div>
            </Modal>
        </>
    )
}