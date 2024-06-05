import React from 'react'
import { useThemeContext } from 'context/ThemeContext'

export default function Footer() {
    const { theme } = useThemeContext()
    return (
        <footer className={`container-fluid text-center footer dashboard ${theme}`}>
            <div className='mb-5'>
                <p className={`mb-1 fontFamily ${theme === 'dark' && 'text-white'}`}>Copyright &copy; {window.year} <span><a className='text-decoration-none' href="https://bittensorstaking.com" target="_blank" rel="noopener noreferrer"> BittensorStaking.com </a></span></p>
            </div>
        </footer>
    )
}
