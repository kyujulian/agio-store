import { getCollectionProducts } from "@/lib/shopify";
function ThreeItemGridItem() {}

export async function ThreeItemGrid() {
  //Collections that start with `hidden-*` are hidden from the search page.

  const homepageItems = await getCollectionProducts({
    collection: `hidden-homepage-featured-items`,
  });
}
