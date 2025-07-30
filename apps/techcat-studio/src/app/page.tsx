'use client';
import Threads from '../components/home/Threads';
import BlurText from '../components/home/BlurText';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <BlurText
          text="TechCat Studio"
          animateBy="words"
          direction="top"
          className="text-4xl md:text-6xl font-bold text-white text-center"
        />
      </div>
    </div>
  );
}
