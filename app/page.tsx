import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HomepageOverview from './sections/HomepageOverview';
import { heroData, homepageStats, homepageFeatures, homepageNews } from '@/lib/homeData';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection title={heroData.title} subtitle={heroData.subtitle} actions={heroData.actions} stats={homepageStats} />
      <HomepageOverview features={homepageFeatures} news={homepageNews} />
      <Footer />
    </main>
  );
}
