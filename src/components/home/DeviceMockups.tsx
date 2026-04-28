import {useEffect, useRef, useState} from 'react';

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
    const removeFirstPhone = width <= 1250;
    const removeSecondPhone = width <= 1080;
    const removeThirdPhone = width <= 950;
    const thirdPhoneBottom = removeSecondPhone ? -30 : 30;
    const scale = isSmall ? Math.min(1, width / 800) : Math.min(1, width / 1200);

    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'}}
        >
            <div className="absolute bottom-0 left-1/4 h-80 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"/>
            <div className="absolute bottom-0 right-1/4 h-80 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"/>

            <div style={{
                position: 'absolute', bottom: removeThirdPhone ? '-50px' : 0, left: removeThirdPhone ? '50%' : 0,
                transformOrigin: 'left center',
                transform: `scale(${scale})` + (removeThirdPhone ? 'translateX(-50%)' : ''),
            }}>
                <InteractiveLaptop/>
            </div>

            <div className="absolute inset-0" style={{
                // transformOrigin: 'right bottom',
                transform: `scale(${scale})`
            }}>
                {!removeFirstPhone && <InteractivePhone idx={3} bottom="-70px" right="330px" z={1}/>}
                {!removeSecondPhone && <InteractivePhone idx={2} bottom="-20px" right="201px" z={2}/>}
                {!removeThirdPhone && <InteractivePhone idx={1} bottom={thirdPhoneBottom + 'px'} right="75px" z={3}/>}
            </div>
        </div>
    );
};

const InteractiveLaptop = () => {
    const [tilt, setTilt] = useState({x: 0, y: 0});
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setTilt({x: -x * 6, y: -y * 4});
    };

    const onMouseLeave = () => {
        setTilt({x: 0, y: 0});
        setHovered(false);
    };

    return (
        <div
            ref={ref}
            className="pointer-events-auto"
            style={{
                width: '680px',
                transformOrigin: '50% 50%',
                transform: `perspective(1400px) rotateY(${18 + tilt.x}deg) rotateX(${16 + tilt.y}deg) rotate(-4deg) translateY(${hovered ? -8 : 0}px)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s ease',
                filter: hovered
                    ? 'drop-shadow(0 24px 40px rgba(0,0,0,0.55))'
                    : 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
        >
            <div className={`relative rounded-t-xl border shadow-2xl transition-colors duration-300 bg-gray-800 dark:bg-gray-900 ${
                hovered ? 'border-white/20 dark:border-white/15' : 'border-gray-700/80 dark:border-gray-600/60'
            }`}>
                <div className="flex justify-center pt-2 pb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-600 dark:bg-gray-500"/>
                </div>
                <div className="overflow-hidden rounded-sm" style={{aspectRatio: '16/10'}}>
                    <img src="/preview-desktop.png" alt="Аналитика визитки"
                         className="h-full w-full object-cover object-top" draggable={false}/>
                </div>
            </div>
            <div className="h-1 w-full bg-gray-600 dark:bg-gray-700"/>
            <div className="rounded-b-lg border border-t-0 border-gray-700/80 bg-gray-700 py-3 dark:border-gray-600/60 dark:bg-gray-800"/>
        </div>
    );
};

type InteractivePhoneProps = {idx: number; bottom: string; right: string; z: number};

const InteractivePhone = ({idx, bottom, right, z}: InteractivePhoneProps) => {
    const [tilt, setTilt] = useState({x: 0, y: 0});
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setTilt({x: -x * 8, y: -y * 5});
    };

    const onMouseLeave = () => {
        setTilt({x: 0, y: 0});
        setHovered(false);
    };

    return (
        <div
            ref={ref}
            className="pointer-events-auto absolute"
            style={{
                bottom, right, width: '240px', zIndex: z,
                transformOrigin: '50% 50%',
                transform: `perspective(1400px) rotateY(${-5 + tilt.x}deg) rotateX(${10 + tilt.y}deg) rotate(4deg) translateY(${hovered ? -12 : 0}px)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s ease',
                filter: hovered
                    ? 'drop-shadow(0 24px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 0 1px rgba(255,255,255,0.08))'
                    : 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
        >
            <PhoneFrame idx={idx} hovered={hovered}/>
        </div>
    );
};

const PhoneFrame = ({idx = 1, hovered = false}: {idx?: number; hovered?: boolean}) => (
    <div className={`relative rounded-[2.6rem] border-2 p-[6px] shadow-2xl transition-colors duration-300 bg-gray-800 dark:bg-gray-900 ${
        hovered ? 'border-white/20 dark:border-white/15' : 'border-gray-700/90 dark:border-gray-600/70'
    }`}>
        <div className="absolute left-1/2 top-3 z-10 h-5 w-[68px] -translate-x-1/2 rounded-full bg-gray-900"/>
        <div className="overflow-hidden rounded-[2.2rem] bg-gray-900" style={{aspectRatio: '9/19.5'}}>
            <img src={`/preview-mobile-${idx}.png`} alt="Визитка на телефоне"
                 className="h-full w-full object-fill object-top" draggable={false}/>
        </div>
        <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-gray-600 dark:bg-gray-500"/>
    </div>
);

export default DeviceMockups;
