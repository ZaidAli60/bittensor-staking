import { ApiPromise, WsProvider } from '@polkadot/api';
import { Button, Form, Input, Typography, message } from 'antd';
import React, { useState } from 'react'

const { Title } = Typography

export default function Balance() {

    const [pubKey, setPubKey] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [taoBalance, setTaoBalance] = useState(0)

    const handleGetBalance = async () => {
        setIsProcessing(true)
        try {
            const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
            const api = await ApiPromise.create({ provider: wsProvider });
            if (!api) {
                message.error('API not initialized')
                return;
            }
            const address = pubKey.trim();
            const accountInfo = await api.derive.balances.account(address);
            const taoRaoBalance = accountInfo.freeBalance.toString()
            const balan = Number(taoRaoBalance) / 1000000000;
            setTaoBalance(balan)
            setIsProcessing(false)
            setPubKey("")
        } catch (error) {
            message.error(error)
            console.error('Error:', error);
        } finally {
            setIsProcessing(false)
        }
    };

    return (
        <div className=''>
            <Title level={3} className='text-primary fw-bold'>Check Tao Balance</Title>
            <div className='flex-center align-center' style={{ height: "80vh" }}>
                <div className="card p-3" style={{ width: "100%", maxWidth: "40rem" }}>
                    <Title level={4} className='fw-bold text-info text-center'>{taoBalance.toFixed(2)}𝞃</Title>
                    <Form layout='vertical'>
                        <Form.Item label="Public Key" className='mb-3 fw-bold' required>
                            <Input placeholder='Enter Your Pub Key' name='pubKey' value={pubKey} onChange={(e) => setPubKey(e.target.value)} />
                        </Form.Item>
                        <Button type="primary" loading={isProcessing} onClick={handleGetBalance}>Submit</Button>
                    </Form>
                </div>
            </div>
        </div>

    )
}
