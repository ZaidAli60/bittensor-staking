import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Typography, message } from 'antd';
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
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setAccountAddress(state.accounts.length > 0 ? state.accounts[0]?.address : "")
    }, [state])

    const handleFatch = useCallback(async () => {
        setIsProcessing(true)
        try {
            const url = 'https://raw.githubusercontent.com/opentensor/bittensor-delegates/master/public/delegates.json';
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
            message.error("No accounts available from WalletConnect. Please check your connection.")
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Hot Key',
            dataIndex: 'key',
            sorter: (a, b) => a.key.localeCompare(b.key),

        },
        // {
        //     title: 'Total Amount Stake',
        //     dataIndex: '',
        //     sorter: {
        //         compare: (a, b) => a.totalAmountStake - b.totalAmountStake,
        //         multiple: 2,
        //     },
        // },
        // {
        //     title: 'Delegators',
        //     dataIndex: '',
        //     sorter: (a, b) => a.delegators.localeCompare(b.delegators),

        // },
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

        const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
        const api = await ApiPromise.create({ provider: wsProvider });
        // The actual address that we will use
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

        const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
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
    }, [modalOpen])

    const delegateStake = async () => {

        const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }
        const transferExtrinsic = api.tx.subtensorModule.addStake(validator.key, rao)
        const selectedAccount = state?.accounts.find((item) => item.address === accountAddress);

        const injector = await web3FromSource(selectedAccount.meta.source);

        setLoading(true);
        setStatus('Transaction is being processed...');

        try {
            await transferExtrinsic.signAndSend(accountAddress, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    setStatus(`You have just delegated ${stake}τ from ${validator.name}`);
                    handleBalance()
                    fatchStakeAmount()
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
        } finally {
            // Remove loading state
            setLoading(false);
        }
    };

    const handleUndelegate = async () => {

        const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
        const api = await ApiPromise.create({ provider: wsProvider });

        if (!api) {
            console.error('API not initialized');
            return;
        }

        const undelegateExtrinsic = api.tx.subtensorModule.removeStake(validator.key, rao)

        const selectedAccount = state?.accounts.find((item) => item.address === accountAddress);

        const injector = await web3FromSource(selectedAccount.meta.source);

        setLoading(true);
        setStatus('Transaction is being processed...');

        try {
            await undelegateExtrinsic.signAndSend(accountAddress, { signer: injector.signer }, ({ status }) => {
                if (status.isInBlock) {
                    setStatus(`Status In Block`);
                } else {
                    setStatus(`Current status: ${status.type}`);
                    setStatus(`You have just Undelegated ${stake}τ from ${validator.name}`);
                    fatchStakeAmount()
                    handleBalance()
                }
            })
        } catch (error) {
            setStatus('Transaction failed');
            console.error(':( Transaction failed', error);
        } finally {
            // Remove loading state
            setLoading(false);
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

    return (
        <div className='vh-100'>
            <div className="py-3">
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
                        <Form.Item label="Account" className='mb-1 fw-bold' required   >
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
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Button type='primary' loading={loading} className='text-uppercase' style={{ width: "100%" }} disabled={stake === 0 || stake <= 0 || !stake || stake > totalBalance} onClick={delegateStake}>Delegate</Button>
                            </Col>
                            <Col xs={12}>
                                <Button type='primary' loading={loading} className='text-uppercase' style={{ width: "100%" }} disabled={stake === 0 || stake <= 0 || !stake || stake > stakeAmount} onClick={handleUndelegate}>Undelegate</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
