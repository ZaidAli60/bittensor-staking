import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Space, Table, Tooltip, Typography } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { useThemeContext } from 'context/ThemeContext'
import { useTaoInfoContext } from 'context/TaoInfoContext'
import { InfoCircleOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
// const { Option } = Select;

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

    const dataWithKeys = validators?.map((record) => ({
        ...record,
        key: record.details?.hot_key.toString(), // Using the index as the key, but you should use a unique identifier
    }));

    // console.log('dataWithKeys', dataWithKeys)

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            fixed: 'left',
        },
        {
            title: 'APY',
            sorter: (a, b) => a.apy - b.apy,
            render: (_, row) => {
                return <Text className={`${theme === "dark" && "text-white"}`}>{row.apy?.toFixed(2)}%</Text>
            }
        },
        {
            title: 'Commission',
            sorter: (a, b) => a.commission - b.commission,
            render: (_, row) => {
                return (<Tooltip title={row.tooltip}>
                    <span className='d-flex justify-content-between'>
                        {row.commission} % <InfoCircleOutlined className='d-flex flex-end' />
                    </span>
                </Tooltip>)
            }
        },
        {
            title: 'Total Staked',
            dataIndex: 'total_stake',
            sorter: (a, b) => a.total_stake - b.total_stake,
            render: (_, row) => {
                return <Text className={`${theme === "dark" && "text-white"}`}>{row.total_stake?.toFixed(2)} TAO</Text>
            }
        },
        {
            title: 'Nominators',
            dataIndex: 'nominators',
            sorter: (a, b) => a.nominators - b.nominators,
        }

    ];

    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };

    const options = [
        {
            value: 'Firsttensor',
            label: 'Firsttensor',
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
        },
    ];

    return (
        <div className={`home dashboard ${theme} min-vh-100`}>
            <div className=" container-fluid  py-5">
                {
                    taoInfo?.map((item, i) => {
                        return <Row key={i} gutter={[16, 16]} className='mb-4'>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
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
                                <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
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

                <div className="py-3 ">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={16}>
                            <div className={`fontFamily ${theme === "dark" ? "card p-3 bg-secondary border-0" : "card p-3 shadow"} h-100`}>
                                <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Bittensor Validators</Title>
                                <Table columns={columns} bordered dataSource={dataWithKeys} loading={isProcessing} onChange={onChange} scroll={{ x: true }} className={`${theme === "dark" ? "dark-table" : "light-table"}`}
                                    expandable={{
                                        expandedRowRender: (record) => (
                                            <div className='px-5'>
                                                <Text className={`${theme === "dark" && "text-white"}`}>DESCRIPTION: {record.details?.description}</Text> <br />
                                                <Text className={`${theme === "dark" && "text-white"}`}>HOTKEY: {record.details?.hot_key}</Text> <br />
                                                <Text className={`${theme === "dark" && "text-white"}`}>WEBSITE: {record.details?.url}</Text>
                                            </div>
                                        ),
                                        rowExpandable: (record) => record.name !== 'Not Expandable',
                                    }}
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Col className='mb-3 staking-calculator'>
                                <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                    <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Staking Calculator</Title>
                                    <div className='card border-0 p-3 mb-3' style={{ backgroundColor: "#b5e61d" }}>
                                        <div className='d-flex justify-content-between'>
                                            <Text className='fontFamily'>Current APY</Text>
                                            <Text className='fontFamily'>27.24%</Text>
                                        </div>
                                    </div>
                                    <div style={{ width: "100%" }} className='mb-3'>
                                        <Space>
                                            <Space.Compact >
                                                <Select defaultValue="Zhejiang" options={options} style={{ width: "50%" }} className={`dashboard ${theme} ${theme === "dark" && "dark-dropdown"}`} />
                                                <Input type='number' defaultValue="" placeholder='TAO Amount' className={`rtl-input ${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                            </Space.Compact>
                                        </Space>
                                    </div>
                                    <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                        <div className="d-flex justify-content-between">
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Monthly Rewards</Text>
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>0.000</Text>
                                        </div>
                                    </div>
                                    <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                        <div className="d-flex justify-content-between">
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Yearly Rewards</Text>
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>0.000</Text>
                                        </div>
                                    </div>
                                    <div >
                                        <Button type='primary' className='w-100 fontFamily text-uppercase' size='large'>Calculate</Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='stake-tao'>
                                <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                    <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Stake Tao</Title>
                                    <div className='d-flex justify-content-between mb-3'>
                                        <Button type='primary' className='text-uppercase fontFamily'>Delegate</Button>
                                        <Button type='primary' className='text-uppercase fontFamily'>UnDelegate</Button>
                                    </div>
                                    <div className='mb-2'>
                                        <Form layout="vertical">
                                            <Form.Item label="Validators" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} name="Validators">
                                                <Select
                                                    className={`fontFamily ${theme === "dark" && "dark-dropdown select-placeholder"}`}
                                                    style={{ width: "100%" }}
                                                    placeholder="Select a validators"
                                                    defaultValue="Firsttensor"
                                                    options={options}
                                                >

                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="Amount" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} name="Amount">
                                                <div className="input-with-button" style={{ width: "100%" }}>
                                                    <Input placeholder="Amount" type='number' className={`${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                                    <button className='btn btn-sm btn-primary text-white fontFamily'>MAX</button>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                    <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                        <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>My Balance :</Text>
                                    </div>
                                    <div className='mb-3'>
                                        <div className="d-flex justify-content-between">
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Available Amount</Text>
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>422 TAO</Text>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>Available Amount</Text>
                                            <Text className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>422 TAO</Text>
                                        </div>
                                    </div>

                                    <div >
                                        <Button type='primary' className='w-100 fontFamily text-uppercase' size='large'>Delegate</Button>
                                    </div>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
