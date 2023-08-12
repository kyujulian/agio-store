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
    <div className=" overflow- flex h-fit max-h-[90vh] w-screen flex-col items-center justify-center">
      <Image
        src={HeroBackgroundImage}
        alt="hero-bg"
        objectFit="cover"
        className="absolute top-0 z-[-1]  brightness-[60%] "
      />
      <HeroText productUrl={mainProduct.handle} />
    </div>
  );
}
