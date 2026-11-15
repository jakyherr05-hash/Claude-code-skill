import { ScrollTrigger, useGSAP } from '../motion/registry';
import { Hero } from '../sections/Hero';
import { Manifesto } from '../sections/Manifesto';
import { Method } from '../sections/Method';
import { TheHour } from '../sections/TheHour';
import { Rooms } from '../sections/Rooms';
import { ScheduleIndex } from '../sections/ScheduleIndex';
import { Atelier, Contact } from '../sections/Closing';

export function Home() {
  // Webfont swaps change line breaks and heights → re-measure all triggers once fonts are in.
  useGSAP(() => { document.fonts.ready.then(() => ScrollTrigger.refresh()); });
  return (
    <>
      <Hero />
      <Manifesto />
      <Method />
      <TheHour />
      <Rooms />
      <ScheduleIndex />
      <Atelier />
      <Contact />
    </>
  );
}
