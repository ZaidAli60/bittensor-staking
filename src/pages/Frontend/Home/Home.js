import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, Row, Select, Space, Table, Tooltip, Typography, message } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { HiMiniArrowLongDown, HiMiniArrowLongUp } from "react-icons/hi2"
import { useThemeContext } from 'context/ThemeContext'
import { useTaoInfoContext } from 'context/TaoInfoContext'
import { InfoCircleOutlined } from "@ant-design/icons"
import { useConnectWallet } from 'context/ConnectWalletContext'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromSource } from '@polkadot/extension-dapp'

const { Title, Text } = Typography;
const { Option } = Select;

export default function Home() {
    const { theme } = useThemeContext()
    const { state } = useConnectWallet()
    const { taoInfo } = useTaoInfoContext()
    const [documents, setDocuments] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentAPY, setCurrentAPY] = useState({})
    const [taoAmount, setTaoAmount] = useState(0)
    const [yearReward, setYearReward] = useState(0)
    const [monthlyReward, setMonthlyReward] = useState(0)
    const [account, setAccount] = useState({})
    const [validator, setValidator] = useState({})
    const [amount, setAmount] = useState(0)
    const [totalBalance, setTotalBalance] = useState(null)
    const [rao, setRao] = useState(null)
    const [stakeAmount, setStakeAmount] = useState(0)
    const [status, setStatus] = useState('');
    const [isFinalize, setIsFinalize] = useState(false)
    const [isFinalize1, setIsFinalize1] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [searchText, setSearchText] = useState('')

    const handleFatch = useCallback(async () => {
        setIsProcessing(true)
        try {
            const url = process.env.REACT_APP_BETTENSOR_VALIDATORS_END_POINT;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDocuments(data)
            setIsProcessing(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to fetch data. Please try again later.')
            setIsProcessing(false)
            return null;
        }
    }, [])

    useEffect(() => {
        handleFatch()
    }, [handleFatch])

    useEffect(() => {
        // documents.sort((a, b) => a.name.localeCompare(b.name));
        // Initialize filteredOptions with the same data as documents
        const filtered = documents.filter((validator) =>
            validator.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [documents, searchText]);

    useEffect(() => {
        setAccount(state.accounts.length > 0 ? state.accounts[0] : "")
    }, [state])

    // useEffect(() => {
    //     setValidator(documents.length > 0 ? documents[0] : {})
    // }, [documents])

    const handleSearch = (value) => {
        setSearchText(value)
    }

    const handleCurrentAPY = (value) => {
        const currentApyValue = documents.find((validator) => validator.name === value);
        setCurrentAPY(currentApyValue);
    }

    const handleAccounts = (value) => {
        const userAccounts = state.accounts.find(account => account.address === value)
        setAccount(userAccounts)
    }

    const handleValidators = (value) => {
        const selectValidator = documents.find(item => item.name === value)
        setValidator(selectValidator)
    }

    useEffect(() => {
        const taoToRao = amount * 1000000000;
        setRao(taoToRao)
    }, [amount])

    const dataWithKeys = documents?.filter((record) => record.nominators !== 0)
        .map((record) => ({
            ...record,
            key: record.details?.hot_key?.toString(), // Use optional chaining for safety
        }));

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
                        {row.commission * 100} % <InfoCircleOutlined className='d-flex flex-end' />
                    </span>
                </Tooltip>)
            }
        },
        {
            title: 'Total Staked',
            dataIndex: 'total_stake',
            sorter: (a, b) => a.total_stake - b.total_stake,
            render: (_, row) => {
                return <Text className={`${theme === "dark" && "text-white"}`}> {parseInt(row?.total_stake).toLocaleString('en-US')} TAO</Text>
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
    }

    const handleStakeCalculator = () => {
        if (!currentAPY.apy) {
            return message.error("Please select a validator")
        }
        if (taoAmount <= 0) {
            return message.error("Please enter tao amount")
        }
        if (!currentAPY) {
            console.error('No APY data available.');
            return;
        }

        const apy = currentAPY.apy.toFixed(2);
        const commission = currentAPY.commission;

        if (isNaN(apy) || isNaN(commission)) {
            console.error('Invalid APY or commission values.');
            return;
        }

        const calculateWithAPY = Number(taoAmount) * (apy / 100)
        const calculateWithcommsion = apy * (commission / 100)

        const yearRewards = calculateWithAPY - calculateWithcommsion
        setYearReward(yearRewards)
        const monthlyReward = (yearRewards / 12)
        setMonthlyReward(monthlyReward)

    }

    const handleBalance = async () => {

        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }
        const ADDR = account?.address;
        if (!ADDR) {
            console.error('ADDR not initialized');
            return
        }
        // Retrieve the last timestamp
        // const now = await api.query.timestamp.now();
        // Retrieve the account balance & nonce via the system module
        const { data: balance } = await api.query.system.account(ADDR);
        // console.log(` balance of ${balance.free}`);
        const orginalBalance = (balance.free - 500);
        const balan = Number(orginalBalance) / 1000000000;
        setTotalBalance(balan)
        // console.log('balance', Number(balance.free.toString()))
        // setBalance(Number(balance.free.toString()))
        // console.log(api.genesisHash.toHex());
    }

    useEffect(() => {
        if (state.accounts.length > 0) {
            handleBalance()
        }
        // eslint-disable-next-line
    }, [account])

    const fetchStakeAmount = async () => {
        try {
            const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
            const api = await ApiPromise.create({ provider: wsProvider });

            if (!validator?.details?.hot_key || !account?.address) {
                console.log('Invalid AccountId32 values');
                return;
            }

            const res = await api.query.subtensorModule.stake(validator.details.hot_key, account.address);

            if (res.isEmpty) {
                setStakeAmount(0);
            } else {
                const amount = res.toString() / 1000000000;
                setStakeAmount(amount);
            }
        } catch (error) {
            console.error('Error fetching stake amount:', error);
        }
    };

    useEffect(() => {
        if (state.accounts.length > 0) {
            fetchStakeAmount();
        }
        // eslint-disable-next-line
    }, [validator, account.address]);


    const delegateStake = async () => {

        if (!validator.name) { return message.error('Please select a validator') }

        if (!state.accounts.length > 0) {
            message.error('No wallet available, please connect your Polkadot wallet first.')
            return;
        }
        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }
        const transferExtrinsic = api.tx.subtensorModule.addStake(validator?.details.hot_key, rao)
        const selectedAccount = state?.accounts.find((item) => item.address === account.address);

        const injector = await web3FromSource(selectedAccount.meta.source);
        setIsFinalize(true)
        setStatus('Transaction is being processed...');

        try {
            await transferExtrinsic.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    // setStatus(`You have just delegated ${amount}τ from ${validator.name}`);
                    if (status.type === 'Finalized') {
                        handleBalance()
                        fetchStakeAmount()
                        setAmount(0)
                        setStatus(`Current status: ${status.type}`);
                        setIsFinalize(false)
                    }
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
            setIsFinalize(false);
        }
    };

    const handleUndelegate = async () => {

        if (!state.accounts.length > 0) {
            message.error('No wallet available, please connect your Polkadot wallet first.')
            return;
        }
        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }
        const undelegateExtrinsic = api.tx.subtensorModule.removeStake(validator?.details.hot_key, rao)
        const selectedAccount = state?.accounts.find((item) => item.address === account.address);

        const injector = await web3FromSource(selectedAccount.meta.source);
        setIsFinalize1(true)
        setStatus('Transaction is being processed...');

        try {
            await undelegateExtrinsic.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    if (status.type === 'Finalized') {
                        handleBalance()
                        fetchStakeAmount()
                        setAmount(0)
                        setIsFinalize1(false)
                        setStatus(`Current status: ${status.type}`);
                    }
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
            setIsFinalize1(false);
        }
    };

    const handleTotalBalanceMax = () => {
        const getTotalBalance = totalBalance;
        setAmount(getTotalBalance)
    }

    return (
        <div className={`home dashboard ${theme} min-vh-100`}>
            <div className="container-fluid px-xxl-5 px-lg-4 py-5">
                <div className="px-xxl-5 custom-lg-padding custom-xxl-padding">
                    {
                        taoInfo?.map((item, i) => {
                            const volume_24h = Number(item['24h_volume'])
                            const supplyStake = item?.delegated_supply
                            const circulateSupply = item?.current_supply
                            const getPercentageStake = (supplyStake / circulateSupply) * 100

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
                                            <Typography className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>24h Volume: {parseFloat(volume_24h / 1e6).toFixed(3)}m</Typography>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={6}>
                                    <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
                                        <div className='d-flex mb-2'>
                                            <SiCoinmarketcap className='fs-5 me-2' />
                                            <Title level={5} className={`fontFamily ${theme === "dark" && "text-white"}`} style={{ fontSize: "13px" }}>Market Cap</Title>
                                        </div>
                                        <div>
                                            <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>
                                                $ {Math.floor(parseFloat(item?.market_cap)).toLocaleString('de-DE')}
                                            </Title>
                                        </div>
                                        <div>
                                            <Typography className={`fontFamily ${theme === "dark" && "text-white"}`}>
                                                24h Change: {item && item['24h_change'] < 0 ? (
                                                    <span className='fw-bold' style={{ color: 'red' }}>
                                                        <HiMiniArrowLongDown /> {item['24h_change']}
                                                    </span>
                                                ) : (
                                                    <span className='fw-bold' style={{ color: "#22b14c" }}> <HiMiniArrowLongUp /> {item['24h_change']}</span>
                                                )}
                                            </Typography>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={6}>
                                    <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
                                        <div className='d-flex mb-2'>
                                            <TbAnalyze className='fs-5 me-2' />
                                            <Title level={5} className={`fontFamily ${theme === "dark" && "text-white"}`} style={{ fontSize: "13px" }}>Circulating Supply</Title>
                                        </div>
                                        <div>
                                            <Title level={5} className={`fontFamily ${theme === "dark" ? "text-white" : ""}`}>
                                                {Math.floor(parseFloat(item?.current_supply)).toLocaleString('de-DE')} TAO
                                            </Title>
                                        </div>
                                        <div>
                                            <Typography className={`fontFamily ${theme === "dark" && "text-white"}`}>
                                                Total Supply: {Math.floor(parseFloat(item?.total_supply)).toLocaleString('de-DE')} TAO
                                            </Typography>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={6}>
                                    <div className={`card p-3 ${theme === "dark" ? "bg-secondary text-white border-0" : "shadow"} h-100`}>
                                        <div className='d-flex  mb-2'>
                                            <TbBrandGoogleAnalytics className='fs-5 me-2' />
                                            <Title level={5} className={`fontFamily ${theme === "dark" && "text-white"}`} style={{ fontSize: "13px" }}>Supply Staked</Title>
                                        </div>
                                        <div>
                                            <Title level={5} className={`fontFamily ${theme === "dark" && "text-white"}`}>{Math.floor(parseFloat(item?.delegated_supply)).toLocaleString('de-DE')} TAO</Title>
                                        </div>
                                        <div>
                                            <Typography className={`fontFamily ${theme === "dark" && "text-white"}`}>Percentage Staked: {getPercentageStake.toFixed(1)} %</Typography>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        })
                    }

                    <div className="py-3 ">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={24} lg={18}>
                                <div className={`fontFamily ${theme === "dark" ? "card p-3 bg-secondary border-0" : "card p-3 shadow"} h-100`}>
                                    <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Bittensor Validators</Title>
                                    <Table columns={columns} bordered dataSource={dataWithKeys} loading={isProcessing} onChange={onChange} scroll={{ x: true }} className={`${theme === "dark" ? "dark-table" : "light-table"}`}
                                        expandable={{
                                            expandedRowRender: (record) => {
                                                const absoluteUrl = record.details?.url.startsWith('http') ? record.details?.url : `https://${record.details?.url}`;
                                                return (
                                                    <div className='px-5' >
                                                        <Text className={`${theme === "dark" && "text-white"}`}>Description: {record.details?.description}</Text> <br />
                                                        <Text className={`${theme === "dark" && "text-white"}`}>Hotkey: {record.details?.hot_key}</Text> <br />
                                                        <Text className={`${theme === "dark" && "text-white"}`}>Website: <a href={absoluteUrl} target="_blank" rel="noopener noreferrer">{record.details?.url}</a></Text>
                                                    </div>
                                                )
                                            },
                                            rowExpandable: (record) => record.name !== 'Not Expandable',
                                        }}
                                        pagination={{ pageSize: 15 }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={6}>
                                <div className='mb-3 staking-calculator'>
                                    <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                        <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Staking Calculator</Title>
                                        <div className='card border-0 p-3 mb-3' style={{ backgroundColor: "#b5e61d" }}>
                                            <div className='d-flex justify-content-between'>
                                                <Text className='fontFamily fw-bold'>Current APY</Text>
                                                <Text className='fontFamily fw-bold'>{currentAPY.apy?.toFixed(2)}%</Text>
                                            </div>
                                        </div>
                                        <div style={{ width: "100%" }} className='mb-3'>
                                            <Space>
                                                <Space.Compact >
                                                    <Select placeholder="Select Validator" style={{ width: "50%" }} className={`dashboard ${theme} ${theme === "dark" && "dark-dropdown"}`}
                                                        showSearch
                                                        value={currentAPY.name}
                                                        onChange={handleCurrentAPY}
                                                        onSearch={handleSearch}
                                                        optionFilterProp="children"
                                                        filterOption={false}
                                                    >
                                                        {filteredOptions.map((validator) => (
                                                            <Option key={validator.name} value={validator.name}>
                                                                {validator.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                    <Input type='number' onChange={(e) => setTaoAmount(e.target.value)} placeholder='TAO Amount' className={`rtl-input ${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                                </Space.Compact>
                                            </Space>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Commission</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{currentAPY?.commission * 100 || 0} %</Text>
                                            </div>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Monthly Rewards</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{monthlyReward.toFixed(2)}</Text>
                                            </div>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Yearly Rewards</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{yearReward.toFixed(2)}</Text>
                                            </div>
                                        </div>
                                        <div>
                                            <Button type='primary' className='w-100 fontFamily text-uppercase' size='large' onClick={handleStakeCalculator}>Calculate</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className='stake-tao'>
                                    <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                        {status && <Alert message={`${status}`} type={status === "Transaction failed" ? "error" : "success"} showIcon className='mb-2' />}
                                        <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Stake Tao</Title>
                                        <div className='d-flex justify-content-between mb-3'>
                                            <Button type='primary' className={`text-uppercase fontFamily ${theme === "dark" && "text-white opacity-75"}`} loading={isFinalize} disabled={amount === 0 || amount <= 0 || !amount || amount > totalBalance} onClick={delegateStake}>Delegate</Button>
                                            <Button type='primary' className={`text-uppercase fontFamily ${theme === "dark" && "text-white opacity-75"}`} loading={isFinalize1} disabled={amount === 0 || amount <= 0 || !amount || amount > stakeAmount} onClick={handleUndelegate}>UnDelegate</Button>
                                        </div>
                                        <div className='mb-2'>
                                            <Form layout="vertical">
                                                <Form.Item label="Choose Account" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`}>
                                                    <Select
                                                        className={`fontFamily ${theme === "dark" && "dark-dropdown select-placeholder"}`}
                                                        style={{ width: "100%" }}
                                                        placeholder="Choose Account"
                                                        value={account.meta?.name}
                                                        onChange={(value) => handleAccounts(value)}
                                                    >
                                                        {state?.accounts.map((account) =>
                                                            <Option key={account.address} value={account.address}>{account.meta?.name}</Option>
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="Validators" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} >
                                                    <Select
                                                        className={`fontFamily ${theme === "dark" && "dark-dropdown select-placeholder"}`}
                                                        style={{ width: "100%" }}
                                                        showSearch
                                                        value={validator.name}
                                                        onChange={(value) => handleValidators(value)}
                                                        onSearch={handleSearch}
                                                        placeholder="Select Validator"
                                                        optionFilterProp="children"
                                                        filterOption={false}
                                                    >
                                                        {filteredOptions.map((validator) => (
                                                            <Option key={validator.name} value={validator.name}>
                                                                {validator.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="Amount" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} name="Amount">
                                                    <div className="input-with-button" style={{ width: "100%" }}>
                                                        <Input placeholder="Amount" name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} type='number' className={`${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                                        <button className='btn btn-sm btn-primary text-white fontFamily' onClick={handleTotalBalanceMax}>MAX</button>
                                                    </div>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                        <div className='mb-3'>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>My Balance</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{totalBalance} TAO</Text>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Your Current Stake</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{stakeAmount} TAO</Text>
                                            </div>
                                        </div>

                                        <div >
                                            <Button type='primary' className={`w-100 fontFamily text-uppercase ${theme === "dark" && "text-white opacity-75"}`} size='large' loading={isFinalize} disabled={amount === 0 || amount <= 0 || !amount || amount > totalBalance} onClick={delegateStake}>Delegate</Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div >
        </div >
    )
}
