import {useDialog} from '@/contexts/DialogContext';
import {AuthDialog} from '@/components/dialogs/AuthDialog';
import {MaxAuthDialog} from '@/components/dialogs/MaxAuthDialog';
import {PaymentDialog} from '@/components/dialogs/PaymentDialog';
import {LinkCardDialog} from '@/components/dialogs/LinkCardDialog';

/**
 * Централизованный контейнер для всех диалоговых окон приложения.
 * Управляется через DialogContext.
 */
export function DialogContainer() {
    const {
        loginDialogOpen,
        closeLoginDialog,
        maxDialogOpen,
        closeMaxDialog,
        paymentDialogOpen,
        closePaymentDialog,
        linkCardDialogOpen,
        closeLinkCardDialog,
        switchToMaxDialog,
    } = useDialog();

    return (
        <>
            <AuthDialog
                open={loginDialogOpen}
                onOpenChange={closeLoginDialog}
                openMaxDialog={switchToMaxDialog}
            />
            <MaxAuthDialog
                open={maxDialogOpen}
                onOpenChange={closeMaxDialog}
            />
            <PaymentDialog
                open={paymentDialogOpen}
                onOpenChange={closePaymentDialog}
            />
            <LinkCardDialog
                open={linkCardDialogOpen}
                onOpenChange={closeLinkCardDialog}
            />
        </>
    );
}
