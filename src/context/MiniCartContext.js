import React, { createContext, useState, useContext } from 'react';

const MiniCartContext = createContext();

export const MiniCartProvider = ({ children }) => {
    const [isOpenMiniCart, setIsOpennMiniCart] = useState(false);

    const openCustomMiniCart = () => setIsOpennMiniCart(true);
    const closeCustomMiniCart = () => setIsOpennMiniCart(false);

    return (
        <MiniCartContext.Provider value={{ isOpenMiniCart, openCustomMiniCart, closeCustomMiniCart }}>
            {children}
        </MiniCartContext.Provider>
    );
};

export const useMiniCustomCart = () => useContext(MiniCartContext);
