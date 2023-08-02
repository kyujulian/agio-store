import { Montserrat } from "@next/font/google";
// import { GridItem } from "components/grid";
import { getCollectionProducts } from "@/lib/shopify";

export const metadata = {
  description:
    "Portfolio project: High-performance e-commerce store built with Next.js and Shopify",
  openGraph: {
    type: "website",
  },
};

export default async function Home() {
  const homepageItems = await getCollectionProducts({
    collectionId: "Caps",
  });
  return (
    <>
      <main className="flex h-screen">
        <div className=" h-full flex-col w-full flex justify-center  items-center ">
          <h1 className="text-[42px] font-bold"> Agio StoreFront </h1>
          <ul className="text-slate-200 p-7 w-[500px] rounded-md border-[1px] border-slate-200">
            {homepageItems.map((item) => (
              <li key={item.id} className="py-5">
                <b>Product Title:</b> {item.title} <br />
                <b>Description:</b>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
