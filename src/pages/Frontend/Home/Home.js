import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, Row, Select, Skeleton, Space, Spin, Table, Tooltip, Typography, message } from 'antd'
import { MdOutlinePriceCheck } from "react-icons/md"
import { SiCoinmarketcap } from "react-icons/si"
import { TbAnalyze, TbBrandGoogleAnalytics } from "react-icons/tb"
import { HiMiniArrowLongDown, HiMiniArrowLongUp } from "react-icons/hi2"
import { InfoCircleOutlined } from "@ant-design/icons"
import { useThemeContext } from 'context/ThemeContext'
import { useTaoInfoContext } from 'context/TaoInfoContext'
import { useConnectWallet } from 'context/ConnectWalletContext'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromSource } from '@polkadot/extension-dapp'
import axios from 'axios'


const { Title, Text } = Typography;
const { Option } = Select;

export default function Home() {
    const { theme } = useThemeContext()
    const { state } = useConnectWallet()
    const { isSkeleton, taoInfo } = useTaoInfoContext()
    const [documents, setDocuments] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentAPY, setCurrentAPY] = useState('')
    const [taoAmount, setTaoAmount] = useState(0)
    const [yearReward, setYearReward] = useState(0)
    const [monthlyReward, setMonthlyReward] = useState(0)
    const [account, setAccount] = useState({})
    const [validator, setValidator] = useState('')
    const [amount, setAmount] = useState(0)
    const [totalBalance, setTotalBalance] = useState(null)
    const [rao, setRao] = useState(null)
    const [stakeAmount, setStakeAmount] = useState(0)
    const [status, setStatus] = useState('');
    const [isFinalize, setIsFinalize] = useState(false)
    const [isFinalize1, setIsFinalize1] = useState(false)
    const [allStakeValidators, setAllStakeValidators] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeButton, setActiveButton] = useState('delegate'); // Initial active button


    const handleFatch = useCallback(async () => {
        setIsProcessing(true)
        try {
            const url = process.env.REACT_APP_BETTENSOR_VALIDATORS_END_POINT;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // data.sort((a, b) => a.name.localeCompare(b.name));
            data.sort((a, b) => b.total_stake - a.total_stake);

            // Get the top ten validators
            const topTenValidators = data.slice(0, 14);
            setDocuments(topTenValidators)
            setIsProcessing(false)
        } catch (error) {
            // console.error('Error fetching data:', error);
            message.error('Failed to fetch data. Please try again later.')
            setIsProcessing(false)
            return null;
        }
    }, [])

    useEffect(() => {
        handleFatch()
    }, [handleFatch])


    useEffect(() => {
        setAccount(state.accounts.length > 0 ? state.accounts[0] : "")
    }, [state])

    useEffect(() => {
        if (state.accounts.length > 0) {
            setValidator(documents.length > 0 ? documents.find((item) => item.name === "FirstTensor.com") : "")
        }
        // eslint-disable-next-line
    }, [state])

    // const handleCurrentAPY = (value) => {
    //     const currentApyValue = documents.find((validator) => validator.name === value);
    //     setCurrentAPY(currentApyValue);
    // }

    const handleStakeValidator = (value) => {
        const validator = documents.find((validator) => validator.name === value);
        setValidator(validator)
    }

    const handleAccounts = (value) => {
        const userAccounts = state.accounts.find(account => account.address === value)
        setAccount(userAccounts)
    }

    const handleTotalBalanceMax = () => {
        const getTotalBalance = totalBalance;
        setAmount(getTotalBalance)
    }

    const handleCurrentStakeMax = () => {
        const getCurrentStake = stakeAmount;
        setAmount(getCurrentStake)
    }

    useEffect(() => {
        const taoToRao = amount * 1000000000;
        setRao(taoToRao)
    }, [amount])

//     const dataWithKeys = documents
//         ?.filter((record) => record.nominators !== 0 && record.total_stake >= 1000)
//         .filter((record) => record.name !== 'Datura'&& record.name !== 'Owl Ventures' && record.name !== 'Tensorplex Labs') // Remove the Datura record
//         .map((record) => ({
//             ...record,
//             key: record.details?.hot_key?.toString(), // Use optional chaining for safety
//         }));

// const firstTensorRecord = dataWithKeys?.find(record => record.name === 'FirstTensor.com');
// const otherRecords = dataWithKeys?.filter(record => record.name !== 'FirstTensor.com');

// // Reorder data
// const reorderedDataWithKeys = firstTensorRecord ? [firstTensorRecord, ...otherRecords] : dataWithKeys;
// console.log("reorderedDataWithKeys",reorderedDataWithKeys)

const dataWithKeys = documents
    ?.filter((record) => record.nominators !== 0 && record.total_stake >= 1000)
    .filter((record) => record.name !== 'Datura' && record.name !== 'Owl Ventures' && record.name !== 'Tensorplex Labs')
    .map((record) => {
        let customAPR = record.apr_average; // Default APR
        
        // Set custom APR for specific records
        if (record.name === 'FirstTensor.com') {
            customAPR = 17.49; // Custom APR for FirstTensor.com
        } else if (record.name === 'RoundTable21') {
            customAPR = 15.68; // Custom APR for RoundTable
        }

        return {
            ...record,
            apr_average: customAPR, // Assign custom or default APR
            key: record.details?.hot_key?.toString(), // Use optional chaining for safety
        };
    });

// Reorder data
const firstTensorRecord = dataWithKeys?.find(record => record.name === 'FirstTensor.com');
const otherRecords = dataWithKeys?.filter(record => record.name !== 'FirstTensor.com');

const reorderedDataWithKeys = firstTensorRecord ? [firstTensorRecord, ...otherRecords] : dataWithKeys;

// console.log('reorderedDataWithKeys', reorderedDataWithKeys)
const handleCurrentAPY = (value) => {
    const currentApyValue = reorderedDataWithKeys.find((validator) => validator.name === value);
    setCurrentAPY(currentApyValue);
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, row) => {
            const isFirstTensor = row.name === 'FirstTensor.com';
            return (
                <span
                    className={`${theme === "dark" && "text-white"}`}
                    style={{ fontWeight: isFirstTensor ? 'bold' : 'normal' }}
                >
                    {row?.name}
                </span>
            );
        },
        fixed: 'left',
    },
    {
        title: "APR (Avg 30 days)",
        sorter: (a, b) => b.apr_average - a.apr_average,
        render: (_, row) => {
            const isTensorValidator = row.name === 'FirstTensor.com';
            return (
                <>
                    {isTensorValidator ? (
                        <Tooltip title="The APR percentage takes into account the extra APR that results from tax returns">
                            <span className='d-flex justify-content-between fw-bold'>
                                {row.apr_average?.toFixed(2)}%<InfoCircleOutlined className='d-flex flex-end' />
                            </span>
                        </Tooltip>
                    ) : (
                        <Text className={`${theme === 'dark' && 'text-white '}`}>{row.apr_average?.toFixed(2)}%</Text>
                    )}
                </>
            );
        },
    },
    {
        title: 'Fees',
        sorter: (a, b) => a.fees - b.fees,
        render: (_, row) => {
            const isTensorValidator = row.name === "FirstTensor.com";
            return (
                <>
                    {isTensorValidator ? (
                        <Text className={`fw-bold ${theme === "dark" && "text-white"}`}>{row.fees}%</Text>
                    ) : (
                        <Text className={`${theme === "dark" && "text-white"}`}>{row.fees}%</Text>
                    )}
                </>
            );
        },
    },
    {
        title: 'Tax Return',
        render: (_, row) => {
            const isTensorValidator = row.name === "FirstTensor.com";
            return (
                <>
                    {isTensorValidator ? (
                        <Tooltip title="Please check the conditions on the validator's website">
                            <span className='d-flex justify-content-between fw-bold'>
                                Yes <InfoCircleOutlined className='d-flex flex-end' />
                            </span>
                        </Tooltip>
                    ) : (
                        <Text className={`${theme === "dark" && "text-white"}`}>No</Text>
                    )}
                </>
            );
        },
    },
    {
        title: 'Total Staked',
        dataIndex: 'total_stake',
        render: (_, row) => {
            const isTensorValidator = row.name === "FirstTensor.com";
            return (
                <>
                    {isTensorValidator ? (
                        <Text className={`fw-bold ${theme === "dark" && "text-white"}`}>{parseInt(row?.total_stake).toLocaleString('en-US')} TAO</Text>
                    ) : (
                        <Text className={`${theme === "dark" && "text-white"}`}>{parseInt(row?.total_stake).toLocaleString('en-US')} TAO</Text>
                    )}
                </>
            );
        },
    },
    {
        title: 'Nominators',
        dataIndex: 'nominators',
        render: (_, row) => {
            const isTensorValidator = row.name === "FirstTensor.com";
            return (
                <>
                    {isTensorValidator ? (
                        <Text className={`fw-bold ${theme === "dark" && "text-white"}`}>{row?.nominators}</Text>
                    ) : (
                        <Text className={`${theme === "dark" && "text-white"}`}>{row?.nominators}</Text>
                    )}
                </>
            );
        },
    },
];

    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    }

    const handleStakeCalculator = () => {
        if (!currentAPY.apr_average) {
            return message.error("Please select a validator")
        }
        if (taoAmount <= 0) {
            return message.error("Please enter tao amount")
        }
        if (!currentAPY) {
            console.error('No APY data available.');
            return;
        }

        const apr = currentAPY.apr_average;
        // const commission = currentAPY.commission;

        if (isNaN(apr)) {
            console.error('Invalid APY ');
            return;
        }

        const calculateWithAPR = Number(taoAmount) * (apr / 100)
        // const calculateWithcommsion = calculateWithAPY * commission
        // console.log('calculateWithAPR', calculateWithAPR)
        // const yearRewards = calculateWithAPY - calculateWithcommsion
        setYearReward(calculateWithAPR)
        const monthlyReward = (calculateWithAPR / 12)
        setMonthlyReward(monthlyReward)

    }
    // const handleStakeCalculator = () => {
    //     if (!currentAPY.apy) {
    //         return message.error("Please select a validator")
    //     }
    //     if (taoAmount <= 0) {
    //         return message.error("Please enter tao amount")
    //     }
    //     if (!currentAPY) {
    //         console.error('No APY data available.');
    //         return;
    //     }

    //     const apy = currentAPY.apy.toFixed(2);
    //     const commission = currentAPY.commission;

    //     if (isNaN(apy) || isNaN(commission)) {
    //         console.error('Invalid APY or commission values.');
    //         return;
    //     }

    //     const calculateWithAPY = Number(taoAmount) * (apy / 100)
    //     const calculateWithcommsion = calculateWithAPY * commission

    //     const yearRewards = calculateWithAPY - calculateWithcommsion
    //     setYearReward(yearRewards)
    //     const monthlyReward = (yearRewards / 12)
    //     setMonthlyReward(monthlyReward)

    // }

    // Retrieve the last timestamp
        // const now = await api.query.timestamp.now();
        // Retrieve the account balance & nonce via the system module

    // setIsLoading(false)
        // console.log('balance', Number(balance.free.toString()))
        // setBalance(Number(balance.free.toString()))
        // console.log(api.genesisHash.toHex());


    const handleBalance = async () => {
        setIsLoading(true)
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
    
        const { data: balance } = await api.query.system.account(ADDR);
        // console.log(` balance of ${balance.free}`);
        const orginalBalance = (balance.free - 500);
        const balan = Number(orginalBalance) / 1000000000;
        setTotalBalance(balan)
        
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

    const fatchAllStakeValidators = async () => {
        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });
        setIsLoading(true)

        const stakeAmountValidators = []
        for (const validator of documents) { // Corrected variable name from 'object' to 'data'
            const res = await api.query.subtensorModule.stake(validator.details.hot_key, account?.address);

            let stakeAmount = 0;
            if (!res.isEmpty) {
                stakeAmount = parseFloat(res.toString()) / 1000000000;
            }
            if (stakeAmount > 0) {
                stakeAmountValidators.push({
                    name: validator.name,
                    stakeAmount: stakeAmount,
                });
            }
        }
        setAllStakeValidators(stakeAmountValidators)
        setIsLoading(false)

    }
    useEffect(() => {
        if (state.accounts.length > 0) {
            fatchAllStakeValidators()
        }
        // eslint-disable-next-line
    }, [account, totalBalance])

    const delegateStake = async () => {

        if (!state.accounts.length > 0) {
            message.error('No wallet available, please connect your Polkadot wallet first.')
            return;
        }
        if (!validator.name) { return message.error('Please select a validator') }

        if (amount === 0 || amount <= 0 || !amount || amount > totalBalance) { return message.error('Your wallet has insufficient TAO to stake the requested amount.') }

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

        const data = {
            wallet_address: selectedAccount.address,
            amount: amount,
            action: "delegate",
            validator: validator.name,
        }

        try {
            await transferExtrinsic.signAndSend(account.address, { signer: injector.signer }, async ({ status })  => {

                const res = await api.query.subtensorModule.stake(validator.details.hot_key, account?.address);
                let newStakeBalance = 0
                if (!res.isEmpty) {
                    newStakeBalance = parseFloat(res.toString()) / 1000000000;
                }

                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    if (status.type === 'Finalized') {
                        if (newStakeBalance > stakeAmount) {
                            handleBalance()
                            fetchStakeAmount()
                            setAmount(0)
                            setStatus(`Current status: ${status.type}`);
                            setIsFinalize(false)
                            // console.log("delegaet_status",status)
                            // console.log(`You have successfully delegated ${amount}τ to ${validator.name}.`);
                            postDelegateInfo(data)
                            
                        } else {
                            setStatus('You can stake TAO in 1h');
                            setIsFinalize(false)
                        }
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
        if (!validator.name) { return message.error('Please select a validator') }

        if (amount === 0 || amount <= 0 || !amount) { return message.error('Invalid undelegation amount. Please enter a valid amount.') }
        if (amount > stakeAmount) { return message.error('The undelegate amount you requested is more than the delegated amount with validator.') }

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

        const data = {
            wallet_address: selectedAccount.address,
            amount: amount,
            action: "undelegate",
            validator: validator.name,
        }

        try {
            await undelegateExtrinsic.signAndSend(account.address, { signer: injector.signer }, async({ status }) => {

                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    if (status.type === 'Finalized') {
                        const res = await api.query.subtensorModule.stake(validator.details.hot_key, account?.address);

                        let newStakeBalance = 0
                        if (!res.isEmpty) {
                        newStakeBalance = parseFloat(res.toString()) / 1000000000;
                        }

                        if (newStakeBalance < stakeAmount) {
                            handleBalance()
                            fetchStakeAmount()
                            setAmount(0)
                            setStatus(`Current status: ${status.type}`);
                            setIsFinalize1(false)
                            // console.log("delegaet_status",status)
                            // console.log(`You have successfully delegated ${amount}τ to ${validator.name}.`);
                            postDelegateInfo(data)
                            
                        } else {
                            setStatus('You can unstake TAO in 1h');
                            setIsFinalize1(false)
                        }
                    }
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
            setIsFinalize1(false);
        }
    };

    const postDelegateInfo = async (delegateInfo) => {

        const url = process.env.REACT_APP_BITTENSOR_DELEGATE_STATUS

        try {
            const response = await axios.post(url, delegateInfo);

            if (response.status === 200) {
                // console.log(response); // Handle the response data as needed
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

    };

    return (
        <div className={`home dashboard ${theme} min-vh-100`}>
            <div className="container-fluid px-xxl-5 px-lg-4 py-5">
                <div className="px-xxl-5 custom-lg-padding custom-xxl-padding">
                    {
                        isSkeleton ?
                            (
                                <Row gutter={[16, 16]} className='mb-4'>
                                    <Col xs={24} sm={12} md={12} lg={6}>
                                        <div className="card p-3 shadow bg-primary" >
                                            <Space>
                                                <Skeleton.Avatar active size="default" shape='square' />
                                                <Skeleton.Input active size='default' />
                                            </Space>
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={6}>
                                        <div className="card p-3 shadow bg-primary" >
                                            <Space>
                                                <Skeleton.Avatar active size="default" shape='square' />
                                                <Skeleton.Input active size='default' />
                                            </Space>
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={6}>
                                        <div className="card p-3 shadow bg-primary" >
                                            <Space>
                                                <Skeleton.Avatar active size="default" shape='square' />
                                                <Skeleton.Input active size='default' />
                                            </Space>
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={6}>
                                        <div className="card p-3 shadow bg-primary" >
                                            <Space>
                                                <Skeleton.Avatar active size="default" shape='square' />
                                                <Skeleton.Input active size='default' />
                                            </Space>
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                            <br />
                                            <Skeleton.Input active size='small' block='false' />
                                        </div>
                                    </Col>
                                </Row>
                            )
                            :
                            (
                                taoInfo?.map((item, i) => {
                                    return <Row key={i} gutter={[16, 16]} className='mb-4'>
                                        <Col xs={24} sm={12} md={12} lg={6}>
                                            <div className={`card p-3 ${theme === "dark" ? "bg-white text-primary border-0" : "shadow bg-primary text-white"} h-100`}>
                                                <div className='d-flex mb-2'>
                                                    <MdOutlinePriceCheck className='fs-5 me-2' />
                                                    <Title level={5} style={{ fontWeight: 'unset' }} className={`fontFamily mb-0 ${theme === "dark" ? "text-primary" : "text-white"}`}>Current Price</Title>
                                                </div>
                                                <div>
                                                    <Title level={5} style={{ fontSize: "20px" }} className={`fontFamily ${theme === "dark" ? "text-primary" : "text-white"}`}>$ {item?.current_price}</Title>
                                                </div>
                                                <div>
                                                    <Typography className={`fontFamily fw-bold ${theme === "dark" ? "text-primary" : "text-white"}`}>24h Volume: $ {Math.floor(parseFloat(item?.volume_24h)).toLocaleString('de-DE')}</Typography>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={12} lg={6}>
                                            <div className={`card p-3 ${theme === "dark" ? "bg-white text-primary border-0" : "shadow bg-primary text-white"} h-100`}>
                                                <div className='d-flex mb-2'>
                                                    <SiCoinmarketcap className='fs-5 me-2' />
                                                    <Title level={5} style={{ fontWeight: 'unset' }} className={`fontFamily mb-0 ${theme === "dark" ? "text-primary" : "text-white"}`}>Market Cap</Title>
                                                </div>
                                                <div>
                                                    <Title level={5} style={{ fontSize: "20px" }} className={`fontFamily ${theme === "dark" ? "text-primary" : "text-white"}`}>
                                                        $ {Math.floor(parseFloat(item?.market_cap)).toLocaleString('de-DE')}
                                                    </Title>
                                                </div>
                                                <div>
                                                    <Typography className={`fontFamily fw-bold ${theme === "dark" ? "text-primary" : "text-white"}`}>
                                                        24h Change: {item && item.change_24h < 0 ? (
                                                            <span className='fw-bold' style={{ color: 'red' }}>
                                                                <HiMiniArrowLongDown /> {item.change_24h.toFixed(2)}
                                                            </span>
                                                        ) : (
                                                            <span className='fw-bold' style={{ color: "#22b14c" }}> <HiMiniArrowLongUp /> {item.change_24h.toFixed(2)}</span>
                                                        )}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={12} lg={6}>
                                            <div className={`card p-3 ${theme === "dark" ? "bg-white text-primary border-0" : "shadow bg-primary text-white"} h-100`}>
                                                <div className='d-flex mb-2'>
                                                    <TbAnalyze className='fs-5 me-2' />
                                                    <Title level={5} style={{ fontWeight: 'unset' }} className={`fontFamily mb-0 ${theme === "dark" ? "text-primary" : "text-white"}`}>Circulating Supply</Title>
                                                </div>
                                                <div>
                                                    <Title level={5} style={{ fontSize: "20px" }} className={`fontFamily ${theme === "dark" ? "text-primary" : "text-white"}`}>
                                                        {Math.floor(parseFloat(item?.circulating_supply)).toLocaleString('de-DE')} TAO
                                                    </Title>
                                                </div>
                                                <div>
                                                    <Typography className={`fontFamily fw-bold ${theme === "dark" ? "text-primary" : "text-white"}`}>
                                                        Total Supply: {Math.floor(parseFloat(item?.total_supply)).toLocaleString('de-DE')} TAO
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={12} lg={6}>
                                            <div className={`card p-3 ${theme === "dark" ? "bg-white text-primary border-0" : "shadow bg-primary text-white"} h-100`}>
                                                <div className='d-flex  mb-2'>
                                                    <TbBrandGoogleAnalytics className='fs-5 me-2' />
                                                    <Title level={5} style={{ fontWeight: 'unset' }} className={`fontFamily  mb-0 ${theme === "dark" ? "text-primary" : "text-white"}`}>Supply Staked</Title>
                                                </div>
                                                <div>
                                                    <Title level={5} style={{ fontSize: "20px" }} className={`fontFamily ${theme === "dark" ? "text-primary" : "text-white"}`}>{Math.floor(parseFloat(item?.total_stakes)).toLocaleString('de-DE')} TAO</Title>
                                                </div>
                                                <div>
                                                    <Typography className={`fontFamily fw-bold ${theme === "dark" ? "text-primary" : "text-white"}`}>Percentage Staked: {item.percent_staked?.toFixed(1)}%</Typography>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                })
                            )
                    }


                    <div className="py-3 ">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={24} lg={16} xxl={18}>
                                <div className={`fontFamily ${theme === "dark" ? "card p-3 bg-secondary border-0" : "card p-3 shadow"} h-100`}>
                                    <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Bittensor Validators</Title>
                                    <Table columns={columns} bordered dataSource={reorderedDataWithKeys} loading={isProcessing} onChange={onChange} scroll={{ x: true }} className={`${theme === "dark" ? "dark-table" : "light-table"}`}
                                        expandable={{
                                            expandedRowRender: (record) => {
                                                const absoluteUrl = record.details?.url.startsWith('http') ? record.details?.url : `https://${record.details?.url}`;
                                                return (
                                                    <div className='px-5'>
                                                        <Text className={theme === "dark" && "text-white"}><span className="fw-bold">Description:</span> {record.details?.description}</Text> <br />
                                                        <Text className={theme === "dark" && "text-white"}><span className="fw-bold">Hotkey:</span> {record.details?.hot_key}</Text> <br />
                                                        <Text className={theme === "dark" && "text-white"}><span className="fw-bold">Website:</span> <a href={absoluteUrl} target="_blank" rel="noopener noreferrer">{record.details?.url}</a></Text>
                                                    </div>
                                                )
                                            },
                                            rowExpandable: (record) => record.name !== 'Not Expandable',
                                        }}
                                        pagination={{ pageSize: 14 }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={8} xxl={6}>
                                <div className='mb-3 staking-calculator'>
                                    <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                        <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Staking Calculator</Title>
                                        {/* <div className='card border-0 p-3 mb-3' style={{ backgroundColor: "#4caf50" }}>
                                            <div className='d-flex justify-content-between'>
                                                <Text className='fontFamily fw-bold'>Current APY</Text>
                                                <Text className='fontFamily fw-bold'>{documents[0]?.apy.toFixed(2) || 0}%</Text>
                                            </div>
                                        </div> */}
                                        <div style={{ width: "100%" }} className='mb-3'>
                                            <Space>
                                                <Space.Compact >
                                                    <Select placeholder="Select Validator" style={{ width: "50%" }} className={`dashboard ${theme} ${theme === "dark" && "dark-dropdown"}`}
                                                        showSearch
                                                        value={currentAPY.name}
                                                        onChange={handleCurrentAPY}
                                                        filterOption={(input, option) =>
                                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        options={reorderedDataWithKeys?.map(item => ({ value: item.name, label: item.name }))}
                                                    />
                                                    <Input type='number' onChange={(e) => setTaoAmount(e.target.value)} placeholder='TAO Amount' className={`rtl-input ${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                                </Space.Compact>
                                            </Space>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily  ${theme === "dark" && "text-white"}`}>APR</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{currentAPY?.apr_average || 0}%</Text>
                                            </div>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Monthly Rewards</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{monthlyReward.toFixed(2)} TAO</Text>
                                            </div>
                                        </div>
                                        <div className={`p-3 mb-3 ${theme === "dark" ? "card bg-secondary border-1" : "card"}`}>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Yearly Rewards</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{yearReward.toFixed(2)} TAO</Text>
                                            </div>
                                        </div>
                                        <div>
                                            <Button type={`${theme === "dark" ? "default" : "primary"}`} className='w-100 fontFamily text-uppercase' size='large' onClick={handleStakeCalculator}>Calculate</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className='stake-tao'>
                                    <div className={`fontFamily card p-3 ${theme === "dark" ? "bg-secondary border-0" : "shadow"} h-100`}>
                                    {status && (
                                    <Alert message={status} type={status.includes("failed") || status.includes("1h") ? "error" : "success"}  showIcon className='mb-2' /> )}
                                        {/* {status && <Alert message={`${status}`} type={status || "Transaction failed" || "There was an issue undelegating funds." ? "error" : "success"} showIcon className='mb-2' />} */}
                                        <Title level={4} className={`fontFamily ${theme === "dark" ? "text-uppercase text-white mb-3" : "text-uppercase text-primary mb-3"}`}>Stake Tao</Title>
                                        <div className='d-flex justify-content-between mb-3'>
                                            {
                                                theme === 'dark' ?
                                                    <>
                                                        <Button
                                                            type={`${activeButton === "delegate" ? "default" : ""}`}
                                                            className={`text-uppercase fontFamily ${activeButton === "undelegate" && "text-white"}`}
                                                            onClick={() => setActiveButton('delegate')}
                                                        >
                                                            Delegate
                                                        </Button>
                                                        <Button
                                                            type={`${activeButton === "undelegate" ? "default" : ""}`}
                                                            className={`text-uppercase fontFamily ${activeButton === "delegate" && "text-white"}`}
                                                            onClick={() => setActiveButton('undelegate')}
                                                        >
                                                            UnDelegate
                                                        </Button>

                                                    </>
                                                    :
                                                    <>
                                                        <Button
                                                            type={`${activeButton === "delegate" ? "primary" : ""}`}
                                                            className={`text-uppercase fontFamily`}
                                                            onClick={() => setActiveButton('delegate')}
                                                        >
                                                            Delegate
                                                        </Button>
                                                        <Button
                                                            type={`${activeButton === "undelegate" ? "primary" : ""}`}
                                                            className={`text-uppercase fontFamily`}
                                                            onClick={() => setActiveButton('undelegate')}
                                                        >
                                                            UnDelegate
                                                        </Button>
                                                    </>
                                            }
                                        </div>
                                        <div className='mb-2'>
                                            <Form layout="vertical">
                                                <Form.Item label="Account" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`}>
                                                    <Select
                                                        className={`fontFamily ${theme === "dark" && "dark-dropdown select-placeholder"}`}
                                                        style={{ width: "100%" }}
                                                        placeholder="Select Account"
                                                        value={account.meta?.name}
                                                        onChange={(value) => handleAccounts(value)}
                                                    >
                                                        {state?.accounts.map((account) =>
                                                            <Option key={account.address} value={account.address}>{account.meta?.name}</Option>
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="Validator" className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} >
                                                    <Select
                                                        className={`fontFamily ${theme === "dark" && "dark-dropdown select-placeholder"}`}
                                                        style={{ width: "100%" }}
                                                        showSearch
                                                        placeholder="Select Validator"
                                                        value={validator.name}
                                                        onChange={handleStakeValidator}
                                                        filterOption={(input, option) =>
                                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        options={dataWithKeys?.map(item => ({ value: item.name, label: item.name }))}
                                                    />
                                                </Form.Item>
                                                <Form.Item label={`${activeButton === "delegate" ? "Amount to Delegate" : " Amount to Undelegate"}`} className={`fw-bold fontFamily  ${theme === "dark" && "input-label"}`} name="Amount">
                                                    <div className="input-with-button" style={{ width: "100%" }}>
                                                        <Input placeholder="Amount" name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} type='number' className={`${theme === "dark" ? "bg-secondary text-white input-placeholder" : ""}`} />
                                                        {activeButton === 'delegate' ?
                                                            <button className={`${theme === "dark" ? "btn btn-sm bg-white fontFamily" : "btn btn-sm btn-primary text-white fontFamily"}`} onClick={handleTotalBalanceMax}>MAX</button>
                                                            :
                                                            <button className={`${theme === "dark" ? "btn btn-sm bg-white fontFamily" : "btn btn-sm btn-primary text-white fontFamily"}`} onClick={handleCurrentStakeMax}>MAX</button>
                                                        }
                                                    </div>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                        <div className='mb-3'>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Balance</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{totalBalance || 0} TAO</Text>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <div className="d-flex justify-content-between">
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>Current Stake</Text>
                                                <Text className={`fontFamily ${theme === "dark" && "text-white"}`}>{stakeAmount} TAO</Text>
                                            </div>
                                        </div>

                                        <div className='mb-3' >
                                            {
                                                activeButton === "delegate" ?
                                                    <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`w-100 fontFamily text-uppercase`} size='large' loading={isFinalize} onClick={delegateStake}>Delegate</Button>
                                                    :
                                                    <Button type={`${theme === "dark" ? "default" : "primary"}`} className={`w-100 fontFamily text-uppercase`} size='large' loading={isFinalize1} onClick={handleUndelegate}>Undelegate</Button>
                                            }
                                        </div>
                                        <div>
                                            {state?.accounts.length > 0 && <Title level={4} className={`fontFamily text-uppercase ${theme === "dark" && "text-white"}`}>Delegated Balance</Title>}
                                            {
                                                isLoading ? (
                                                    <div className='text-center'>
                                                        <Spin className={`${theme === "dark" && "spinner-dark-mode"}`} />
                                                    </div>
                                                ) : (
                                                    state?.accounts.length > 0 && allStakeValidators.length === 0 ? (
                                                        <div className={`${theme === "dark" && "text-white"}`}>You don't have any TAO delegated yet.</div>
                                                    ) : (
                                                        allStakeValidators.map((validator, i) => (
                                                            <div key={i} className='d-flex justify-content-between'>
                                                                <p className={`mb-1 ${theme === "dark" && "text-white"}`}>{validator.name}</p>
                                                                <p className={`mb-1 ${theme === "dark" && "text-white"}`}>{validator.stakeAmount} TAO</p>
                                                            </div>
                                                        ))
                                                    )
                                                )
                                            }
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
