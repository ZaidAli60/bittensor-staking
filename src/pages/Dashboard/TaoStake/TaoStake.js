import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Typography, message } from 'antd';
import { useConnectWallet } from 'context/ConnectWalletContext';

const { Title } = Typography;
const { Option } = Select;

export default function TaoStake() {

    const { state } = useConnectWallet()
    const [validators, setValidators] = useState({});
    const [isProcessing, setIsProcessing] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [validator, setValidator] = useState({})
    const [accountAddress, setAccountAddress] = useState("")

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
        {
            title: 'Total Amount Stake',
            dataIndex: '',
            sorter: {
                compare: (a, b) => a.totalAmountStake - b.totalAmountStake,
                multiple: 2,
            },
        },
        {
            title: 'Delegators',
            dataIndex: '',
            sorter: (a, b) => a.delegators.localeCompare(b.delegators),

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
                    <Form layout='vertical'>
                        <Form.Item label="Account" className='mb-1 fw-bold' required   >
                            <Select style={{ width: "100%" }} value={accountAddress} onChange={(selectValue) => setAccountAddress(selectValue)}>
                                {state.accounts.map((account) =>
                                    <Option key={account.address} value={account.address}>{account.meta?.name}</Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Typography className='mb-3'>Available Balance : <span className='text-info fw-bold'>0.001𝞃</span></Typography>
                        <Form.Item label="Validator" className='fw-bold mb-0' required>
                            <Input value={validator.name} />
                        </Form.Item>
                        <Typography className='mb-3'>Delegated Stake : <span className='text-info fw-bold'>0.001𝞃</span></Typography>
                        <Form.Item>
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Button type='primary' className='text-uppercase' style={{ width: "100%" }}>Delegate</Button>
                            </Col>
                            <Col xs={12}>
                                <Button type='primary' className='text-uppercase' style={{ width: "100%" }}>Undelegate</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
