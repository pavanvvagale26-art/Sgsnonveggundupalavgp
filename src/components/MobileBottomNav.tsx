import React from 'react';
import { PageId } from '../types';

interface MobileBottomNavProps {
    currentPage: PageId;
    onNavigate: (page: PageId) => void;
    onOpenFranchiseModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    currentPage,
    onNavigate,
}) => {
    const navTabs: { id: PageId; label: string; icon: string }[] = [
        { id: 'home', label: 'HOME', icon: 'home' },
        { id: 'about-us', label: 'ABOUT', icon: 'info' },
        { id: 'menu', label: 'MENU', icon: 'restaurant' },
        { id: 'our-locations', label: 'LOCATION', icon: 'location_on' },
        { id: 'franchise', label: 'FRANCHISE', icon: 'handshake' },
        { id: 'gallery', label: 'GALLERY', icon: 'photo_library' },
        { id: 'contact', label: 'CONTACT', icon: 'call' },
    ];

    /* ── colours that match the reference image ── */
    const ACTIVE_COLOR = '#00397c';   /* blue – matches image active state */
    const INACTIVE_COLOR = '#8a9db8';   /* muted blue-grey                      */
    const BG = '#ffffff';   /* white card bottom bar                 */

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.12)]"
            style={{
                background: BG,
                borderTop: '1px solid #e8eaed',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <div className="flex items-stretch justify-around w-full max-w-lg mx-auto">
                {navTabs.map((tab) => {
                    const isActive = currentPage === tab.id;
                    const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                onNavigate(tab.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            aria-label={tab.label}
                            aria-current={isActive ? 'page' : undefined}
                            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 cursor-pointer active:scale-95 transition-transform duration-150 focus:outline-none"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '24px',
                                    color,
                                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
                                    transition: 'color 0.2s, font-variation-settings 0.2s',
                                }}
                            >
                                {tab.icon}
                            </span>
                            <span
                                style={{
                                    fontFamily: "'Manrope', sans-serif",
                                    fontSize: '9px',
                                    fontWeight: isActive ? 800 : 600,
                                    letterSpacing: '0.07em',
                                    color,
                                    transition: 'color 0.2s',
                                    lineHeight: 1,
                                }}
                            >
                                {tab.label}
                            </span>
                            {/* Active indicator dot */}
                            {isActive && (
                                <span
                                    style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: ACTIVE_COLOR,
                                        marginTop: '2px',
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
