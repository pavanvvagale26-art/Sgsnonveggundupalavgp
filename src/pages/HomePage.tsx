import React, { useState, useEffect } from 'react';
import { PageId, MenuItem } from '../types';
import { BRAND, MENU_ITEMS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenFranchiseModal: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
  onShowToast: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenFranchiseModal,
  onSelectMenuItem,
  onShowToast,
}) => {
  const chickenPalav = MENU_ITEMS.find((i) => i.id === 'chicken-donne-palav')!;
  const kshatriyaKabab = MENU_ITEMS.find((i) => i.id === 'legendary-kshatriya-kabab')!;
  const muttonPalav = MENU_ITEMS.find((i) => i.id === 'mutton-donne-palav')!;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadContent() {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('section, key, value')
          .eq('page', 'home');
        if (!error && data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach(d => {
            map[`${d.section}::${d.key}`] = d.value;
          });
          setContent(map);
        }
      } catch {
        // use default static content
      }
    }
    loadContent();
  }, []);

  // High-resolution multi-dish imagery showing authentic culinary tradition
  const heroSlides = [
    {
      id: 'chicken-palav',
      name: 'Chicken Donne Palav',
      badge: 'Balepet Original',
      title: 'Authentic Heritage Dum',
      subtitle: 'Steaming hot Jeera Samba rice served in natural areca leaf cups',
      icon: 'local_fire_department',
      image: BRAND.heroBannerUrl,
      alt: 'Steaming hot Chicken Donne Palav served in a traditional areca nut leaf donne cup',
      item: chickenPalav,
    },
    {
      id: 'kshatriya-kabab',
      name: 'Kshatriya Kabab',
      badge: 'Secret Heritage Crust',
      title: 'Legendary Kshatriya Kabab',
      subtitle: 'Ruby-hued crispy chicken flash-fried with fresh curry leaves & chilies',
      icon: 'whatshot',
      image: kshatriyaKabab.image,
      alt: 'Crispy Legendary Kshatriya Kabab tossed with curry leaves',
      item: kshatriyaKabab,
    },
    {
      id: 'mutton-palav',
      name: 'Mutton Donne Palav',
      badge: 'Limited Morning Degh',
      title: 'Royal Mutton Donne Palav',
      subtitle: 'Slow-braised Karnataka mutton simmered with 17 traditional spices in degh',
      icon: 'restaurant',
      image: muttonPalav.image,
      alt: 'Tender royal mutton donne palav simmered in brass degh',
      item: muttonPalav,
    },
    {
      id: 'balepet-cauldrons',
      name: 'Balepet Heritage Flagship',
      badge: 'Estd 1989 Original',
      title: 'The Balepet Original',
      subtitle: 'Where Our Legacy Began in 1989, Serving Authentic Flavours Rooted in Tradition.',
      icon: 'outdoor_grill',
      image: BRAND.balepetStorefrontUrl,
      alt: 'Master chefs tending wood-fire brass cauldrons in Balepet',
      action: () => onNavigate('our-locations'),
    },
    {
      id: 'chicken-chilli',
      name: 'Chicken Chilli',
      badge: 'Spicy Savoury',
      icon: 'whatshot',
      badgeType: 'fav',
      subtitle: 'Crisp chicken pieces wok-tossed with spicy green chillies and roasted garlic.',
      servingNote: 'Green Chilli Toss',
      highlightMeta: 'Fiery & Savoury',
      category: 'starter',
      price: '₹210',
      spiceLevel: 'Signature Spicy',
      image: '/chicken-chilli.png',
      ingredients: ['Slit Green Chilies', 'Crisp Chicken Pieces', 'Curry Leaves', 'Ginger-Garlic', 'Spiced Glaze'],
      historyNote: 'Tossed on high heat with crisp aromatics for an unbeatable crunch and flavour.',
    },
  ];

  // Auto-cycle through the dishes every 2.0s with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleSlideClick = () => {
    const current = heroSlides[activeSlide];
    if (current.item) {
      onSelectMenuItem(current.item);
    } else if (current.action) {
      current.action();
    } else {
      onNavigate('menu');
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full bg-primary text-on-primary overflow-hidden py-6 sm:py-space-xl lg:py-space-2xl">
        {/* Ambient Ornamental Glows with Breathing Animation */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed opacity-10 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-secondary-container opacity-15 blur-2xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 relative z-10">

          {/* ── MOBILE / TABLET LAYOUT (hidden on lg+) ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {/* 1. Tagline + Title + Subtitle */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container w-fit shadow-sm animate-float-gentle border border-tertiary-fixed/20">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block" />
                <span className="text-[10px] uppercase tracking-wider text-tertiary-fixed font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['hero::tagline'] || "Bengaluru's Original · Since 1989"}
                </span>
              </div>
              <h1 className="font-bradley text-[2rem] sm:text-4xl text-tertiary-fixed leading-tight tracking-wide font-bold drop-shadow-md">
                {content['hero::title'] ? (
                  content['hero::title']
                ) : (
                  <>
                    The Taste{' '}
                    <span className="text-secondary-fixed">Every One Needs</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-primary-fixed-dim leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {content['hero::description'] || "Bengaluru's authentic donne palav, served with a legacy of flavour."}
              </p>
            </div>

            {/* 2. Image Carousel */}
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={handleSlideClick}
              className="relative w-full bg-primary-container rounded-2xl p-2 shadow-2xl border border-tertiary-fixed/30 group/hero cursor-pointer overflow-hidden select-none"
            >
              {/* Badge top-left */}
              <div className="absolute top-4 left-4 z-30 bg-primary-container/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-tertiary-fixed/20">
                <span className="text-[9px] uppercase font-bold tracking-widest text-tertiary-fixed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {heroSlides[activeSlide].badge || 'Balepet Original'}
                </span>
              </div>

              {/* Image box */}
              <div className="rounded-xl overflow-hidden relative shadow-inner bg-slate-950" style={{ height: '260px' }}>
                {heroSlides.map((slide, idx) => {
                  const isSlideActive = idx === activeSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isSlideActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isSlideActive ? 'scale-105' : 'scale-100'}`}
                      />
                    </div>
                  );
                })}

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

                {/* Bottom info card — dish name left, counter right */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-end justify-between gap-2" key={activeSlide}>
                  <div className="animate-fade-in-up min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base leading-tight truncate" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {heroSlides[activeSlide].name}
                    </h3>
                    <p className="text-[11px] text-white/70 mt-0.5 truncate" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {heroSlides[activeSlide].subtitle}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold text-tertiary-fixed" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {String(activeSlide + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-white/50" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {' '}/ {String(heroSlides.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CTAs — full-width rounded pills */}
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={() => onNavigate('menu')}
                className="w-full inline-flex items-center justify-between gap-2 px-5 py-3.5 bg-tertiary-fixed text-on-tertiary-fixed font-bold text-sm rounded-xl shadow-md cursor-pointer active:scale-95 interactive-lift"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <span>{content['hero::cta_primary'] || 'Explore Royal Menu'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={() => onNavigate('our-locations')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-container text-tertiary-fixed font-bold text-sm rounded-xl shadow-sm cursor-pointer interactive-lift border border-tertiary-fixed/20"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">location_on</span>
                <span>{content['hero::cta_secondary'] || 'Find Nearest Outlet'}</span>
              </button>
            </div>

            {/* 4. Stats bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 pb-1">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-tertiary-fixed leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::origin_year'] || '1989'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-primary-fixed-dim font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::origin_label'] || 'Origin Year'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 border-x border-tertiary-fixed/15">
                <span className="text-2xl font-bold text-tertiary-fixed leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::daily_diners'] || '300+'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-primary-fixed-dim font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::daily_label'] || 'Daily Diners'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-tertiary-fixed leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::years_legacy'] || '35+'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-primary-fixed-dim font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {content['stats::years_label'] || 'Years of Legacy'}
                </span>
              </div>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT (hidden below lg) ── */}
          <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
            {/* Text Column */}
            <div className="col-span-7 flex flex-col gap-4">
              {/* Tagline Chip with gentle float animation */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container w-fit shadow-sm animate-float-gentle border border-tertiary-fixed/20">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                  workspace_premium
                </span>
                <span className="font-label-sm text-xs uppercase tracking-wider text-tertiary-fixed font-bold">
                  {content['hero::tagline'] || 'SGS Non Veg Gundu Palav• Since 1989'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-bradley text-7xl text-tertiary-fixed leading-tight tracking-wide font-bold drop-shadow-md">
                {content['hero::title'] ? (
                  content['hero::title']
                ) : (
                  <>
                    The Taste <br />
                    <span className="text-secondary-fixed">Every One Needs</span>
                  </>
                )}
              </h1>

              {/* Subhead */}
              <p className="font-body-lg text-lg text-primary-fixed-dim max-w-xl leading-relaxed">
                {content['hero::description'] || "SGS Nonveg Gundu Palav — Bengaluru's beloved donne palav restaurant, rooted in authentic South Indian tradition since 1989. Serving over 300 happy customers daily."}
              </p>

              {/* CTAs */}
              <div className="flex flex-row items-center gap-2.5 pt-1">
                <button
                  onClick={() => onNavigate('menu')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tertiary-fixed text-on-tertiary-fixed font-title-md text-base rounded hover:bg-tertiary-fixed-dim transition-all shadow-md cursor-pointer font-bold active:scale-95 interactive-lift"
                >
                  <span>{content['hero::cta_primary'] || 'Explore Royal Menu'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate('our-locations')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-container text-tertiary-fixed font-title-md text-base rounded hover:bg-on-primary-fixed-variant transition-all shadow-sm cursor-pointer interactive-lift border border-tertiary-fixed/20"
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">storefront</span>
                  <span>{content['hero::cta_secondary'] || 'Find Nearest Outlet'}</span>
                </button>
              </div>

              {/* Heritage Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 bg-primary-container/40 p-4 rounded-xl backdrop-blur-sm border border-tertiary-fixed/15">
                <div className="flex flex-col text-left group p-2 rounded-lg hover:bg-primary-container/30 transition-all">
                  <span className="font-display-md text-4xl text-tertiary-fixed leading-none font-bold transition-transform group-hover:scale-105">
                    {content['stats::origin_year'] || '1989'}
                  </span>
                  <span className="font-label-sm text-xs text-primary-fixed-dim uppercase tracking-wider mt-1">
                    {content['stats::origin_label'] || 'Origin Year'}
                  </span>
                </div>
                <div className="flex flex-col text-left group p-2 rounded-lg hover:bg-primary-container/30 transition-all">
                  <span className="font-display-md text-4xl text-tertiary-fixed leading-none font-bold transition-transform group-hover:scale-105">
                    {content['stats::daily_diners'] || '300+'}
                  </span>
                  <span className="font-label-sm text-xs text-primary-fixed-dim uppercase tracking-wider mt-1">
                    {content['stats::daily_label'] || 'Daily Diners'}
                  </span>
                </div>
                <div className="flex flex-col text-left group p-2 rounded-lg hover:bg-primary-container/30 transition-all">
                  <span className="font-display-md text-4xl text-tertiary-fixed leading-none font-bold transition-transform group-hover:scale-105">
                    {content['stats::years_legacy'] || '35+'}
                  </span>
                  <span className="font-label-sm text-xs text-primary-fixed-dim uppercase tracking-wider mt-1">
                    {content['stats::years_label'] || 'Years Legacy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Graphic Frame - Animated Multi-Dish Showcase Carousel */}
            <div className="col-span-5 relative flex flex-col items-center w-full">
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={handleSlideClick}
                className="relative w-full max-w-[500px] bg-primary-container rounded-2xl p-3 shadow-2xl border border-tertiary-fixed/30 group/hero interactive-lift cursor-pointer overflow-hidden select-none"
              >
                {/* Image Showcase Box */}
                <div className="rounded-xl overflow-hidden relative shadow-inner h-[480px] bg-slate-950">
                  {heroSlides.map((slide, idx) => {
                    const isActive = idx === activeSlide;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
                        />
                      </div>
                    );
                  })}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 z-10 pointer-events-none" />

                  {/* Steam */}
                  <div className="absolute top-4 right-5 z-20 pointer-events-none flex flex-col items-center opacity-65">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[30px] animate-steam">mode_heat</span>
                  </div>

                  {/* Prev button */}
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Previous dish image"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white/95 flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  {/* Next button */}
                  <button
                    onClick={handleNextSlide}
                    aria-label="Next dish image"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white/95 flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>

                  {/* Floating Bottom Card */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-primary/95 backdrop-blur-md rounded-xl flex items-center justify-between border border-tertiary-fixed/40 shadow-2xl z-20 transition-all gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0" key={activeSlide}>
                      <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-tertiary-fixed shrink-0 border border-tertiary-fixed/30 animate-fade-in shadow-md">
                        <span className="material-symbols-outlined text-[22px]">
                          {heroSlides[activeSlide].icon}
                        </span>
                      </div>
                      <div className="animate-fade-in-up min-w-0 flex-1">
                        <h3 className="font-title-lg text-lg font-bold text-tertiary-fixed leading-tight tracking-wide truncate">
                          {heroSlides[activeSlide].name}
                        </h3>
                        <p className="font-body-sm text-[11px] text-primary-fixed-dim mt-0.5 truncate">
                          {heroSlides[activeSlide].subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-label-sm text-[10px] text-tertiary-fixed uppercase font-bold tracking-wider bg-primary-container px-1.5 py-0.5 rounded border border-tertiary-fixed/20 shadow-sm">
                        {heroSlides[activeSlide].badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-2 mt-0.5">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(idx);
                      }}
                      aria-label={`Jump to ${slide.name}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeSlide
                        ? 'w-7 bg-tertiary-fixed shadow-[0_0_8px_rgba(255,223,150,0.8)]'
                        : 'w-2 bg-tertiary-fixed/30 hover:bg-tertiary-fixed/60'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: SIGNATURE SPECIALTIES SHOWCASE */}
      <section className="w-full bg-surface py-10 sm:py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-6 sm:gap-space-xl">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-1.5 sm:gap-space-xs max-w-2xl mx-auto">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase bg-surface-container-high px-space-md py-space-xs rounded-full">
              Iconic Offerings
            </span>
            <h2 className="font-bradley text-2xl sm:text-4xl lg:text-5xl text-primary font-bold tracking-wide">
              The Masters of SGS
            </h2>
            <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            <p className="font-body-md text-body-md text-on-surface-variant pt-1 max-w-2xl leading-relaxed hidden sm:block">
              Every dish reflects our rich Balepet heritage, prepared with authentic spices, fresh ingredients, and traditional recipes to deliver a bold aroma and unforgettable taste in every bite.
            </p>
            {/* Mobile-only shorter description */}
            <p className="font-body-md text-sm text-on-surface-variant pt-1 leading-relaxed sm:hidden">
              Authentic Balepet heritage, prepared fresh daily with traditional spices.
            </p>
          </div>

          {/* 3-Card Grid — single col on mobile, 3-col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-space-lg">
            {/* Card 1: Donne Palav */}
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-primary/10 interactive-lift">
              <div className="h-48 sm:h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  alt="Chicken Donne Palav"
                  src={chickenPalav.image}
                />
                <span className="absolute top-space-sm left-space-sm bg-primary text-tertiary-fixed font-label-sm text-label-sm px-space-sm py-space-xs rounded uppercase tracking-wider shadow">
                  Crown Jewel
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1 justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary-container transition-colors">
                    Chicken Donne Palav
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Signature rice dish served in a traditional leaf bowl with half egg, lime and salad.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-space-sm bg-surface-container-low p-space-sm rounded-lg">
                  <button
                    onClick={() => onSelectMenuItem(chickenPalav)}
                    className="font-title-md text-title-md text-primary hover:text-secondary flex items-center gap-space-xs cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Recipe</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Kshatriya Kabab */}
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-primary/10 interactive-lift">
              <div className="h-48 sm:h-64 overflow-hidden relative">
                <img
                  alt="Crispy Kshatriya Kabab"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  src={kshatriyaKabab.image}
                />
                <span className="absolute top-space-sm left-space-sm bg-tertiary text-on-tertiary font-label-sm text-label-sm px-space-sm py-space-xs rounded uppercase tracking-wider shadow">
                  Secret Spice Crust
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1 justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary-container transition-colors">
                    Crispy Kshatriya Kabab
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    A signature SGS chicken specialty, prepared with a bold blend of aromatic spices for a rich flavour, fiery kick, and authentic Balepet taste in every bite.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-space-sm bg-surface-container-low p-space-sm rounded-lg">
                  <button
                    onClick={() => onSelectMenuItem(kshatriyaKabab)}
                    className="font-title-md text-title-md text-primary hover:text-secondary flex items-center gap-space-xs cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Mutton Donne Palav */}
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-primary/10 interactive-lift">
              <div className="h-48 sm:h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  alt="Mutton Donne Palav"
                  src={muttonPalav.image}
                />
                <span className="absolute top-space-sm left-space-sm bg-primary text-tertiary-fixed font-label-sm text-label-sm px-space-sm py-space-xs rounded uppercase tracking-wider shadow">
                  Limited Morning Degh
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1 justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary-container transition-colors">
                    Royal Mutton Donne Palav
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Slow-braised Karnataka mutton simmered with 17 traditional spices in authentic brass degh and Jeera Samba rice.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-space-sm bg-surface-container-low p-space-sm rounded-lg">
                  <button
                    onClick={() => onSelectMenuItem(muttonPalav)}
                    className="font-title-md text-title-md text-primary hover:text-secondary flex items-center gap-space-xs cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Recipe</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE BALEPET CHRONICLE (ABOUT US PREVIEW) */}
      <section className="w-full bg-surface-container-low py-10 sm:py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-space-xl items-center">
            {/* Story Column */}
            <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-space-md">
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase bg-surface-container-high px-space-md py-space-xs rounded-full w-fit">
                {content['heritage::badge'] || 'The Story of Our Balepet Heritage'}
              </span>
              <h2 className="font-display-md text-display-md-mobile lg:text-display-md text-on-surface leading-tight">
                {content['heritage::title'] || 'Founded by Late Gundu Muneshwara & Savithri'}
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full" />
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {content['heritage::content'] || (
                  <>
                    In 1989, Gundu Muneshwara and his wife Savithri started their journey in Balepet with a passion for traditional cooking and a unique Donne Palav recipe. Which began as a small home-based business grew through the love and support of customers.
                    <br /><br />
                    Today, their four sons continue the family tradition, preparing special masalas and preserving the authentic taste that has made SGS Gundu Palav a beloved name for generations.
                  </>
                )}
              </p>

              {/* Core Value Badges with hover lift - responsive grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-space-sm pt-space-xs">
                <div className="bg-surface-container-lowest p-space-sm sm:p-space-md rounded-lg shadow-sm text-center border border-primary/10 interactive-lift group min-w-0">
                  <span className="material-symbols-outlined text-primary text-[24px] sm:text-[28px] group-hover:scale-110 transition-transform">
                    family_restroom
                  </span>
                  <p className="font-title-md text-base sm:text-title-md text-primary mt-1 sm:mt-space-xs font-bold">4 Sons</p>
                  <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Upholding Heritage</p>
                </div>
                <div className="bg-surface-container-lowest p-space-sm sm:p-space-md rounded-lg shadow-sm text-center border border-primary/10 interactive-lift group min-w-0">
                  <span className="material-symbols-outlined text-primary text-[24px] sm:text-[28px] group-hover:scale-110 transition-transform">skillet</span>
                  <p className="font-title-md text-base sm:text-title-md text-primary mt-1 sm:mt-space-xs font-bold">Brass Degh</p>
                  <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Slow Charcoal Dum</p>
                </div>
                <div className="bg-surface-container-lowest p-space-sm sm:p-space-md rounded-lg shadow-sm text-center border border-primary/10 interactive-lift group min-w-0">
                  <span className="material-symbols-outlined text-primary text-[24px] sm:text-[28px] group-hover:scale-110 transition-transform">
                    diversity_1
                  </span>
                  <p className="font-title-md text-base sm:text-title-md text-primary mt-1 sm:mt-space-xs font-bold">35+ Years</p>
                  <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Unchanged Recipe</p>
                </div>
              </div>

              <div className="pt-space-xs">
                <button
                  onClick={() => onNavigate('about-us')}
                  className="inline-flex items-center gap-space-xs text-primary font-title-lg text-base sm:text-title-lg hover:text-secondary transition-colors cursor-pointer group font-bold"
                >
                  <span className="group-hover:underline">Read Our Full Story</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative border border-primary/20 interactive-lift group">
                <img
                  alt="Heritage brass cauldrons in SGS Gundu Palav kitchen"
                  className="w-full aspect-[1536/1474] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src="/balepet-woodfire.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-25% to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-space-md left-3 sm:left-space-md right-3 sm:right-space-md text-on-primary pointer-events-none">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUTLETS QUICK BANNER & FRANCHISE OPPORTUNITY */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-space-lg">
          {/* Outlet Banner */}
          <div className="bg-surface-container p-4 sm:p-space-lg lg:p-space-xl rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-sm border border-primary/10 interactive-lift">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md w-full lg:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary flex items-center justify-center text-tertiary-fixed shrink-0 shadow-md animate-pulse-glow">
                <span className="material-symbols-outlined text-[24px] sm:text-[32px]">pin_drop</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs sm:text-label-sm text-primary uppercase tracking-wider font-bold">
                  Experience The Magic Live
                </span>
                <h3 className="font-headline-lg text-xl sm:text-headline-lg text-on-surface leading-tight font-bold">
                  Visit Our Balepet Flagship &amp; Network Outlets
                </h3>
                <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-space-xs">
                  Balepet • Jayanagar • Hessarghatta • Vajarahalli • Ullal • Outlets @ IT Campus (Karle, EGL, ETV, Ecospace) • Mysore • Tumkur • Hubballi • Hosur &amp; more.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-space-md w-full lg:w-auto">
              <button
                onClick={() => onNavigate('our-locations')}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-2.5 sm:py-space-md bg-primary text-on-primary font-title-md text-sm sm:text-title-md rounded hover:bg-primary-container transition-all shadow-md cursor-pointer active:scale-95 font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">directions</span>
                <span>View All Outlets &amp; Maps</span>
              </button>
            </div>
          </div>

          {/* Franchise Opportunity Hotline Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary p-4 sm:p-space-lg lg:p-space-xl rounded-2xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg relative overflow-hidden border border-tertiary-fixed/30 interactive-lift">
            <div className="flex flex-col gap-space-xs max-w-2xl relative z-10 w-full lg:w-auto">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-container text-tertiary-fixed w-fit border border-tertiary-fixed/20 animate-float-gentle">
                <span className="material-symbols-outlined text-[15px] sm:text-[16px]">handshake</span>
                <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider font-bold">
                  Franchise &amp; Expansion Partnerships
                </span>
              </div>
              <h3 className="font-headline-lg text-xl sm:text-2xl lg:text-headline-lg text-tertiary-fixed leading-tight font-bold">
                Partner With Karnataka’s Most Beloved Gundu Palav Brand
              </h3>
              <p className="font-body-md text-xs sm:text-body-md text-primary-fixed-dim leading-relaxed">
                Bring SGS Gundu Palav’s legendary heritage, high operational margins, and dedicated central spice kitchen support to your city.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-space-md shrink-0 w-full lg:w-auto relative z-10">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-space-lg py-2.5 sm:py-space-md bg-tertiary-fixed text-on-tertiary-fixed font-title-lg text-sm sm:text-title-lg rounded hover:bg-tertiary-fixed-dim transition-all shadow-md font-bold active:scale-95"
                href={`tel:${BRAND.phone}`}
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">phone_in_talk</span>
                <span>{BRAND.displayPhone}</span>
              </a>
              <button
                onClick={onOpenFranchiseModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-space-lg py-2.5 sm:py-space-md bg-primary text-tertiary-fixed font-title-md text-sm sm:text-title-md rounded hover:bg-on-primary-fixed-variant transition-all cursor-pointer border border-tertiary-fixed/30 active:scale-95 font-bold"
              >
                <span>Franchise Opportunities</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
