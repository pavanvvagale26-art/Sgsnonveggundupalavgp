import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { supabase } from '../lib/supabase';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenFranchiseModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenFranchiseModal,
}) => {
  const section2Images = [
    {
      src: '/about-page-6.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 1',
    },
    {
      src: '/about-page-3.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 2',
    },
    {
      src: '/about-page-4.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 3',
    },
    {
      src: '/about-page-2.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 4',
    },
    {
      src: '/about-page-1.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 5',
    },
    {
      src: '/about-page-5.jpeg',
      alt: 'SGS Gundu Palav culinary legacy dish presentation 6',
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadContent() {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('section, key, value')
          .eq('page', 'about');
        if (!error && data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach(d => {
            map[`${d.section}::${d.key}`] = d.value;
          });
          setContent(map);
        }
      } catch {
        // default fallback
      }
    }
    loadContent();
  }, []);

  // Auto-cycle through the dishes every 2.0s with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % section2Images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, section2Images.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + section2Images.length) % section2Images.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % section2Images.length);
  };
  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: PAGE HEADER & HERO NARRATIVE BAND */}
      <section className="relative bg-primary text-on-primary overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-space-2xl">        {/* Atmospheric Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-tertiary-fixed/10 blur-2xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Heritage Insignia Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface/5 shadow-sm mb-3 sm:mb-space-md border border-tertiary-fixed/30">
              <span className="material-symbols-outlined text-tertiary-fixed text-[16px] sm:text-[18px]">
                workspace_premium
              </span>
              <span className="font-label-sm text-[11px] sm:text-xs uppercase tracking-wider text-tertiary-fixed font-bold">
                {content['hero::tagline'] || 'The Legacy of Authentic SGS Palav'}
              </span>
            </div>

            <h1 className="font-bradley text-3xl sm:text-5xl lg:text-display-lg text-tertiary-fixed tracking-tight leading-tight mb-3 sm:mb-space-md font-bold">
              {content['hero::title'] || 'The Story of SGS Nonveg Gundu Palav'}
            </h1>

            {/* Filigree Floral Separator Motif */}
            <div className="flex items-center justify-center gap-2 sm:gap-space-sm w-full my-1 sm:my-space-sm opacity-90">
              <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-tertiary-fixed" />
              <span className="material-symbols-outlined text-tertiary-fixed text-[18px] sm:text-[20px]">cruelty_free</span>
              <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-tertiary-fixed" />
            </div>

            <p className="font-body-lg text-sm sm:text-base lg:text-body-lg text-primary-fixed-dim mt-2 sm:mt-space-sm max-w-2xl leading-relaxed whitespace-pre-line">
              {content['hero::description'] || 'From a humble beginning in Balepet to a trusted name in traditional palav, our journey is built on traditional recipes, slow cooking, and the authentic family spice blend passed down since 1989.'}
            </p>

            {/* Quick Heritage Stat Chips - 2 cols on mobile, 4 cols on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-space-sm w-full mt-6 sm:mt-space-xl pt-2 sm:pt-space-md">
              <div className="p-2 sm:p-space-sm bg-primary-container rounded shadow-sm flex flex-col items-center border border-tertiary-fixed/20">
                <span className="font-headline-md text-xl sm:text-headline-md text-tertiary-fixed font-bold">35+</span>
                <span className="font-label-sm text-[10px] sm:text-xs text-primary-fixed-dim uppercase tracking-wider mt-0.5">
                  Years Unbroken
                </span>
              </div>
              <div className="p-2 sm:p-space-sm bg-primary-container rounded shadow-sm flex flex-col items-center border border-tertiary-fixed/20">
                <span className="font-headline-md text-xl sm:text-headline-md text-tertiary-fixed font-bold">100%</span>
                <span className="font-label-sm text-[10px] sm:text-xs text-primary-fixed-dim uppercase tracking-wider mt-0.5">
                  Brass Handi Dum
                </span>
              </div>
              <div className="p-2 sm:p-space-sm bg-primary-container rounded shadow-sm flex flex-col items-center border border-tertiary-fixed/20">
                <span className="font-headline-md text-xl sm:text-headline-md text-tertiary-fixed font-bold">0%</span>
                <span className="font-label-sm text-[10px] sm:text-xs text-primary-fixed-dim uppercase tracking-wider mt-0.5">
                  Artificial Flavors
                </span>
              </div>
              <div className="p-2 sm:p-space-sm bg-primary-container rounded shadow-sm flex flex-col items-center border border-tertiary-fixed/20">
                <span className="font-headline-md text-xl sm:text-headline-md text-tertiary-fixed font-bold">4 Sons</span>
                <span className="font-label-sm text-[10px] sm:text-xs text-primary-fixed-dim uppercase tracking-wider mt-0.5">
                  Our Commitment
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE GENESIS - 1989 & KITCHEN HERITAGE */}
      <section className="relative bg-surface py-8 sm:py-14 lg:py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-space-xl items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative">
              <div
                className="relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-xl p-space-xs border border-primary/10 group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative aspect-[1536/1474] w-full rounded-lg overflow-hidden bg-primary">
                  {section2Images.map((img, idx) => (
                    <img
                      key={img.src}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${idx === activeImageIndex
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                        }`}
                      alt={img.alt}
                      src={img.src}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Manual Arrow Controls (visible on hover) */}
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Previous image"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    aria-label="Next image"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">chevron_right</span>
                  </button>

                  {/* Inset Heritage Badge with Pagination Dots */}
                  <div className="absolute bottom-2.5 sm:bottom-space-md left-2.5 sm:left-space-md right-2.5 sm:right-space-md p-2.5 sm:p-space-md bg-primary/95 backdrop-blur-sm rounded-lg text-on-primary shadow-lg border border-tertiary-fixed/30 z-20">
                    <div className="flex items-center justify-between gap-2 sm:gap-space-sm">
                      <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px] sm:text-[24px] shrink-0">
                          restaurant
                        </span>
                        <div className="truncate">
                          <h4 className="font-title-md text-xs sm:text-title-md text-tertiary-fixed font-bold truncate">
                            Authentic Balepet Heritage
                          </h4>
                          <p className="font-body-sm text-[10px] sm:text-body-sm text-primary-fixed-dim truncate">
                            Traditional recipes perfected since 1989.
                          </p>
                        </div>
                      </div>

                      {/* Dots indicator */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {section2Images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-2 rounded-full transition-all cursor-pointer ${i === activeImageIndex
                              ? 'w-5 sm:w-6 bg-tertiary-fixed shadow'
                              : 'w-2 bg-white/40 hover:bg-white/80'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block absolute -bottom-4 -right-4 w-48 h-48 bg-secondary-container/20 rounded-xl -z-10" />
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="h-2 w-2 rounded-full bg-tertiary-container" />
                <span className="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">
                  The Genesis • 1989
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary leading-tight">
                Born in the Heart of Historic Balepet
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                In 1989, SGS Nonveg Gundu Palav began its journey in Balepet, Bengaluru, with a simple yet unique idea from Gundu Muneshwara and Savithri: serving Chicken Pulao in a traditional Donne, a bowl made from dried banana leaves.
                <br /><br />
                At a time when non-vegetarian restaurants served food on traditional plates, this takeaway concept offered customers a new way to enjoy their favourite pulao. While Gundu Muneshwara brought the vision, his wife Savithri's special recipe gave the dish its distinctive taste.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed hidden sm:block">
                Starting with just 2 kg of pulao prepared at home, the business grew without advertisements or publicity. The delicious taste of the pulao spread through word of mouth, attracting more and more food lovers.
                <br /><br />
                As customers enjoyed the pulao served in a Donne, locals began calling it Donne Biryani. Over time, the name became widely popular, inspiring many restaurants to introduce Donne Biryani to their menus.
                <br /><br />
                Which started as a small family venture became the foundation of SGS Nonveg Gundu Palav, a name rooted in Balepet's food heritage and built on a simple belief: great taste speaks for itself.
              </p>
              {/* Mobile-only condensed version of second paragraph */}
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed sm:hidden">
                Starting with just 2 kg of pulao, the business grew purely by word of mouth — giving birth to Bengaluru's beloved "Donne Biryani" culture.
              </p>

              {/* Quote Block */}
              <div className="p-space-md bg-surface-container-low rounded-lg mt-space-sm shadow-sm border-l-4 border-primary">
                <p className="font-headline-sm text-headline-sm text-primary italic leading-snug">
                  “Today, we remain proud of our Balepet roots and the family tradition that started it all. At SGS Nonveg Gundu Palav, we continue to serve the flavours that have brought generations of food lovers together, carrying our heritage forward with every serving.”
                </p>
                <span className="font-label-md text-label-md text-on-surface-variant block mt-space-xs font-semibold">
                  — Sri Gundu Muneshwara &amp; Smt. Savithri Family
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEGACY KEPT ALIVE BY FOUR SONS */}
      <section className="relative bg-primary text-on-primary py-space-2xl overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-space-xl">
            <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider block mb-space-xs font-bold">
              Custodians of Sacred Taste
            </span>
            <h2 className="font-display-md text-display-md-mobile lg:text-display-md text-tertiary-fixed">
              The Four Sons: Guardians of the Flame
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim mt-space-sm">
              Carrying the tradition forward and growing together as a family to preserve our authentic Balepet heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-space-lg">
            {/* Pillar Card 1 */}
            <div className="bg-primary-container p-space-lg rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border border-tertiary-fixed/20">
              <div>
                <div className="w-12 h-12 rounded bg-tertiary-fixed/15 flex items-center justify-center text-tertiary-fixed mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">trending_up</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-tertiary-fixed mb-space-xs">
                  Carrying the Tradition
                </h3>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
                  As the business grew, Gundu Muneshwara and Savithri's sons, Vishwanath and Ramesh, joined them in carrying the family tradition forward.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider mt-space-md block font-bold">
                Vishwanath &amp; Ramesh
              </span>
            </div>

            {/* Pillar Card 2 */}
            <div className="bg-primary-container p-space-lg rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border border-tertiary-fixed/20">
              <div>
                <div className="w-12 h-12 rounded bg-tertiary-fixed/15 flex items-center justify-center text-tertiary-fixed mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">schedule</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-tertiary-fixed mb-space-xs">
                  Sold Out by 2 PM
                </h3>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
                  By preparing limited quantities and maintaining specific serving times, they created a strong demand for the pulao, which often sold out by 2 PM.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider mt-space-md block font-bold">
                Limited Daily Batches
              </span>
            </div>

            {/* Pillar Card 3 */}
            <div className="bg-primary-container p-space-lg rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border border-tertiary-fixed/20">
              <div>
                <div className="w-12 h-12 rounded bg-tertiary-fixed/15 flex items-center justify-center text-tertiary-fixed mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">diversity_3</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-tertiary-fixed mb-space-xs">
                  Growing as a Family
                </h3>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
                  Later, their other two sons, Keshava and Mahendra, joined their brothers. Together, all four brothers continued developing the business while preserving the taste and traditions.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider mt-space-md block font-bold">
                Keshava &amp; Mahendra
              </span>
            </div>

            {/* Pillar Card 4 */}
            <div className="bg-primary-container p-space-lg rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border border-tertiary-fixed/20">
              <div>
                <div className="w-12 h-12 rounded bg-tertiary-fixed/15 flex items-center justify-center text-tertiary-fixed mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">soup_kitchen</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-tertiary-fixed mb-space-xs">
                  Our Secret to Taste
                </h3>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">
                  From the beginning, Savithri prepared the masalas herself using carefully selected ingredients. Today, the four brothers continue preparing their own pulao masalas.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider mt-space-md block font-bold">
                Distinctive Family Masalas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MILESTONES TIMELINE */}
      <section className="relative bg-surface-container-low py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <span className="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">
              Evolution Of An Icon
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs">
              Chronicles of Flavor &amp; Milestones
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              From a Balepet side alley to Karnataka's culinary lexicon, track our defining chapters.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:gap-space-2xl relative">
            {/* Milestone 1: 1989 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/10">
                <span className="font-display-md text-display-md text-tertiary-container font-headline-lg block leading-none mb-space-xs">
                  1989
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">
                  The Beginning — 1989
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Starting with just 2 kg of pulao prepared at home with Savithri's special recipe, the business grew without advertisements, thanks to the love and word-of-mouth recommendations of our customers. As more people enjoyed our pulao served in a Donne, locals began calling it Donne Biryani across Bengaluru.
                </p>
              </div>
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center milestone-icon-col">
                <div className="w-12 h-12 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[24px]">flag</span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="p-space-md bg-surface-container rounded-lg shadow-inner border border-primary/10">
                  <div className="flex items-center gap-space-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[28px]">restaurant</span>
                    <div>
                      <h4 className="font-title-md text-title-md text-primary">
                        First Home-Made 2 kg Batch
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Unique takeaway concept in dried banana leaf Donne bowls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone 2: 2001 (Kshatriya Kabab) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-surface-container-lowest border border-primary/10">
                  <img
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    alt="Crispy golden deep-fried South Indian Kshatriya chicken kabab morsels"
                    src="/kshatriya-kabab.png"
                  />
                  <div className="p-space-md bg-primary text-on-primary">
                    <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider block font-bold">
                      Signature Specialty
                    </span>
                    <p className="font-title-md text-title-md text-on-primary">
                      Our Signature Specialty
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2 hidden lg:flex items-center justify-center milestone-icon-col">
                <div className="w-12 h-12 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[24px]">star</span>
                </div>
              </div>
              <div className="lg:col-span-5 order-3 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/10">
                <span className="font-display-md text-display-md text-tertiary-container font-headline-lg block leading-none mb-space-xs">
                  2001
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">
                  Our Signature Specialty
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  In 2001, we introduced Kshatriya Kabab, which quickly became a favourite among food lovers. Over time, growing customer demand inspired us to expand our menu with Chicken Kabab, Pepper Chicken, Chilli Chicken, and other delicious starters to complement our signature pulao.
                </p>
              </div>
            </div>

            {/* Milestone 3: 2017 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/10">
                <span className="font-display-md text-display-md text-tertiary-container font-headline-lg block leading-none mb-space-xs">
                  2017
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">
                  Expanding Our Legacy — 2017
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  In 2017, we began expanding through franchising under the name SGS Nonveg Gundu Palav, named after our founder, Gundu Muneshwara. Since then, our presence has grown across multiple locations, supported by the continued love and trust of our customers.
                </p>
              </div>
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center milestone-icon-col">
                <div className="w-12 h-12 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="p-space-md bg-surface-container rounded-lg shadow-inner border border-primary/10">
                  <div className="flex items-center gap-space-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[28px]">storefront</span>
                    <div>
                      <h4 className="font-title-md text-title-md text-primary">
                        SGS Nonveg Gundu Palav Franchising
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Named with honour after founder Gundu Muneshwara.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone 4: Today */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-surface-container-lowest border border-primary/10">
                  <div className="relative w-full h-64 overflow-hidden bg-primary/20 flex items-center justify-center">
                    {/* Ambient fill covering the container */}
                    <img
                      src="/franchise-pic22.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-35 scale-110 pointer-events-none"
                    />
                    {/* Entire uncropped image displayed without losing any part */}
                    <img
                      alt="SGS Nonveg Gundu Palav culinary tradition and generations of food lovers"
                      className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                      src="/franchise-pic22.png"
                    />
                  </div>
                  <div className="p-space-md bg-primary text-on-primary">
                    <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider block font-bold">
                      Generations of Flavor
                    </span>
                    <p className="font-title-md text-title-md text-on-primary">
                      Proud Balepet Roots
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2 hidden lg:flex items-center justify-center milestone-icon-col">
                <div className="w-12 h-12 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[24px]">restaurant</span>
                </div>
              </div>
              <div className="lg:col-span-5 order-3 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/10">
                <span className="font-display-md text-display-md text-tertiary-container font-headline-lg block leading-none mb-space-xs">
                  Today
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">
                  Generations of Food Lovers
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Today, we remain proud of our Balepet roots and the family tradition that started it all. At SGS Nonveg Gundu Palav, we continue to serve the flavours that have brought generations of food lovers together, carrying our heritage forward with every serving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: REGAL CALL TO ACTION */}
      <section className="relative bg-primary text-on-primary py-space-2xl overflow-hidden shadow-2xl border-t border-tertiary-fixed/30">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin relative z-10 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Floating Crest Motif */}
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg mb-space-md">
              <span className="material-symbols-outlined text-[32px]">dinner_dining</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider font-bold">
              Experience The Legend
            </span>
            <h2 className="font-display-md text-display-md-mobile lg:text-display-md text-tertiary-fixed mt-space-xs mb-space-sm leading-tight">
              Taste The Living Tradition
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl mb-space-xl leading-relaxed">
              Step into our cauldrons of aroma at your nearest outlet or partner with Karnataka's fastest growing authentic heritage franchise network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-md">
              <button
                onClick={() => onNavigate('our-locations')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg rounded shadow hover:bg-tertiary-fixed-dim transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                <span>Locate Nearest Branch</span>
              </button>
              <button
                onClick={onOpenFranchiseModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md bg-primary-container text-tertiary-fixed font-label-lg text-label-lg rounded shadow hover:bg-primary-container/80 transition-all cursor-pointer border border-tertiary-fixed/30 font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">business_center</span>
                <span>Franchise Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
