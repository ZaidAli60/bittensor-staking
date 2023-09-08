import { useThemeContext } from 'context/ThemeContext'
import React from 'react'

export default function Footer() {
    const { theme } = useThemeContext()
    return (
        <footer className={`text-center footer dashboard ${theme}`}>
            <div className='mb-4'>
                <p className={`mb-1 fontFamily ${theme === 'dark' && 'text-white'}`}>Copyright &copy; {window.year} <span><a className='text-decoration-none' href="https://bittensorstaking.com" target="_blank" rel="noopener noreferrer"> BittensorStaking.com </a></span></p>
                <p className='fontFamily'>Powered by <span><a className='text-decoration-none' href="https://firsttensor.com" target="_blank" rel="noopener noreferrer"> FirstTensor Validator </a></span></p>
            </div>
        </footer>
    )
}
