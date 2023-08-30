import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Input, Row, Select, Space, Table, Typography } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { useThemeContext } from 'context/ThemeContext'
import { useTaoInfoContext } from 'context/TaoInfoContext'

const { Title, Text } = Typography

export default function Home() {
    const { theme } = useThemeContext()
    const { taoInfo } = useTaoInfoContext()
    const [validators, setValidators] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    console.log('validators', validators)

    const handleFatch = useCallback(async () => {
        setIsProcessing(true)
        try {
            const url = 'http://3.123.33.186:8000/api/delegates/';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setValidators(data)
            setIsProcessing(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsProcessing(false)
            return null;
        }
    }, [])

    useEffect(() => {
        handleFatch()
    }, [handleFatch])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),

        },
        {
            title: 'APY',
            sorter: (a, b) => a.key.localeCompare(b.key),
        },
        {
            title: 'Comission',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Total Staked',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nominators',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        }

    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const options = [
        {
            value: 'zhejiang',
            label: 'Zhejiang',
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
        },
    ];

    return (
        <div className={`home dashboard ${theme} vh-100`}>
            <div className=" container-fluid  py-5">
                {
                    taoInfo?.map((item, i) => {
                        return <Row key={i} gutter={[16, 16]} className='mb-4'>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"}`}>
                                    <div className='d-flex mb-2'>
                                        <MdOutlinePriceCheck className='fs-5 me-2' />
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`} style={{ fontSize: "13px" }}>Current Price</Title>
                                    </div>
                                    <div>
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>$ {item?.price}</Title>
                                    </div>
                                    <div>
                                        <Typography className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>24h_Volume: ${item && item['24h_volume']}</Typography>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"}`}>
                                    <div className='d-flex mb-2'>
                                        <SiCoinmarketcap className='fs-5 me-2' />
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`} style={{ fontSize: "13px" }}>Market Cap</Title>
                                    </div>
                                    <div>
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>${item?.market_cap}</Title>
                                    </div>
                                    <div>
                                        <Typography className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>24h_Change: ${item && item['24h_change']}</Typography>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"}`}>
                                    <div className='d-flex mb-2'>
                                        <TbAnalyze className='fs-5 me-2' />
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`} style={{ fontSize: "13px" }}>Circulating Supply</Title>
                                    </div>
                                    <div>
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>{item?.current_supply} TAO</Title>
                                    </div>
                                    <div>
                                        <Typography className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Total Supply: ${item?.total_supply}</Typography>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"}`}>
                                    <div className='d-flex  mb-2'>
                                        <TbBrandGoogleAnalytics className='fs-5 me-2' />
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`} style={{ fontSize: "13px" }}>Supply Staked</Title>
                                    </div>
                                    <div>
                                        <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>{item?.delegated_supply} TAO</Title>
                                    </div>
                                    <div>
                                        <Typography className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Percentage Staked: {item?.staking_apy}</Typography>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    })
                }

                <div className="py-3 staking-calculator">
                    <Row gutter={[16, 16]}>
                        <Col lg={16}>
                            <div className={`fontFamily ${theme === "dark" ? "card p-3 bg-secondary border-0" : "card p-3 shadow"}`}>
                                <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Bittensor Validators</Title>
                                <Table columns={columns} bordered dataSource={validators} onChange={onChange} scroll={{ x: true }} className={`${theme === "dark" ? "dark-table" : ""}`} />
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"}`}>
                                <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Staking Calculator</Title>
                                <div className='card border-0 p-3 mb-3' style={{ backgroundColor: "#b5e61d" }}>
                                    <div className='d-flex justify-content-between'>
                                        <Text className='fontFamily'>Current APY</Text>
                                        <Text className='fontFamily'>27.24%</Text>
                                    </div>
                                </div>
                                <div style={{ width: "100%" }} className='mb-3'>
                                    <Space >
                                        <Space.Compact >
                                            <Select defaultValue="Zhejiang" options={options} style={{ width: "50%" }} />
                                            <Input type='number' defaultValue="" placeholder='TAO Amount' className="rtl-input" />
                                        </Space.Compact>
                                    </Space>
                                </div>
                                <div className="card p-3 mb-3">
                                    <div className="d-flex justify-content-between">
                                        <Text className='fontFamily'>Monthly Rewards</Text>
                                        <Text className='fontFamily'>0.000</Text>
                                    </div>
                                </div>
                                <div className="card p-3 mb-3">
                                    <div className="d-flex justify-content-between">
                                        <Text className='fontFamily'>Yearly Rewards</Text>
                                        <Text className='fontFamily'>0.000</Text>
                                    </div>
                                </div>
                                <div >
                                    <Button type='primary' className='w-100 fontFamily' size='large'>Calculate</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
