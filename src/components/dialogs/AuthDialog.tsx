import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    openMaxDialog: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange, openMaxDialog }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[480px] rounded-lg">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="select-none flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-2xl shadow-lg">
                            L
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Вход в Linkoo
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-gray-600">
                            Выберите удобный способ входа
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <OAuthButtons openMaxDialog={openMaxDialog}/>

                    {/* Footer note */}
                    <p className="text-sm text-center text-gray-500 px-4">
                        Продолжая, вы соглашаетесь с{' '}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">
                            условиями использования
                        </Link>{' '}
                        и{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                            политикой конфиденциальности
                        </Link>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
