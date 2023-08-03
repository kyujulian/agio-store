import { getMenu } from "@/lib/shopify";

export default async function Navbar() {
  const menu = await getMenu("main-menu");
  return (
    <nav>
      <ul className="flex justify-around items-around w-[200px]">
        {menu.map((item) => {
          return (
            <li key={item.id} className="px-5">
              {item.title} <br />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
