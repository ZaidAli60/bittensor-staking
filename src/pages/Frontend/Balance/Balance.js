import { useThemeContext } from 'context/ThemeContext'
import React from 'react'

export default function Balance() {
    const { theme } = useThemeContext()
    return (
        <div className={`dashboard ${theme}`}>
            <div className="container-fluid py-4">
                <h5 className='mb-0'>Balance</h5>
            </div>
        </div>
    )
}
