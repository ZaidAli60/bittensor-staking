import { message } from 'antd'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
const TaoInfoProvider = createContext()

export default function TaoInfoContext({ children }) {

    const [taoInfo, setTaoInfo] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    console.log('taoInfo', taoInfo)
    const handleFetch = useCallback(async () => {
        setIsProcessing(true);
        try {
            const url = 'http://3.123.33.186:8000/api/get_data';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json()
            setTaoInfo(data);
        } catch (error) {
            message.error("Something went wrong")
            console.error('Error fetching data:', error);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    return (
        <TaoInfoProvider.Provider value={{ isProcessing, taoInfo }}>
            {children}
        </TaoInfoProvider.Provider>
    )
}

export const useTaoInfoContext = () => {
    return useContext(TaoInfoProvider)
}
