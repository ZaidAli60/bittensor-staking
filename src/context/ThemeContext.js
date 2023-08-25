import React, { createContext, useContext, useState } from 'react'
const ThemeProvider = createContext();

export default function ThemeContext({ children }) {
    const [theme, setTheme] = useState('light');
    const [isAppLoader, setIsAppLoader] = useState(true)

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (
        <ThemeProvider.Provider value={{ theme, toggleTheme, setIsAppLoader, isAppLoader }}>
            {children}
        </ThemeProvider.Provider>
    )
}

export const useThemeContext = () => {
    return useContext(ThemeProvider);
}