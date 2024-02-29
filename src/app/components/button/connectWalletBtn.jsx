import React from 'react'
import { useWeb3Modal } from "@web3modal/react";

import Button from './button';

const ConnectWalletBtn = ({ classes = ''}) => {
        
    const { open, isOpen } = useWeb3Modal();
    const label = "Connect Wallet";

    const onClick = () => open()
    
    return (
        
        <Button className={`${classes}`} onClick={onClick} disabled={isOpen}>
           
            <p>{isOpen ? "Connecting..." : label}</p>
            
        </Button>
    )
}

export default React.memo(ConnectWalletBtn)