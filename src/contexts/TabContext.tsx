"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'rumor' | 'logic' | 'deepfake' | 'voice' | 'accessibility' | 'game' | 'dividend' | 'news' | 'margin';

interface TabContextType {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<TabType>('rumor');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
}

export function useTabs() {
    const context = useContext(TabContext);
    if (context === undefined) {
        throw new Error('useTabs must be used within a TabProvider');
    }
    return context;
}
