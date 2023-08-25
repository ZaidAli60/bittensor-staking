import React, { useState, createContext, useContext, useEffect } from 'react'

const SidebarContext = createContext()

export default function SidebarContextProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [siderWidth, setSiderWidth] = useState(80)

    useEffect(() => {
        setSiderWidth(isCollapsed ? 80 : 280)
    }, [isCollapsed])

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, siderWidth }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebarContext = () => {
    return useContext(SidebarContext)
}