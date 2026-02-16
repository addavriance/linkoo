import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export const ScrollToTop = () => {
    const {pathname, hash} = useLocation();

    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
            }, 150);
        } else {
            setTimeout(() => window.scrollTo({left: 0, top: 0, behavior: 'smooth'}), 150);
        }
    }, [pathname, hash]);

    return null;
};
