export default function Header({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`md:sticky top-0 border-b px-4 border-zinc-700/75 w-full backdrop-blur-lg bg-black/70 z-50 flex justify-around ${props.className}`}
    >
      {props.children}
    </div>
  );
}
