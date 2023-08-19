import React from 'react'
import { Typography, Input, Row, Col, Dropdown, Tooltip } from 'antd'
import { BsShieldLockFill, BsFillPersonFill } from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import { MdOutlineLightMode } from 'react-icons/md'
import { SearchOutlined } from "@ant-design/icons"
import { MdNotifications } from 'react-icons/md'
import { useSidebarContext } from '../../../context/SideBarContext';
import pic1 from "assets/images/pic.jpg"
import { useThemeContext } from 'context/ThemeContext'

const { Title } = Typography;

export default function Navbar() {

    const { siderWidth } = useSidebarContext()
    const { theme, toggleTheme } = useThemeContext()

    const items = [
        {
            key: '1',
            type: 'group',
            label: <span className='text-dark'>Settings</span>,
            children: [
                {
                    key: '1-1',
                    label: <Title level={5} className='text-blue m-0 align-center' ><BsFillPersonFill className='me-2' />Account</Title>,
                },
                {
                    key: '1-2',
                    label: <Title level={5} className='text-pink m-0 align-center'><BsShieldLockFill className='me-2' />Security</Title>,
                },
                {
                    key: '1-3',
                    label: <Title level={5} className='m-0 align-center' style={{ color: "#7948FF" }}><MdNotifications className='me-2' />Notification</Title>,
                },
                {
                    key: '1-4',
                    label: <Title level={5} className='m-0 align-center'>Signout</Title>,
                },
            ],
        },
    ];

    const style = { width: `calc(100% - ${siderWidth + 15}px)`, marginLeft: siderWidth, transition: "all 0.2s", zIndex: 1000 }

    return (
        <header className={`dashboard-header position-fixed flex-between dashboard ${theme}`} style={style}>
            <div className='flex-grow-1 me-3'>
                <Row gutter={16} className='align-items-center'>
                    <Col span={12}>
                        <Title className={`mb-0 ${theme === "dark" ? "text-white" : "text-blue"} opacity-75`} level={2}>Welcome to Bittensor Staking</Title>
                    </Col>
                    <Col span={12} className='text-end'>
                        <Input size="large" className={`mw-600px border-0 shadow  ${theme === 'dark' ? 'dark-input' : 'light-input'}`} placeholder="Search Bitten..." prefix={<SearchOutlined />} style={{ backgroundColor: "#1e293b" }} />
                    </Col>
                </Row>
            </div>
            <div className="card align-center flex-row" style={{ maxWidth: 430 }}>
                <div className='icon-container btn' onClick={toggleTheme}>
                    {theme === "dark" ? <Tooltip title="Light theme"> <BiMoon className='text-center fs-5' /> </Tooltip> : <Tooltip title="Dark theme"> <MdOutlineLightMode className="fs-5" /> </Tooltip>}
                </div>
                <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                    <div className="align-center cursor-pointer">
                        <div className='pic-container d-inline-block'>
                            <img src={pic1} alt="P" /><div className="notify green"></div>
                        </div>
                        <Title level={5} className='text-blue m-0 fw-normal d-inline-block'></Title>
                    </div>
                </Dropdown>
            </div>
        </header>
    )
}