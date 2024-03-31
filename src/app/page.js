import Image from "next/image";
import Map from './components/Map';
import Instructions from "./components/Instructions";

export default function Home() {
  return (
    <div>
      <Instructions />
      <Map />
    </div>

  );
}
