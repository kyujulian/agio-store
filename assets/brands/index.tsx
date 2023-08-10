import { StaticImageData } from 'next/image';
import NewEraLogo from './New-Era-Logo.png';
import NorthFaceLogo from './northFace-white.png';
import NYLogo from './ny-white.png';
import UnderArmourLogo from './underArmour-white.png';

//black brands
import NyBlackLogo from './ny.png';
import UnderArmourBlackLogo from './underArmour.png';
import NorthFaceBlackLogo from './northFace.png';

export type Brand = {
  src: StaticImageData;
  name: string;
};

export const whiteBrands: Brand[] = [
  { src: NewEraLogo, name: 'New Era logo' },
  { src: NorthFaceLogo, name: 'North Face logo' },
  { src: NYLogo, name: 'NY logo' },
  { src: UnderArmourLogo, name: 'Under Armour logo' },
];

export const blackBrands: Brand[] = [
  { src: NyBlackLogo, name: 'NYlogo' },
  { src: NorthFaceBlackLogo, name: 'North Face logoe' },
  { src: UnderArmourBlackLogo, name: 'UnderArmour logo' },
  { src: NewEraLogo, name: 'NewEra logo' },
];
