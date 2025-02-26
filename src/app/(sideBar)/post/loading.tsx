import Image from "next/image";

export default function Loading() {
  return <Image width={40} height={40} src="/loading.svg" alt="Loading" className="pt-16 opacity-60"/>;
}
