import Navbar from '../components/Navbar';
import HeroOverlay from '../components/HeroOverlay';
import SceneContainer from '../components/SceneContainer';

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Navbar />
      <HeroOverlay />
      <SceneContainer />
    </div>
  );
}
