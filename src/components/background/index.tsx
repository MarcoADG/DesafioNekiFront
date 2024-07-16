import arcadeBackground from "../../assets/arcade-background.jpg";
import Image from "next/image";

export default function BackgroundImage() {
  return (
    <Image
      className="-z-10"
      alt="background image"
      src={arcadeBackground}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{ objectFit: "cover" }}
    />
  );
}
