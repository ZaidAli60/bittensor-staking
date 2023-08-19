import { Table, Typography } from 'antd';
import { useValidatorsContext } from 'context/ValidatorsContext';
import React from 'react'

const { Title } = Typography;

export default function TaoStake() {

    const { validators } = useValidatorsContext()
    console.log('validators', validators)

    const dataSource = Object.keys(validators).map((address) => ({
        key: address,
        name: validators[address].name,
        url: validators[address].url,
        description: validators[address].description,
    }));

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Hot Key',
            dataIndex: 'key',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
                multiple: 3,
            },
        },
        {
            title: 'URL',
            dataIndex: 'url',
            sorter: {
                compare: (a, b) => a.math - b.math,
                multiple: 2,
            },
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };



    return (
        <div className='vh-100'>
            <div className="card p-3">
                <Title level={4} className='text-uppercase text-primary mb-3'>Bittensor Validators</Title>
                <Table columns={columns} dataSource={dataSource} bordered onChange={onChange} scroll={{ x: true }} />
            </div>
        </div>
    )
}
