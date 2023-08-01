import { Montserrat } from "@next/font/google";
// import { GridItem } from "components/grid";

export const metadata = {
  description:
    "Portfolio project: High-performance e-commerce store built with Next.js and Shopify",
  openGraph: {
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <main className="flex h-screen">
        <div className=" h-full w-full flex justify-center  items-center ">
          <h1 className="text-[42px] font-bold"> Agio StoreFront </h1>
        </div>
      </main>
    </>
  );
}
