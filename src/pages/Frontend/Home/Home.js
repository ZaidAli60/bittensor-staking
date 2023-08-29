import React from 'react'
import { Col, Row, Table, Typography } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { useThemeContext } from 'context/ThemeContext'
import { useTaoInfoContext } from 'context/TaoInfoContext'

const { Title } = Typography

export default function Home() {
    const { theme } = useThemeContext()
    const { taoInfo } = useTaoInfoContext()

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

    return (
        <div className={`home dashboard ${theme} vh-100`}>
            <div className=" container-fluid  py-4">
                {
                    taoInfo?.map((item, i) => {
                        return <Row key={i} gutter={[16, 16]} className='mb-4'>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : ""}`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : ""}`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : ""}`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : ""}`}>
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

                <div className="py-3">
                    <Row gutter={[16, 16]}>
                        <Col lg={16}>
                            <div className={`${theme === "dark" ? "card p-3 bg-secondary border-0" : "card p-3"}`}>
                                <Title level={4} className={` ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Bittensor Validators</Title>
                                <Table columns={columns} bordered dataSource='' onChange={onChange} scroll={{ x: true }} className={`${theme === "dark" ? "dark-table" : ""}`} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
