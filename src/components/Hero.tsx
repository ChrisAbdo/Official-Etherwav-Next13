import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <div className="text-center">
      <h1 className="flex flex-col gap-2 text-center justify-center text-7xl font-black md:flex-row lg:tracking-tight xl:text-9xl lg:text-8xl">
        <span
          className="before:absolute z-30 before:-z-10 dark:before:text-white before:text-black before:content-[attr(data-text)]"
          data-text="Create."
        >
          <span className="animate-gradient-1 bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
            Create.{' '}
          </span>{' '}
        </span>

        <span
          className="before:absolute z-30 before:-z-10 dark:before:text-white before:text-black before:content-[attr(data-text)]"
          data-text="Listen."
        >
          <span className="animate-gradient-2 bg-gradient-to-l from-orange-600 to-orange-600 bg-clip-text text-transparent">
            {' '}
            Listen.
          </span>{' '}
        </span>

        <span
          className="before:absolute z-30 before:-z-10 dark:before:text-white before:text-black before:content-[attr(data-text)]"
          data-text="Earn."
        >
          <span className="animate-gradient-3 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Earn.
          </span>{' '}
        </span>
      </h1>

      <p className="mt-6 text-2xl leading-8 rounded-md">
        Welcome to <span className="font-bold text-orange-500">Etherwav</span>,
        the <span className="font-bold">community driven</span> and{' '}
        <span className="font-bold">rewarding</span> web(3) radio.
        <br />
        <br /> Powered by Polygon
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/radio"
          className="rounded-md bg-orange-500 px-3.5 py-1.5 text-base font-semibold leading-7 text-black dark:text-white shadow-sm hover:bg-orange-500/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Start Listening
        </Link>
        <Link
          href="/upload"
          className="rounded-md bg-black dark:bg-white  px-3.5 py-1.5 text-base font-semibold leading-7 text-white dark:text-black shadow-sm hover:bg-black/80 dark:hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Upload Music &rarr;
        </Link>
      </div>
    </div>
  );
};

export default Hero;
