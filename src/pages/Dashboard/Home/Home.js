import React from 'react'
import { Col, Row, Typography } from 'antd'
import { SiCoinmarketcap } from "react-icons/si"
import { TbBrandGoogleAnalytics } from "react-icons/tb"

const { Title } = Typography;

export default function Home() {
    return (
        <div className=''>
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <div className="card p-3 text-white mb-3" style={{ backgroundColor: "#fdedd4" }}>
                        <div className='align-center justify-content-between mb-3'>
                            <Title level={4} className='text-primary mb-0'>Maket Cap</Title>
                            <div>
                                <SiCoinmarketcap className='fs-5 text-primary' />
                            </div>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className="card p-3 text-white" style={{ backgroundColor: "#e1f9f1" }}>
                        <div className='align-center justify-content-between mb-3'>
                            <Title level={4} className='text-primary mb-0'>Network Status</Title>
                            <div>
                                <TbBrandGoogleAnalytics className='fs-5 text-primary' />
                            </div>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
