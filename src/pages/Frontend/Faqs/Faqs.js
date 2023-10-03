import React from 'react'
import { useThemeContext } from 'context/ThemeContext'
import { Typography } from 'antd'
import { Collapse } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title } = Typography

export default function Faqs() {
    const { theme } = useThemeContext()

    const onChange = (key) => {
        console.log(key);
    };

    const getItems = (panelStyle) => [
        {
            key: '1',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>What is BittensorStaking.com?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>BittensorStaking.com is a user-friendly platform designed for effortless staking of TAO tokens. It provides essential statistics and information related to Bittensor Staking to guide users through the process.</p>,
            style: panelStyle,
        },
        {
            key: '2',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>Is BittensorStaking.com affiliated with the Opentensor Foundation?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>No, BittensorStaking.com is not affiliated with the Opentensor Foundation. The platform was developed by the FirstTensor Validator.</p>,
            style: panelStyle,
        },
        {
            key: '3',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>How do I start staking on the platform?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Begin by installing the Polkadot Js Extension and importing your wallet address into it. Then, select a validator and designate the amount of TAO you wish to stake. For a step-by-step video tutorial, please visit <a href="https://www.youtube.com/watch?v=kh97wbFZAUo" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=kh97wbFZAUo</a> </p>,
            style: panelStyle,
        },
        {
            key: '4',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>What are the benefits of staking TAO?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Staking TAO tokens enables you to earn rewards while contributing to network security. Rewards are proportionally distributed based on the amount staked.</p>,
            style: panelStyle,
        },
        {
            key: '5',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>Is there a minimum amount required for staking?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>There is no minimum staking requirement on our platform.</p>,
            style: panelStyle,
        },
        {
            key: '6',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>How are staking rewards calculated?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Staking rewards are determined by the total amount of TAO staked, individual staking contributions, APY, and the commission rate of the chosen validator. For an estimate, use our staking calculator.</p>,
            style: panelStyle,
        },
        {
            key: '7',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>Can I unstake my tokens at any time?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Yes, you have the flexibility to unstake your tokens whenever you choose.</p>,
            style: panelStyle,
        },
        {
            key: '8',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>Is my investment secure, and what are the risks involved in staking?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>The delegation/staking process is secure since validators cannot access users' funds directly. Users maintain control over their TAO, which stays in their wallets during delegation. This arrangement allows users to delegate their TAO confidently for network validation and reward earning without worrying about fund safety.</p>,
            style: panelStyle,
        },
        {
            key: '9',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>Who are the verified validators?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Verified validators are entities that have earned the trust and approval of the Opentensor Foundation team. You can view the list of verified validators here: <a href=" https://github.com/opentensor/bittensor-delegates/blob/main/public/delegates.json" target="_blank" rel="noopener noreferrer"> https://github.com/opentensor/bittensor-delegates/blob/main/public/delegates.json</a> </p>,
            style: panelStyle,
        },
        {
            key: '10',
            label: <Title level={5} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`} style={{ fontSize: '14px' }}>I am the owner of one of the Validators and we offer a smaller commission rate. How can I update the commission rate for my Validator?</Title>,
            children: <p className={`${theme === "dark" && "text-white"}`}>Please reach out to us at contact@firsttensor.com with the details, and we'll assist you with the process of updating the commission rate for your Validator. <br /> For additional support or information, please reach out to us at   <a href="mailto:contact@firsttensor.com">contact@firsttensor.com</a></p>,
            style: panelStyle,
        },
    ];


    const panelStyle = {
        marginBottom: 24,
        background: `${theme === 'dark' ? "#202020" : "white"}`,
        borderRadius: '10px',
        border: 'none',
        padding: 10
    };

    return (
        <div className={`faqs dashboard ${theme} min-vh-100`}>
            <div className="container-fluid px-xxl-5 px-lg-4 py-5">
                <div className="px-xxl-5 custom-lg-padding custom-xxl-padding">
                    <div>
                        <Title level={4} className={`fontFamily text-center mb-5 ${theme === "dark" ? "text-uppercase text-white " : "text-uppercase text-primary"}`}>FAQ</Title>
                        <Collapse
                            defaultActiveKey={['1']}
                            bordered={false}
                            onChange={onChange}
                            expandIcon={({ isActive }) => <RightOutlined className={`${theme === 'dark' && 'text-white'}`} rotate={isActive ? 90 : -90} />}
                            expandIconPosition='end'
                            items={getItems(panelStyle)}
                            style={{
                                background: `${theme === 'dark' ? '#121212' : "#fcfcfc"}`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
