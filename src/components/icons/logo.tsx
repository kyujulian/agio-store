import clsx from "clsx";

export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      id="Camada_2"
      data-name="Camada 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 485.65 494.84"
      {...props}
      className={clsx("h-6 w-6", props.className)}
    >
      <polygon
        className="fill-black dark:fill-white"
        points="213.43 149.81 94.09 356.52 158.22 356.52 186.41 420.09 .87 420.09 242.83 1 484.79 420.09 369.47 420.09 213.43 149.81"
      />
    </svg>
  );
}
