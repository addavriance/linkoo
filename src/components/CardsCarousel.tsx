import React, {useState, useRef, useEffect} from 'react';
import { CardPreview } from './CardPreview';
import {cardThemes, Theme} from '@/lib/themes';
import { Card } from "@/types";
import {CARD_SAMPLES} from "@/constants";

type CustomCard = Omit<Card, "theme"> & { theme: Theme };

const generateSampleCards = (): CustomCard[] => {
    const themes = Object.values(cardThemes);

    const shuffledThemes = [...themes].sort(() => Math.random() - 0.5);

    return CARD_SAMPLES.map((sample, index) => ({
        ...sample,
        theme: shuffledThemes[index % shuffledThemes.length]
    })) as CustomCard[];
};

const ROWS = [
    { speed: -0.5 },
    { speed: 0.3 },
    { speed: -0.4 },
];

export const CardsCarousel: React.FC = () => {
    const [cards] = useState<CustomCard[]>(generateSampleCards());

    const rowRefs = useRef<HTMLDivElement[]>([]);
    const positions = useRef<number[]>(ROWS.map(() => 0));

    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    useEffect(() => {
        ROWS.forEach((row, i) => {
            const el = rowRefs.current[i];

            if (row.speed > 0)
                positions.current[i] = -el.scrollWidth / 4;
        })
    }, []);

    useEffect(() => {
        let rafId: number;

        const animate = () => {
            ROWS.forEach((row, i) => {
                const el = rowRefs.current[i];
                if (!el) return;

                if (hoveredRow !== i) {
                    positions.current[i] += row.speed;
                }

                const loopWidth = el.scrollWidth / 4;

                // console.log(positions.current[i], loopWidth);

                if (positions.current[i] <= -loopWidth) {
                    positions.current[i] += loopWidth;
                } else if (positions.current[i] >= 0) {
                    positions.current[i] -= loopWidth;
                }

                el.style.transform = `translateX(${positions.current[i]}px)`;
            });

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [hoveredRow]);

    return (
        <div className="relative w-full overflow-hidden py-8 h-[60rem] sm:h-[74rem] lg:h-auto">
            {ROWS.map((_, rowIndex) => {
                const rowCards = cards.slice(rowIndex * 4, rowIndex * 4 + 4);
                const infiniteCards = Array(4).fill(rowCards).flat();

                return (
                    <div
                        key={rowIndex}
                        className={"mb-8 scale-[0.6] sm:scale-[0.8] lg:scale-[1] lg:translate-y-0 " + ["translate-y-[-5rem]", "translate-y-[-20rem] sm:translate-y-[-14rem]", "translate-y-[-35rem] sm:translate-y-[-23rem]"][rowIndex]}
                        onMouseEnter={() => setHoveredRow(rowIndex)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        <div
                            ref={el => {
                                if (el) rowRefs.current[rowIndex] = el;
                            }}
                            className="flex gap-6 will-change-transform"
                        >
                            {infiniteCards.map((card, i) => (
                                <div key={i} className="w-[300px] flex-shrink-0">
                                    <CardPreview
                                        cardData={card}
                                        theme={card.theme}
                                        className="scale-90 transition-all duration-300 hover:scale-95 hover:shadow-xl rounded-xl"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* градиенты */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
        </div>
    );
};
