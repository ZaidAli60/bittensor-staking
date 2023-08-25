import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Table, Typography, message } from 'antd';
import { useConnectWallet } from 'context/ConnectWalletContext';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';

const { Title } = Typography;
const { Option } = Select;

export default function TaoStake() {
    const { state } = useConnectWallet()
    const [validators, setValidators] = useState({});
    const [isProcessing, setIsProcessing] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [validator, setValidator] = useState({})
    const [accountAddress, setAccountAddress] = useState("")
    const [stake, setStake] = useState(0)
    const [totalBalance, setTotalBalance] = useState(null)
    const [rao, setRao] = useState(null)
    const [stakeAmount, setStakeAmount] = useState(null)
    const [status, setStatus] = useState('');
    const [allStakeValidators, setAllStakeValidators] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFinalize, setIsFinalize] = useState(false)
    const [isFinalize1, setIsFinalize1] = useState(false)

    useEffect(() => {
        setAccountAddress(state.accounts.length > 0 ? state.accounts[0]?.address : "")
    }, [state])

    const handleFatch = useCallback(async () => {
        setIsProcessing(true)
        try {
            const url = process.env.REACT_APP_BETTENSOR_VALIDATORS_END_POINT;
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

    const firstValidatorData = {
        description: "Powered by the Neuron Holders community - shared rewards, additional benefits, infinite possibilities - join and build with us!",
        name: "FirstTensor.com",
        signature: "da31e56dd78cde449a1dd9592f0b53eb8c3662674b745a05ff916e80a1be933e86efbccb7f7c9b81d7c0bb14d13fb4a6bf8484c3619224e689de82072b5d9a87",
        url: "www.firsttensor.com",
        key: "5DvTpiniW9s3APmHRYn8FroUWyfnLtrsid5Mtn5EwMXHN2ed"
    };

    const dataSource = [
        {
            key: firstValidatorData.key, // You can use any unique identifier for the key
            description: firstValidatorData.description,
            name: firstValidatorData.name,
            signature: firstValidatorData.signature,
            url: firstValidatorData.url,
        },
        ...Object.keys(validators)
            .filter(address => address !== firstValidatorData.key) // Exclude the specific key
            .map((address) => ({
                key: address,
                name: validators[address].name,
                url: validators[address].url,
                description: validators[address].description,
            })),
    ];

    const handleOpenModel = (data) => {
        if (state && state.accounts.length > 0) {
            setValidator(data)
            setModalOpen(true)
        } else {
            message.error("No wallet available, please connect your Polkadot wallet first.")
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Info',
            sorter: (a, b) => a.key.localeCompare(b.key),
            render: (_, row) => {
                const websiteUrl = row.url.startsWith('http') ? row.url : `http://${row.url}`;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }} >
                        <Typography style={{ marginBottom: 8 }}>Description: {row.description}</Typography>
                        <Typography style={{ marginBottom: 8 }}>Hot Key: {row.key}</Typography>
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className='text-decoration-none'>
                            Visit Website
                        </a>
                    </div >
                )
            }
        },
        {
            title: 'Total Stake',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nominators',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'APY',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Benefits',
            dataIndex: '',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, row) => {
                return <Button type='primary' onClick={() => handleOpenModel(row)}>Stake</Button>
            }
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    useEffect(() => {
        const taoToRao = stake * 1000000000;
        setRao(taoToRao)
    }, [stake])

    const handleBalance = async () => {

        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });
        const ADDR = accountAddress;
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
    }, [accountAddress])

    const fatchStakeAmount = async () => {

        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });
        const res = await api.query.subtensorModule.stake(validator.key, accountAddress);
        if (res.isEmpty) {
            return setStakeAmount(0)
        }
        else {
            const amount = res.toString() / 1000000000;
            setStakeAmount(amount)
        }
    }

    useEffect(() => {
        if (modalOpen) {
            fatchStakeAmount()
        }
        // eslint-disable-next-line
    }, [modalOpen, accountAddress])

    const delegateStake = async () => {

        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }
        const transferExtrinsic = api.tx.subtensorModule.addStake(validator.key, rao)
        const selectedAccount = state?.accounts.find((item) => item.address === accountAddress);

        const injector = await web3FromSource(selectedAccount.meta.source);
        setIsFinalize(true)
        setStatus('Transaction is being processed...');

        try {
            await transferExtrinsic.signAndSend(accountAddress, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    if (status.type === 'Finalized') {
                        setStatus(`You have just delegated ${stake}τ from ${validator.name}`);
                        handleBalance()
                        fatchStakeAmount()
                        setStatus('')
                        setStake(0)
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

        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }

        const undelegateExtrinsic = api.tx.subtensorModule.removeStake(validator.key, rao)

        const selectedAccount = state?.accounts.find((item) => item.address === accountAddress);

        const injector = await web3FromSource(selectedAccount.meta.source);
        setIsFinalize1(true)
        setStatus('Transaction is being processed...');

        try {
            await undelegateExtrinsic.signAndSend(accountAddress, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    if (status.type === 'Finalized') {
                        setStatus(`Current status: ${status.type}`);
                        setStatus(`You have just Undelegated ${stake}τ from ${validator.name}`);
                        fatchStakeAmount()
                        handleBalance()
                        setStatus('')
                        setStake(0)
                        setIsFinalize1(false)
                    }
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
            setIsFinalize1(false)
        }
    };

    const handleTotalBalanceMax = () => {
        const getTotalBalance = totalBalance;
        setStake(getTotalBalance)
    }
    const handleTotalStakeMax = () => {
        const getStakeAmount = stakeAmount;
        setStake(getStakeAmount)
    }

    const fatchAllStakeValidators = async () => {
        const wsProvider = new WsProvider(process.env.REACT_APP_FINNEY_OPENTENSOR_END_POINT);
        const api = await ApiPromise.create({ provider: wsProvider });
        setIsLoading(true)

        const data = Object.keys(validators).map(key => ({
            key: key,
            name: validators[key].name,
        }));

        const stakeAmountValidators = []

        for (const validator of data) { // Corrected variable name from 'object' to 'data'
            const res = await api.query.subtensorModule.stake(validator.key, accountAddress);

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
    }, [accountAddress, totalBalance])

    return (
        <div className='vh-100'>
            <div className="py-1">
                <div className="card p-3">
                    <Title level={4} className='text-uppercase text-primary mb-3'>Bittensor Validators</Title>
                    <Table columns={columns} bordered dataSource={dataSource} onChange={onChange} scroll={{ x: true }} loading={isProcessing} />
                </div>
            </div>
            <Modal
                title="Tao Stake"
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <div className="py-3">
                    {status && <Alert message={`${status}`} type={status === "Transaction failed" ? "error" : "success"} showIcon className='mb-2' />}

                    <Form layout='vertical'>
                        <Form.Item label="Choose Account" className='mb-1 fw-bold' required   >
                            <Select style={{ width: "100%" }} value={accountAddress} onChange={(selectValue) => setAccountAddress(selectValue)}>
                                {state.accounts.map((account) =>
                                    <Option key={account.address} value={account.address}>{account.meta?.name}</Option>
                                )}
                            </Select>
                        </Form.Item>
                        <div className='d-flex align-items-baseline'>
                            <Typography className='mb-3 me-2'>Available Balance : <span className='text-info fw-bold'>{totalBalance}𝞃</span></Typography>
                            <button className='btn btn-info btn-sm text-white p-0 px-1 m-0' onClick={handleTotalBalanceMax}>Max</button>
                        </div>
                        <Form.Item label="Validator" className='fw-bold mb-1' required>
                            <Input value={validator.name} />
                        </Form.Item>
                        <div className="d-flex align-items-baseline">
                            <Typography className='mb-3 me-2'>Delegated Stake : <span className='text-info fw-bold'>{stakeAmount}𝞃</span></Typography>
                            <button className='btn btn-info btn-sm text-white p-0 px-1 m-0' onClick={handleTotalStakeMax}>Max</button>
                        </div>

                        <Form.Item>
                            <InputNumber style={{ width: "100%" }} name='stake' value={stake} onChange={(value) => setStake(value)} />
                        </Form.Item>
                        <Row gutter={16} className='mb-2'>
                            <Col xs={12}>
                                <Button type='primary' loading={isFinalize} className='text-uppercase' style={{ width: "100%" }} disabled={stake === 0 || stake <= 0 || !stake || stake > totalBalance} onClick={delegateStake}>Delegate</Button>
                            </Col>
                            <Col xs={12}>
                                <Button type='primary' loading={isFinalize1} className='text-uppercase' style={{ width: "100%" }} disabled={stake === 0 || stake <= 0 || !stake || stake > stakeAmount} onClick={handleUndelegate}>Undelegate</Button>
                            </Col>
                        </Row>

                        <div>
                            <Title level={5}>Delegated Stake</Title>
                            {
                                isLoading ? (
                                    <div className='text-center'>
                                        <Spin />
                                    </div>
                                ) : (
                                    allStakeValidators.length === 0 ? (
                                        <div>This wallet has not been delegated yet!</div>
                                    ) : (
                                        allStakeValidators.map((validator, i) => (
                                            <div key={i} className='d-flex justify-content-between'>
                                                <p className='mb-1'>{validator.name}</p>
                                                <p className='mb-1 text-info fw-bold'>{validator.stakeAmount}𝞃</p>
                                            </div>
                                        ))
                                    )
                                )
                            }

                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
