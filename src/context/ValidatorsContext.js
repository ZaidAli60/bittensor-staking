import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ValidatorsProvider = createContext()
export default function ValidatorsContext({ children }) {

    const [validators, setValidators] = useState({})

    const handleFatch = useCallback(async () => {
        try {
            const url = 'https://raw.githubusercontent.com/opentensor/bittensor-delegates/master/public/delegates.json';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setValidators(data)
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }, [])

    useEffect(() => {
        handleFatch()
    }, [handleFatch])

    return (
        <ValidatorsProvider.Provider value={{ validators }}>
            {children}
        </ValidatorsProvider.Provider>
    )
}

export const useValidatorsContext = () => {
    return useContext(ValidatorsProvider)
}