import { useState } from 'react';

interface UserAvatarProps {
    name: string;
    avatar?: string;
    className?: string;
}

const UserAvatar = ({ name, avatar, className = 'h-8 w-8' }: UserAvatarProps) => {
    const [imgFailed, setImgFailed] = useState(false);

    if (avatar && !imgFailed) {
        return (
            <img
                src={avatar}
                alt={name}
                className={`${className} rounded-full object-cover`}
                onError={() => setImgFailed(true)}
            />
        );
    }

    return (
        <div className={`${className} rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm`}>
            {name[0]}
        </div>
    );
};

export default UserAvatar;
