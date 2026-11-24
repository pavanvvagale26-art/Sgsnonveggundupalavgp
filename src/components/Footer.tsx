import React from 'react';
import { PageId } from '../types';
import { BRAND } from '../data/mockData';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-primary text-primary-fixed border-t-2 border-tertiary-fixed relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* ── DESKTOP LAYOUT (sm and above) ── */}
        <div className="hidden sm:grid footer-grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-space-xl">
          {/* Column 1: Brand Lore */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="SGS Gundu Palav Crest Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
                src="/brand-logo.png"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(87%) sepia(27%) saturate(800%) hue-rotate(345deg) brightness(105%) contrast(101%)',
                }}
              />
              <span className="font-bradley text-xl sm:text-2xl text-tertiary-fixed font-bold leading-none">
                {BRAND.name}
              </span>
            </div>
            <p className="font-label-sm text-xs text-tertiary-fixed-dim uppercase tracking-wider">
              {BRAND.tagline}
            </p>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
              Keeping our rich culinary heritage alive with authentic South Indian spices and traditional Palav recipes, proudly serving Bengaluru since 1989.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="flex flex-col gap-space-md">
            <span className="font-title-md text-title-md text-tertiary-fixed uppercase tracking-wider">
              Quick Navigation
            </span>
            <div className="flex flex-col gap-space-sm">
              <button
                onClick={() => handleNav('home')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Home Heritage
              </button>
              <button
                onClick={() => handleNav('about-us')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                About Our Legacy
              </button>
              <button
                onClick={() => handleNav('menu')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Signature Palav Menu
              </button>
              <button
                onClick={() => handleNav('our-locations')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Our Outlets
              </button>
              <button
                onClick={() => handleNav('franchise')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Franchise Opportunities
              </button>
              <button
                onClick={() => handleNav('gallery')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Culinary Gallery
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="text-left font-body-sm text-body-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer"
              >
                Reach Out
              </button>
            </div>
          </div>

          {/* Column 3: Main Landmark Outlet */}
          <div className="flex flex-col gap-space-md">
            <span className="font-title-md text-title-md text-tertiary-fixed uppercase tracking-wider">
              Main Outlet
            </span>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
              21, K.V. Temple Street, 2nd Cross,<br />
              Sowrastra Pet Rd, near Balepet, Circle,<br />
              Bengaluru, Karnataka 560053
            </p>
            <div className="flex items-start gap-space-xs text-tertiary-fixed font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">schedule</span>
              <span className="flex-1 text-xs text-primary-fixed-dim leading-relaxed">
                <span className="block font-semibold text-tertiary-fixed text-sm mb-1.5">Outlet Timings</span>
                <span className="flex justify-between items-center gap-2 py-0.5">
                  <span className="text-white/90 font-medium">Tue – Fri:</span>
                  <span className="text-right text-tertiary-fixed font-medium">10 am–3 pm, 6pm–9:30 pm</span>
                </span>
                <span className="flex justify-between items-center gap-2 py-0.5">
                  <span className="text-white/90 font-medium">Sunday:</span>
                  <span className="text-right text-tertiary-fixed font-medium">8 am–3 pm</span>
                </span>
                <span className="flex justify-between items-center gap-2 py-0.5 text-amber-300">
                  <span className="font-medium">Mon & Sat:</span>
                  <span className="font-semibold text-right">Closed</span>
                </span>
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-tertiary-fixed-dim font-body-sm text-body-sm flex-wrap">
              <span className="material-symbols-outlined text-[18px]">call</span>
              <a href="tel:9341246466" className="hover:text-tertiary-fixed transition-colors text-white font-medium">
                9341246466
              </a>
            </div>
          </div>

          {/* Column 4: Franchise Hotline */}
          <div className="flex flex-col gap-space-md">
            <span className="font-title-md text-title-md text-tertiary-fixed uppercase tracking-wider">
              Franchise Hotline
            </span>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
              Connect directly with our corporate expansion and partnerships division.
            </p>
            <a
              href="tel:9341246466"
              className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary-fixed hover:text-on-primary transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>9341246466</span>
            </a>
          </div>
        </div>

        {/* ── MOBILE LAYOUT (below sm) ── */}
        <div className="flex flex-col gap-7 sm:hidden">

          {/* Brand section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                alt="SGS Gundu Palav Crest Logo"
                className="w-10 h-10 object-contain shrink-0"
                src="/brand-logo.png"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(87%) sepia(27%) saturate(800%) hue-rotate(345deg) brightness(105%) contrast(101%)',
                }}
              />
              <span className="font-bradley text-2xl text-tertiary-fixed font-bold leading-none tracking-wide">
                {BRAND.name}
              </span>
            </div>
            <p className="text-xs font-bold text-tertiary-fixed uppercase tracking-widest">
              {BRAND.tagline}
            </p>
            <p className="text-sm text-primary-fixed-dim leading-relaxed">
              Keeping our rich culinary heritage alive with authentic South Indian spices and traditional Palav recipes, proudly serving Bengaluru since 1989.
            </p>
          </div>

          {/* Quick Navigation + Main Outlet — 2 columns side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quick Navigation */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
                Quick Navigation
              </span>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleNav('home')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Home Heritage</button>
                <button onClick={() => handleNav('gallery')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Culinary Gallery</button>
                <button onClick={() => handleNav('about-us')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">About Our Legacy</button>
                <button onClick={() => handleNav('menu')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Signature Palav Menu</button>
                <button onClick={() => handleNav('our-locations')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Our Outlets</button>
                <button onClick={() => handleNav('franchise')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Franchise Opportunities</button>
                <button onClick={() => handleNav('contact')} className="text-left text-sm text-primary-fixed-dim hover:text-tertiary-fixed transition-colors cursor-pointer">Reach Out</button>
              </div>
            </div>

            {/* Main Outlet */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
                Main Outlet
              </span>
              <p className="text-sm text-primary-fixed-dim leading-relaxed">
                21, K.V. Temple Street, 2nd Cross, Sowrastra Pet Rd, near Balepet, Circle, Bengaluru, Karnataka 560053
              </p>
            </div>
          </div>

          {/* Franchise Hotline — full width */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
              Franchise Hotline
            </span>
            <p className="text-sm text-primary-fixed-dim leading-relaxed">
              Connect directly with our corporate expansion and partnerships division.
            </p>
            <a
              href="tel:9341246466"
              className="text-xl font-bold text-tertiary-fixed hover:text-on-primary transition-colors"
            >
              9341246466
            </a>
          </div>
        </div>

        {/* ── Bottom Rights Bar — shared for both layouts ── */}
        <div className="mt-8 pt-4 border-t border-primary-container flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-space-sm text-center sm:text-left">
          <p className="text-xs text-primary-fixed-dim leading-relaxed">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.{' '}
            Unauthorized reproduction or use of website content is prohibited.
          </p>
          <p className="hidden sm:block font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider shrink-0">
            Estd 1989 • Bengaluru Tradition
          </p>
        </div>
      </div>
    </footer>
  );
};
