'use client';


import { ClerkProvider } from "@clerk/nextjs";
import { Children } from "react";


interface Props {
    children : React.ReactNode
}

const Providers = ({children}:Props) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default  Providers ;