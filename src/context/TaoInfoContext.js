import { message } from 'antd'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
const TaoInfoProvider = createContext()

export default function TaoInfoContext({ children }) {

    const [taoInfo, setTaoInfo] = useState([])
    const [isSkeleton, setIsSkeleton] = useState(false)

    const handleFetch = useCallback(async () => {
        setIsSkeleton(true);
        try {
            const url = process.env.REACT_APP_BITTENSOR_DATA_API_END_POINT;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json()
            setTaoInfo(data);
            setIsSkeleton(false);
        } catch (error) {
            console.log('error', error)
            setIsSkeleton(true);
            message.error("Something went wrong")
            // console.error('Error fetching data:', error);
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
