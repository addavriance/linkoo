import {Star, Award} from 'lucide-react';
import type {AccountType} from '@/types';

interface AccountBadgeProps {
    accountType: AccountType;
}

export function AccountBadge({accountType}: AccountBadgeProps) {
    const isPaid = accountType === 'paid';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
            isPaid ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
            {isPaid ? <Star className="h-3 w-3"/> : <Award className="h-3 w-3"/>}
            {isPaid ? 'Premium' : 'Free'}
        </span>
    );
}
