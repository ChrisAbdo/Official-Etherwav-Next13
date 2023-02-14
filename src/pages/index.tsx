import React from 'react';
import Lottie from 'react-lottie-player';
import lottieJson from 'public/audioreal.json';
import music from 'public/music.json';
import Head from 'next/head';
import Link from 'next/link';
import { wrap } from '@motionone/utils';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';
import Hero from '@/components/Hero';
import GettingStarted from '@/components/GettingStarted';

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = React.useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return (
    <div>
      <Head>
        <title>Etherwav</title>
        <meta name="description" content="Etherwav built by Chris Abdo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full">
        <div className="bg-grid-gray-100 dark:bg-grid-[#0f0f0f]">
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="flex justify-center">
                <Lottie loop animationData={lottieJson} play />
              </div>

              <Hero />

              <section className="mt-12">
                <ParallaxText baseVelocity={-5}>Etherwav</ParallaxText>
                <ParallaxText baseVelocity={5}>
                  Create. Listen. Earn.
                </ParallaxText>
              </section>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 0 }}
              exit={{ y: 100, opacity: 0 }}
              // whileInView={{ y: 0, opacity: 1 }}
              // do the same thing as the above whileInView, but make it slide in from the bottom
              whileInView={{ y: 0, opacity: 1 }}
            >
              <GettingStarted />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <Lottie className="w-72" loop animationData={music} play />
          </div>
        </div>
      </main>
    </div>
  );
}
