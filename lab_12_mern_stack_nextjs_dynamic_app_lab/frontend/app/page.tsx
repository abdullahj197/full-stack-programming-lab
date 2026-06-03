import Hero from '../components/Hero';
import ProductTabs from '../components/ProductTabs';
import HotDeal from '../components/HotDeal';
import LatestUpdates from '../components/LatestUpdates';

export default function Home() {
  return (
    <div>
      <Hero />
      <ProductTabs />
      <HotDeal />
      <LatestUpdates />
    </div>
  );
}
