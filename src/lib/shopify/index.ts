
import {
  Product
} from './types'


export async function getCollectionProducts({
  collectionId,
  reverse,
  sortKey
}: {
  collectionId: string;
  reverse?: boolean;
  sortKey?: string;
}) : Promise<Product[]> {

}