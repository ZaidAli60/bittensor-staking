import React from 'react'
import { Button, Typography } from 'antd'
import { useThemeContext } from 'context/ThemeContext'
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
export default function NotFound() {
    const { theme } = useThemeContext()
    let navigate = useNavigate()
    return (
        <div className={`dashboard ${theme} error-page container-fluid`}>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "calc(100vh - 100px)" }}>
                <img className='img-fluid mb-3 w-50 h-50' src={`${theme === "dark" ? window.image404Light : window.image404Dark}`} alt="404 Error" />
                <Title level={4} className={`fontFamily ${theme === "dark" ? "text-white" : "text-primary"}`}>COMING SOON</Title>
                <Text className={`fontFamily fw-bold opacity-75 mb-3 ${theme === "dark" ? "text-white" : "text-primary"}`}>Exciting things are on the way! This page is coming soon.</Text>
                <Button type='primary' className='fontFamily' size='large' onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        </div >
    )
}
