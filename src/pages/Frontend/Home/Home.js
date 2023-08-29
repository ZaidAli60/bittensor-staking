import React from 'react'
import { Col, Row, Typography } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { useThemeContext } from 'context/ThemeContext'

const { Title } = Typography

export default function Home() {
    const { theme } = useThemeContext()
    return (
        <div className={`home dashboard ${theme}`}>
            <div className=" container-fluid  py-4">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : ""}`}>
                            <div className='d-flex mb-2'>
                                <MdOutlinePriceCheck className='fs-5 me-2' />
                                <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`} style={{ fontSize: "13px" }}>Current Price</Title>
                            </div>
                            <div>
                                <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>$75.91</Title>
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
                                <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>$75.91</Title>
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
                                <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>$75.91</Title>
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
                                <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>$75.91</Title>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
