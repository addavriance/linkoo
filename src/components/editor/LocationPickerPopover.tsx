import React, {useEffect, useRef, useState} from 'react';
import {
    Loader2,
    LocateFixed,
    Plus,
    Minus,
    Maximize2,
    Minimize2,
    MapIcon,
} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

import type {Map as LeafletMap, Marker as LeafletMarker} from 'leaflet';
import {DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM} from '@/lib/constants';

interface LocationPickerPopoverProps {
    onSelect: (address: string) => void;
}

interface LatLng {
    lat: number;
    lng: number;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`,
        {headers: {'Accept-Language': 'ru'}}
    );
    const data = await res.json();
    const {city, town, village, state, country} = data.address ?? {};
    const place = city ?? town ?? village ?? state ?? '';
    return [place, country].filter(Boolean).join(', ') || data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export const LocationPickerPopover: React.FC<LocationPickerPopoverProps> = ({onSelect}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<LatLng | null>(null);
    const [address, setAddress] = useState('');
    const [geocoding, setGeocoding] = useState(false);
    const [locating, setLocating] = useState(false);

    const mapRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const expandBtnRef = useRef<HTMLButtonElement | null>(null);
    const isExpandedRef = useRef(false);

    useEffect(() => {
        if (!open) return;

        let L: typeof import('leaflet');

        const init = async () => {
            L = (await import('leaflet')).default;

            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            if (!containerRef.current || mapRef.current) return;

            const style = document.createElement('style');
            style.id = 'leaflet-cursor-override';
            style.textContent = '.leaflet-container { cursor: pointer !important; } .leaflet-dragging .leaflet-container { cursor: grabbing !important; }';
            document.head.appendChild(style);

            const map = L.map(containerRef.current, {
                center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
                zoom: DEFAULT_MAP_ZOOM,
                zoomControl: false,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            map.on('click', async (e) => {
                const {lat, lng} = e.latlng;
                setSelected({lat, lng});
                setGeocoding(true);

                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng]).addTo(map);
                }

                try {
                    const addr = await reverseGeocode(lat, lng);
                    setAddress(addr);
                } finally {
                    setGeocoding(false);
                }
            });

            mapRef.current = map;
        };

        const timeout = setTimeout(init, 50);
        return () => {
            clearTimeout(timeout);
            document.getElementById('leaflet-cursor-override')?.remove();
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [open]);

    const handleLocate = () => {
        if (!navigator.geolocation || !mapRef.current) return;
        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            async ({coords}) => {
                const {latitude: lat, longitude: lng} = coords;
                const L = (await import('leaflet')).default;

                mapRef.current!.setView([lat, lng], 14);
                setSelected({lat, lng});
                setGeocoding(true);

                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!);
                }

                try {
                    const addr = await reverseGeocode(lat, lng);
                    setAddress(addr);
                } finally {
                    setGeocoding(false);
                    setLocating(false);
                }
            },
            () => setLocating(false)
        );
    };

    // Expand без React state — прямая манипуляция DOM чтобы не ре-рендерить и не ломать Leaflet
    const handleExpand = () => {
        isExpandedRef.current = !isExpandedRef.current;
        const exp = isExpandedRef.current;

        if (containerRef.current) {
            containerRef.current.style.transition = 'height 0.3s ease';
            containerRef.current.style.height = exp ? '320px' : '208px';
        }
        if (popoverRef.current) {
            popoverRef.current.style.transition = 'width 0.3s ease';
            popoverRef.current.style.width = exp ? '480px' : '320px';
        }
        if (expandBtnRef.current) {
            expandBtnRef.current.setAttribute('data-expanded', String(exp));
        }

        setTimeout(() => {
            mapRef.current?.invalidateSize({pan: false});
        }, 320);
    };

    const handleSave = () => {
        if (address) {
            onSelect(address);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
                    title="Выбрать на карте"
                >
                    <MapIcon className="h-4 w-4"/>
                </button>
            </PopoverTrigger>

            <PopoverContent
                ref={popoverRef}
                side="top"
                align="end"
                className="w-80 p-0 overflow-hidden"
                sideOffset={8}
            >
                <div className="flex flex-col bg-popover">
                    <div ref={containerRef} style={{height: '208px'}} className="w-full bg-muted"/>

                    <div className="flex items-center gap-1 px-2 py-1.5 border-b">
                        <button
                            type="button"
                            onClick={() => mapRef.current?.zoomIn()}
                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Приблизить"
                        >
                            <Plus className="h-3.5 w-3.5"/>
                        </button>
                        <button
                            type="button"
                            onClick={() => mapRef.current?.zoomOut()}
                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Отдалить"
                        >
                            <Minus className="h-3.5 w-3.5"/>
                        </button>

                        <div className="w-full"/>

                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={locating}
                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                            title="Моё местоположение"
                        >
                            {locating
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                                : <LocateFixed className="h-3.5 w-3.5"/>
                            }
                        </button>

                        <button
                            ref={expandBtnRef}
                            type="button"
                            data-expanded="false"
                            onClick={handleExpand}
                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Развернуть / свернуть"
                        >
                            <Maximize2 className="h-3.5 w-3.5 [[data-expanded=true]_&]:hidden"/>
                            <Minimize2 className="h-3.5 w-3.5 hidden [[data-expanded=true]_&]:block"/>
                        </button>
                    </div>

                    {/* Адрес + кнопки */}
                    <div className="p-3 space-y-2">
                        <div className="min-h-[1.5rem] text-sm text-muted-foreground truncate">
                            {geocoding
                                ? <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/>Определяю адрес...</span>
                                : selected
                                    ? address || `${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`
                                    : <span className="italic">Нажмите на карту чтобы выбрать</span>
                            }
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={handleSave}
                                disabled={!selected || geocoding}
                            >
                                Сохранить
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setOpen(false)}
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
