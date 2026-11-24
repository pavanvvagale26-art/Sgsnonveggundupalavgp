import React from 'react';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenFranchiseModal: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenFranchiseModal,
  onOpenProfileModal,
}) => {
  const navItems: { id: PageId; label: string }[] = [
    { id: 'home',          label: 'Home'          },
    { id: 'about-us',      label: 'About Us'      },
    { id: 'menu',          label: 'Menu'          },
    { id: 'our-locations', label: 'Our Locations' },
    { id: 'franchise',     label: 'Franchise'     },
    { id: 'gallery',       label: 'Gallery'       },
    { id: 'contact',       label: 'Contact'       },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NAV_BG  = '#00397c';
  const GOLD    = '#f5c842';
  const GOLD_DIM = 'rgba(245,200,66,0.55)';

  return (
    <header
      style={{ backgroundColor: NAV_BG }}
      className="sticky top-0 w-full z-50 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center h-14 sm:h-[72px] lg:h-[92px] relative">

        {/* ── Logo + Brand text (mobile/tablet: logo + text side by side; desktop: full-size logo only) ── */}
        <button
          onClick={() => handleNavClick('home')}
          className="cursor-pointer focus:outline-none shrink-0 group flex items-center gap-2 lg:gap-0"
        >
          <img
            alt="SGS Gundu Palav"
            src="/brand-logo.png"
            className="object-contain transition-transform duration-300 group-hover:scale-105 w-[44px] h-[36px] sm:w-[56px] sm:h-[48px] lg:w-[180px] lg:h-[160px]"
            style={{
              filter: 'brightness(0) saturate(100%) invert(87%) sepia(27%) saturate(800%) hue-rotate(345deg) brightness(105%) contrast(101%)',
            }}
          />
          {/* Brand text — mobile/tablet only */}
          <div className="lg:hidden flex flex-col items-start leading-tight">
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(0.65rem, 2.8vw, 0.85rem)',
                letterSpacing: '0.04em',
                color: '#ffffff',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              SGS GUNDU PALAV
            </span>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(0.5rem, 1.8vw, 0.6rem)',
                letterSpacing: '0.08em',
                color: '#a8c0e0',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              BALEPET ORIGINAL
            </span>
          </div>
        </button>

        {/* ── Desktop Nav — centred absolutely in header ── */}
        <nav
          className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2"
          style={{ gap: '6px' }}
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="cursor-pointer whitespace-nowrap focus:outline-none"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.03em',
                  color: isActive ? GOLD : '#c8d8f0',
                  background: 'none',
                  border: isActive ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = '#c8d8f0';
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Actions (pushed to the right via ml-auto) ── */}
        <div className="flex items-center ml-auto shrink-0" style={{ gap: '8px' }}>

          {/* Franchise Enquiry button — desktop only */}
          <button
            onClick={onOpenFranchiseModal}
            className="hidden lg:inline-flex items-center justify-center cursor-pointer active:scale-95 whitespace-nowrap"
            style={{
              background: 'transparent',
              border: `2px solid ${GOLD}`,
              color: GOLD,
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '0.775rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              fontFamily: "'Manrope', sans-serif",
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = GOLD;
              (e.currentTarget as HTMLButtonElement).style.color = NAV_BG;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = GOLD;
            }}
          >
            Franchise Enquiry
          </button>

          {/* Profile icon */}
          <button
            onClick={onOpenProfileModal}
            title="Royal Connoisseur Circle"
            className="flex items-center justify-center cursor-pointer shrink-0 focus:outline-none"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: `2px solid ${GOLD_DIM}`,
              background: 'rgba(245,200,66,0.07)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD;
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,200,66,0.16)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_DIM;
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,200,66,0.07)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '19px', color: GOLD }}>
              person
            </span>
          </button>
        </div>
      </div>

      {/* Gold gradient separator */}
      <div
        style={{
          height: '1.5px',
          background: `linear-gradient(to right, transparent, ${GOLD_DIM}, transparent)`,
        }}
      />
    </header>
  );
};
