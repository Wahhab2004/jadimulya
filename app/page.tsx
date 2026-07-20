"use client";

import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HomepageOverview from './sections/HomepageOverview';
import { initialHomepageContent, loadStoredHomepageContent, type HomepageContent } from '@/lib/homepage-store';
import { initialPotensiItems, loadStoredPotensiItems } from '@/lib/potensi-store';

export default function HomePage() {
  const [content, setContent] = useState<HomepageContent>(initialHomepageContent);
  const [potensiItems, setPotensiItems] = useState(initialPotensiItems);

  useEffect(() => {
    const potensi = loadStoredPotensiItems();
    setPotensiItems(potensi);
    setContent(loadStoredHomepageContent(potensi));
  }, []);

  const featuredPotensi = useMemo(() => {
    const map = new Map(potensiItems.map((item) => [item.id, item]));
    const selected = content.featuredPotensiIds
      .map((id) => map.get(id))
      .filter((item): item is (typeof initialPotensiItems)[number] => Boolean(item));

    return selected.length > 0 ? selected : potensiItems.slice(0, 3);
  }, [content.featuredPotensiIds, potensiItems]);

  const latestNews = useMemo(() => content.news.slice(0, 3), [content.news]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        slogan={content.slogan}
        ctaLabel={content.jelajahiLabel}
        ctaHref={content.jelajahiHref}
        logoKabupatenLabel={content.logoKabupatenLabel}
        logoKabupatenImageUrl={content.logoKabupatenImageUrl}
        slides={content.heroSlides}
        stats={content.stats}
      />
      <HomepageOverview features={featuredPotensi} news={latestNews} />
      <Footer />
    </main>
  );
}
