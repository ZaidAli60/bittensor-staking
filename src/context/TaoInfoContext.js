import { message } from 'antd'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
const TaoInfoProvider = createContext()

export default function TaoInfoContext({ children }) {

    const [taoInfo, setTaoInfo] = useState([])
    const [isSkeleton, setIsSkeleton] = useState(false)

    const handleFetch = useCallback(async () => {
        setIsSkeleton(true);
        try {
            // const url = process.env.REACT_APP_BITTENSOR_DATA_API_END_POINT;
            const url = "https://85.239.241.96/api/supply/";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json()
            setTaoInfo(data);
            setIsSkeleton(false);
        } catch (error) {
            console.log('error', error)
            message.error("Something went wrong")
            // console.error('Error fetching data:', error);
        } finally {
            setIsSkeleton(false);
        }
    }, []);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    return (
        <TaoInfoProvider.Provider value={{ isSkeleton, taoInfo }}>
            {children}
        </TaoInfoProvider.Provider>
    )
}

export const useTaoInfoContext = () => {
    return useContext(TaoInfoProvider)
}
