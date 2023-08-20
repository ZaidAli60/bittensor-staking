import React, { createContext, useContext, useReducer } from 'react'

const ConnectWallet = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACCOUNTS':
            return { ...state, accounts: action.payload };
        default:
            return state;
    }
}

export default function ConnectWalletContext({ children }) {

    const initialState = {
        accounts: []
    }
    const [state, dispatch] = useReducer(reducer, initialState)

    // console.log('state', state)
    return (
        <ConnectWallet.Provider value={{ state, dispatch }}>
            {children}
        </ConnectWallet.Provider>
    )
}

export const useConnectWallet = () => {
    return useContext(ConnectWallet)
}
