import {createContext, useContext, useState, ReactNode} from 'react';

interface DialogContextType {
    // Auth Dialog
    loginDialogOpen: boolean;
    openLoginDialog: () => void;
    closeLoginDialog: () => void;

    // Max Auth Dialog
    maxDialogOpen: boolean;
    openMaxDialog: () => void;
    closeMaxDialog: () => void;

    // Payment Dialog
    paymentDialogOpen: boolean;
    openPaymentDialog: () => void;
    closePaymentDialog: () => void;

    // Link Card Dialog
    linkCardDialogOpen: boolean;
    openLinkCardDialog: () => void;
    closeLinkCardDialog: () => void;

    // Helper to open Max from Login
    switchToMaxDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({children}: { children: ReactNode }) {
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [maxDialogOpen, setMaxDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [linkCardDialogOpen, setLinkCardDialogOpen] = useState(false);

    const openLoginDialog = () => setLoginDialogOpen(true);
    const closeLoginDialog = () => setLoginDialogOpen(false);

    const openMaxDialog = () => setMaxDialogOpen(true);
    const closeMaxDialog = () => setMaxDialogOpen(false);

    const openPaymentDialog = () => setPaymentDialogOpen(true);
    const closePaymentDialog = () => setPaymentDialogOpen(false);

    const openLinkCardDialog = () => setLinkCardDialogOpen(true);
    const closeLinkCardDialog = () => setLinkCardDialogOpen(false);

    const switchToMaxDialog = () => {
        setLoginDialogOpen(false);
        setMaxDialogOpen(true);
    };

    return (
        <DialogContext.Provider
            value={{
                loginDialogOpen,
                openLoginDialog,
                closeLoginDialog,
                maxDialogOpen,
                openMaxDialog,
                closeMaxDialog,
                paymentDialogOpen,
                openPaymentDialog,
                closePaymentDialog,
                linkCardDialogOpen,
                openLinkCardDialog,
                closeLinkCardDialog,
                switchToMaxDialog,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
