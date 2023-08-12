import { getCollectionProducts } from '@/lib/shopify';
import HeroBackgroundImage from '../../../assets/hero-bg.png';
import Image from 'next/image';
import HeroText from './text';

export default async function Hero() {
  const heroProducts = await getCollectionProducts({
    collection: 'hidden-hero',
  });

  const mainProduct = heroProducts[0];

  return (
    <div className=" flex h-fit max-h-[90vh] w-full flex-col items-center justify-center overflow-x-hidden">
      <Image
        src={HeroBackgroundImage}
        alt="hero-bg"
        className="absolute top-0 z-[-1] w-full min-w-[1280px] overflow-hidden brightness-[60%] "
      />
      <HeroText productUrl={mainProduct.handle} />
    </div>
  );
}
