import {useEffect, useState} from 'react';

const PHONE_T = 'perspective(1400px) rotateY(-5deg) rotateX(10deg) rotate(4deg)';

const DeviceMockups = () => {
    const [width, setWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        const update = () => setWidth(window.innerWidth);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    if (width < 500) return null;

    const isSmall = width <= 700;
    const scale = isSmall ? Math.min(1, width / 800) : Math.min(1, width / 1200);

    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'}}
        >
            <div className="absolute bottom-0 left-1/4 h-80 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"/>
            <div className="absolute bottom-0 right-1/4 h-80 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"/>

            {/* Laptop — scales from left-bottom, stays anchored to the left */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50px',
                transformOrigin: 'left bottom',
                transform: `scale(${scale})`,
            }}>
                <div style={{
                    width: '680px',
                    transform: 'perspective(1400px) rotateY(18deg) rotateX(16deg) rotate(-4deg)',
                    transformOrigin: 'left bottom',
                }}>
                    <div className="relative rounded-t-xl border border-gray-700/80 bg-gray-800 shadow-2xl dark:border-gray-600/60 dark:bg-gray-900">
                        <div className="flex justify-center pt-2 pb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-600 dark:bg-gray-500"/>
                        </div>
                        <div className="overflow-hidden rounded-sm" style={{aspectRatio: '16/10'}}>
                            <img
                                src="/preview-desktop.png"
                                alt="Аналитика визитки"
                                className="h-full w-full object-cover object-top"
                                draggable={false}
                            />
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-600 dark:bg-gray-700"/>
                    <div className="rounded-b-lg border border-t-0 border-gray-700/80 bg-gray-700 py-3 dark:border-gray-600/60 dark:bg-gray-800"/>
                </div>
            </div>

            {/* Phones — scale from right-bottom, stay anchored to the right */}
            <div className="absolute inset-0" style={{
                transformOrigin: 'right bottom',
                transform: `scale(${scale})`,
            }}>
                {/* Phone 3 — back */}
                {!isSmall && <div className="absolute z-[1]" style={{
                    bottom: '-70px', right: '330px', width: '240px',
                    transform: PHONE_T, transformOrigin: 'right bottom',
                }}>
                    <PhoneFrame idx={3}/>
                </div>}

                {/* Phone 2 — middle */}
                {!isSmall && <div className="absolute z-[2]" style={{
                    bottom: '-20px', right: '201px', width: '240px',
                    transform: PHONE_T, transformOrigin: 'right bottom',
                }}>
                    <PhoneFrame idx={2}/>
                </div>}

                {/* Phone 1 — front */}
                <div className="absolute z-[3]" style={{
                    bottom: '30px', right: '75px', width: '240px',
                    transform: PHONE_T, transformOrigin: 'right bottom',
                }}>
                    <PhoneFrame/>
                </div>
            </div>
        </div>
    );
};

const PhoneFrame = ({idx = 1}: {idx?: number}) => (
    <div className="relative rounded-[2.6rem] border-2 border-gray-700/90 bg-gray-800 p-[6px] shadow-2xl dark:border-gray-600/70 dark:bg-gray-900">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-[68px] -translate-x-1/2 rounded-full bg-gray-900"/>
        <div className="overflow-hidden rounded-[2.2rem] bg-gray-900" style={{aspectRatio: '9/19.5'}}>
            <img
                src={`/preview-mobile-${idx}.png`}
                alt="Визитка на телефоне"
                className="h-full w-full object-fill object-top"
                draggable={false}
            />
        </div>
        <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-gray-600 dark:bg-gray-500"/>
    </div>
);

export default DeviceMockups;
