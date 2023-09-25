import React from 'react'
import { useThemeContext } from 'context/ThemeContext'

export default function Footer() {
    const { theme } = useThemeContext()
    return (
        <footer className={`container-fluid text-center footer dashboard ${theme}`}>
            <div className='mb-5'>
                <p className={`mb-1 fw-bold fontFamily ${theme === 'dark' && 'text-white'}`}>Copyright &copy; {window.year} <span><a className='text-decoration-none' href="https://bittensorstaking.com" target="_blank" rel="noopener noreferrer"> BittensorStaking.com </a></span></p>
                <p className='fontFamily fw-bold mb-1' style={{ fontSize: "1rem" }} >Powered by <a href="https://firsttensor.com/" target="_blank" rel="noopener noreferrer"> <img src={`${theme === "dark" ? window.footerLogoLight : window.footerLogoDark}`} className='img-fluid' style={{ width: "130px", verticalAlign: "baseline" }} alt={window.appName} /></a> </p>
                <p className='fontFamily mb-1'>To show support, please consider delegating TAO to FirstTensor.</p>
            </div>
        </footer>
    )
}
