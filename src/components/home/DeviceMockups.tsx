const DeviceMockups = () => {
    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'}}
        >
            <div className="absolute bottom-0 left-1/4 h-80 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"/>
            <div className="absolute bottom-0 right-1/4 h-80 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"/>

            <div
                className="absolute hidden xl:block"
                style={{
                    bottom: '0px',
                    left: '100px',
                    width: '680px',
                    transform: 'perspective(1400px) rotateY(18deg) rotateX(16deg) rotate(-4deg)',
                    transformOrigin: 'left bottom',
                }}
            >
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

            <div
                className="absolute z-[3]"
                style={{
                    bottom: '30px',
                    right: '75px',
                    width: '240px',
                    transform: 'perspective(1400px) rotateY(-5deg) rotateX(10deg) rotate(4deg)',
                    transformOrigin: 'right bottom',
                }}
            >
                <PhoneFrame/>
            </div>

            <div
                className="absolute z-[2] hidden md:block"
                style={{
                    bottom: '-20px',
                    right: '201px',
                    width: '240px',
                    transform: 'perspective(1400px) rotateY(-5deg) rotateX(10deg) rotate(4deg)',
                    transformOrigin: 'right bottom',
                }}
            >
                <PhoneFrame idx={2}/>
            </div>

            <div
                className="absolute z-[1] hidden lg:block"
                style={{
                    bottom: '-70px',
                    right: '330px',
                    width: '240px',
                    transform: 'perspective(1400px) rotateY(-5deg) rotateX(10deg) rotate(4deg)',
                    transformOrigin: 'right bottom',
                }}
            >
                <PhoneFrame idx={3}/>
            </div>
        </div>
    );
};

const PhoneFrame = ({idx = 1}) => (
    <div className="relative rounded-[2.6rem] border-2 border-gray-700/90 bg-gray-800 p-[6px] shadow-2xl dark:border-gray-600/70 dark:bg-gray-900">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-[68px] -translate-x-1/2 rounded-full bg-gray-900"/>
        <div className="overflow-hidden rounded-[2.2rem] bg-gray-900" style={{aspectRatio: '9/19.5'}}>
            <img
                src={`/preview-mobile-${idx++}.png`}
                alt="Визитка на телефоне"
                className="h-full w-full object-fill object-top"
                draggable={false}
            />
        </div>
        <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-gray-600 dark:bg-gray-500"/>
    </div>
);

export default DeviceMockups;
