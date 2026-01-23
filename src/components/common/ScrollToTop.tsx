import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        setTimeout(() => window.scrollTo({left: 0, top: 0, behavior: 'smooth'}), 150);
    }, [pathname]);

    return null;
};
