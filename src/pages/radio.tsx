// @ts-nocheck
import React from 'react';
import { useEffect, useState, useLayoutEffect, useRef, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';

import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio as RadioIcon,
  Wifi,
  Github,
  Twitter,
  Upload,
  Moon,
  User,
  Search,
  Sun,
  HomeIcon,
  SortDesc,
  SortAsc,
  ChevronsUpDown,
  Plus,
  X,
  ListMusic,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Marquee from 'react-fast-marquee';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };
const podiumHeight = 400;
const firstPlaceHeight = 300;
const secondPlaceHeight = 250;
const thirdPlaceHeight = 225;
const fourthPlaceHeight = 200;
const fifthPlaceHeight = 175;

const RadioPage = () => {
  const { theme, setTheme } = useTheme();
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [heatCount, setHeatCount] = useState(0);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [direction, setDirection] = useState('right');
  const [isOpen, setIsOpen] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState('bottom');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);

  const audioRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    setShouldPlay(true);
  }, [currentIndex]);

  useLayoutEffect(() => {
    if (audioRef.current && shouldPlay) {
      audioRef.current.play();
      setIsPlaying(true);
      setShouldPlay(false);
      console.log('Duration:', audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  }, [shouldPlay]);

  async function loadSongs() {
    console.log('Loading songs...');
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
            genre: meta.data.genre,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.heatCount - a.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 5);

    setTopThreeNfts(topThreeNfts);
    setNfts(sortedNfts);

    setSongsLoaded(true);
  }

  async function loadSongsAscending() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
            genre: meta.data.genre,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    // set nfts in order of ascending heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => a.heatCount - b.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 3);

    // setTopThreeNfts(topThreeNfts);
    setNfts(sortedNfts);
  }

  async function loadSongsByGenre(genre) {
    if (genre === '' || genre === 'All') {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );
      const listings = await radioContract.methods.getListedNfts().call();
      // Iterate over the listed NFTs and retrieve their metadata
      const nfts = await Promise.all(
        listings.map(async (i) => {
          try {
            const NFTContract = new web3.eth.Contract(
              NFT.abi,
              NFT.networks[networkId].address
            );
            const tokenURI = await NFTContract.methods
              .tokenURI(i.tokenId)
              .call();
            const meta = await axios.get(tokenURI);
            const nft = {
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.buyer,
              image: meta.data.image,
              name: meta.data.name,
              coverImage: meta.data.coverImage,
              heatCount: i.heatCount,
              genre: meta.data.genre,
            };
            return nft;
          } catch (err) {
            console.log(err);
            return null;
          }
        })
      );
      const sortedNfts = nfts
        .filter((nft) => nft !== null)
        .sort((a, b) => b.heatCount - a.heatCount);
      const topThreeNfts = sortedNfts.slice(0, 3);
      setTopThreeNfts(topThreeNfts);
      setNfts(sortedNfts);
    } else {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      // Get all listed NFTs
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );
      const listings = await radioContract.methods.getListedNfts().call();
      // Iterate over the listed NFTs and retrieve their metadata
      const nfts = await Promise.all(
        listings.map(async (i) => {
          try {
            const NFTContract = new web3.eth.Contract(
              NFT.abi,
              NFT.networks[networkId].address
            );
            const tokenURI = await NFTContract.methods
              .tokenURI(i.tokenId)
              .call();
            const meta = await axios.get(tokenURI);
            if (meta.data.genre === genre) {
              const nft = {
                tokenId: i.tokenId,
                seller: i.seller,
                owner: i.buyer,
                image: meta.data.image,
                name: meta.data.name,
                coverImage: meta.data.coverImage,
                heatCount: i.heatCount,
                genre: meta.data.genre,
              };
              return nft;
            } else {
              return null;
            }
          } catch (err) {
            console.log(err);
            return null;
          }
        })
      );
      // setNfts(nfts.filter((nft) => nft !== null));

      // set nfts in order of heatCount
      const sortedNfts = nfts
        .filter((nft) => nft !== null)
        .sort((a, b) => b.heatCount - a.heatCount);
      const topThreeNfts = sortedNfts.slice(0, 3);

      setTopThreeNfts(topThreeNfts);
      setNfts(sortedNfts);
    }
  }

  async function handleGiveHeat() {
    const notification = toast.loading(
      'Confirm the transaction to give heat! 🔥🔥🔥',
      {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      }
    );
    // Get an instance of the Radio contract
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      // Give heat to the current NFT
      setLoading(true);
      radioContract.methods
        .giveHeat(nfts[currentIndex].tokenId, heatCount)
        .send({
          from: window.ethereum.selectedAddress,

          value: web3.utils.toWei(heatCount.toString(), 'ether'),
        })
        .on('receipt', function () {
          console.log('listed');
          document.getElementById(
            'heatcounttext'
          ).innerHTML = `YOU GAVE ${heatCount} HEAT!`;
          document
            .getElementById('heatcountdiv')
            .classList.add('animate-pulse');
          document.getElementById('heatanimation').classList.remove('hidden');

          toast.success('Heat given successfully! 🔥🔥🔥', {
            style: {
              border: '1px solid #fff',
              backgroundColor: '#2a2a2a',
              fontWeight: 'bold',
              color: '#fff',
            },
            id: notification,
          });
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      toast.error('Heat could not be given! ❌❌❌', {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
        id: notification,
      });
    }
  }

  async function handleSwap() {
    setAscending(!ascending);
    if (ascending) {
      await loadSongs();
      toast.success('Songs sorted descending! 🔽🔥');
    } else {
      await loadSongsAscending();
      toast.success('Songs sorted ascending! 🔼🔥');
    }
  }

  function handleNext() {
    setDirection('right');
    setCurrentIndex((currentIndex + 1) % nfts.length);
    setIsPlaying(true);
  }

  function handlePrevious() {
    setDirection('left');
    setCurrentIndex(currentIndex === 0 ? nfts.length - 1 : currentIndex - 1);
    setIsPlaying(true);
  }
  return (
    <div className="relative h-screen ">
      {/* LEFT COLUMN */}
      <div className="hidden h-full sm:block absolute left-0 top-0 bottom-0 w-1/4 border-r border-black dark:border-[#1f1f1f]">
        <h1 className="text-xl font-bold text-center mb-6 mt-2 ml-4">
          Radio Settings
        </h1>
        <div className="flex justify-between px-4 mb-4">
          <Select
            onValueChange={(value) =>
              loadSongsByGenre(value).then(() => {
                toast.success(`Loaded ${value} songs!`);
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="lofi">Lofi</SelectItem>
              <SelectItem value="hiphop">Hiphop</SelectItem>
              <SelectItem value="podcast">Podcast</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="subtle">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort by...</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem
                  onClick={() => {
                    handleSwap();
                    // set index to 1
                    setCurrentIndex(0);
                  }}
                  value="top"
                >
                  Ascending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => {
                    handleSwap();
                    // set index to 1
                    setCurrentIndex(0);
                  }}
                  value="bottom"
                >
                  Descending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="px-4">
          <Accordion
            type="single"
            collapsible
            className="full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">
                <ListMusic /> View Queue
              </AccordionTrigger>
              <AccordionContent className="text-xl">
                <ScrollArea className="h-96 w-full rounded-md border border-black dark:border-[#1f1f1f]">
                  <div className="p-4">
                    <div className="flex justify-between">
                      <h4 className="mb-4 text-sm font-medium leading-none">
                        Songs
                      </h4>
                    </div>
                    {nfts.length ? (
                      nfts.map((nft, index) => (
                        <Fragment key={index}>
                          <li
                            className={`flex p-2 rounded-md card3 ${
                              index === currentIndex
                                ? 'bg-[#DADDE2] dark:bg-[#555555]'
                                : ''
                            }`}
                            onClick={() => {
                              setCurrentIndex(index);
                              setIsPlaying(true);
                            }}
                          >
                            <Image
                              src={nft.coverImage}
                              height={50}
                              width={50}
                              alt="nft"
                              className="w-12 h-12 border border-gray-200 dark:border-[#303030] rounded"
                              priority
                            />
                            <div className="flex flex-col text-left ml-2">
                              <h1 className="text-sm font-semibold">
                                {nft.heatCount} | {nft.name}
                              </h1>

                              <h1 className="text-xs text-gray-400">
                                {nft.seller.substring(0, 5)}...{' '}
                                {nft.seller.substring(38, 42)}
                              </h1>
                            </div>
                          </li>
                          <Separator className="my-2" />
                        </Fragment>
                      ))
                    ) : (
                      <h1>It looks like there are no songs!</h1>
                    )}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between mt-12">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full space-y-2"
            >
              <div className="flex items-center justify-between space-x-4">
                <h4 className="text-xl">Playlists</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="lg" className="">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <div className="card3 rounded-md border border-black dark:border-[#1f1f1f] px-4 py-3 font-mono text-sm">
                Coming Soon! :)
              </div>
              <CollapsibleContent className="space-y-2">
                <div className="card3 rounded-md border border-black dark:border-[#1f1f1f] px-4 py-3 font-mono text-sm">
                  I apologize for the delay
                </div>
                <div className="card3 rounded-md border border-black dark:border-[#1f1f1f] px-4 py-3 font-mono text-sm">
                  I am working on it!
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      {/* CENTER COLUMN */}
      <div className="relative w-full sm:w-1/2 mx-auto h-full overflow-y-hidden">
        <div className="w-full rounded overflow-hidden">
          {songsLoaded ? (
            <div key={currentIndex}>
              <div className="flex justify-center items-center mt-12">
                <figure>
                  <motion.div
                    key={nfts[currentIndex].tokenId}
                    initial={direction === 'right' ? { x: -100 } : { x: 100 }}
                    animate={{ x: 0 }}
                    exit={direction === 'right' ? { x: 100 } : { x: -100 }}
                    transition={transition}
                  >
                    <Image
                      src={nfts[currentIndex].coverImage}
                      width={300}
                      height={300}
                      alt="cover"
                      className="rounded-none min-w-[300px] min-h-[300px] max-w-[300px] max-h-[300px]"
                      priority
                    />
                  </motion.div>
                </figure>
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">
                  {nfts[currentIndex].name}
                </div>
                <div className="text-center">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">
                        <span>
                          {nfts.length > 0 &&
                            nfts[currentIndex].seller.slice(0, 6)}
                          ...
                          {nfts.length > 0 &&
                            nfts[currentIndex].seller.slice(38, 42)}
                        </span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/5.x/shapes/svg?seed=/${nfts[currentIndex].seller}.svg?`}
                          />
                        </Avatar>
                        <div className="space-y-1">
                          <Link
                            href="/[slug]"
                            as={`/${nfts[currentIndex].seller}`}
                            className="text-center link link-hover"
                          >
                            {nfts.length > 0 &&
                              nfts[currentIndex].seller.slice(0, 6)}
                            ...
                            {nfts.length > 0 &&
                              nfts[currentIndex].seller.slice(38, 42)}
                          </Link>
                          <p className="text-sm">
                            Bios coming soon! Until then, imagine something cool
                            here.
                          </p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {/* the total heat count from all nfts of this user */}
                              {
                                nfts.filter(
                                  (nft) =>
                                    nft.seller === nfts[currentIndex].seller
                                ).length
                              }{' '}
                              Songs uploaded to Etherwav! Thanks :D
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex justify-between mt-2 mb-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="lg" variant="outline">
                        More Info
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>More Information</AlertDialogTitle>
                        <AlertDialogDescription>
                          <p className="py-4">
                            {nfts[currentIndex] && nfts[currentIndex].name} |
                            Heat 🔥:{' '}
                            {nfts[currentIndex] && nfts[currentIndex].heatCount}
                          </p>
                          <a
                            className="link link-hover text-xs "
                            rel="noreferrer"
                            target="_blank"
                            // href to etherscan with the seller address
                            href={`https://etherscan.io/address/${
                              nfts[currentIndex] && nfts[currentIndex].seller
                            }`}
                          >
                            Original Author:{' '}
                            {nfts[currentIndex] &&
                              nfts[currentIndex].seller.substring(0, 5) +
                                '...' +
                                nfts[currentIndex].seller.substring(38, 42)}
                          </a>
                          <br />
                          <a
                            className="link link-hover text-xs "
                            rel="noreferrer"
                            target="_blank"
                            href={
                              nfts[currentIndex] &&
                              nfts[currentIndex].coverImage.toString()
                            }
                          >
                            Cover Image: IPFS (click to view)
                          </a>
                          <br />
                          <a
                            className="link link-hover text-xs "
                            rel="noreferrer"
                            target="_blank"
                            href={
                              nfts[currentIndex] &&
                              nfts[currentIndex].image.toString()
                            }
                          >
                            Audio Source: IPFS (click to view)
                          </a>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    onClick={async () => {
                      await loadSongsByGenre(nfts[currentIndex].genre);
                      // reset the index
                      setCurrentIndex(0);
                      toast.success(`Sorted by ${nfts[currentIndex].genre}`);
                    }}
                    size="lg"
                    variant="outline"
                  >
                    {/* nft genre */}
                    {nfts[currentIndex] && nfts[currentIndex].genre}
                  </Button>
                </div>
                {/* PROGRESS BAR AND DURATION INDICATORS */}
                <div className="flex justify-between items-center text-center space-x-4">
                  <h1>0:00</h1>
                  <Progress value={progress} />
                  <div>
                    {Math.floor(duration / 60)}:
                    {Math.floor(duration % 60) < 10
                      ? `0${Math.floor(duration % 60)}`
                      : Math.floor(duration % 60)}
                  </div>
                </div>
                {/* PREVIOUS, PLAY/PAUSE, NEXT */}
                <div className="flex justify-between space-x-4 mt-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="subtle"
                    size="lg"
                  >
                    <SkipBack />
                  </Button>

                  <audio
                    src={nfts[currentIndex].image}
                    ref={audioRef}
                    onEnded={(e) => {
                      if (currentIndex < nfts.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        // set the progress to 0
                        setProgress(0);
                        // set the duration to the duration of the next song
                        setDuration(e.target.duration);
                      }
                    }}
                    onPlay={() => {
                      console.log(audioRef.current.duration);
                      setDuration(audioRef.current.duration);
                      // calculate the progress every second considering the duration
                      const interval = setInterval(() => {
                        setProgress(
                          (audioRef.current.currentTime / duration) * 100
                        );
                      }, 500);
                      return () => clearInterval(interval);
                    }}
                    className="h-12 w-full hidden"
                    controls
                    // autoplay after the first song
                    autoPlay={currentIndex !== 0}
                  />

                  <Button
                    onClick={() => {
                      if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioRef.current.play();
                        audioRef.current.pause();
                        audioRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    variant="subtle"
                    size="lg"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={currentIndex === nfts.length - 1}
                    variant="subtle"
                    size="lg"
                  >
                    <SkipForward />
                  </Button>
                </div>
                {/* RADIO ACTIONS - GIVE HEAT & QUEUE */}
                <div className="flex justify-between space-x-4 mt-4">
                  {/* queue dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="lg" variant="outline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                          />
                        </svg>
                        &nbsp; Queue
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Etherwav Queue</AlertDialogTitle>
                        <div className="flex justify-between">
                          <Select
                            onValueChange={(value) =>
                              loadSongsByGenre(value).then(() => {
                                toast.success(`Loaded ${value} songs!`);
                              })
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter Genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              <SelectItem value="lofi">Lofi</SelectItem>
                              <SelectItem value="hiphop">Hiphop</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="subtle">Sort By</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Sort by...</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup
                                value={position}
                                onValueChange={setPosition}
                              >
                                <DropdownMenuRadioItem
                                  onClick={() => {
                                    handleSwap();
                                    // set index to 1
                                    setCurrentIndex(0);
                                  }}
                                  value="top"
                                >
                                  Ascending
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem
                                  onClick={() => {
                                    handleSwap();
                                    // set index to 1
                                    setCurrentIndex(0);
                                  }}
                                  value="bottom"
                                >
                                  Descending
                                </DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <AlertDialogDescription>
                          <ScrollArea className="h-72 w-full rounded-md border border-slate-100 dark:border-[#303030]">
                            <div className="p-4">
                              {nfts.length ? (
                                nfts.map((nft, index) => (
                                  <>
                                    <li
                                      key={index}
                                      className={`flex p-2 rounded-md card3 ${
                                        index === currentIndex
                                          ? 'bg-[#DADDE2] dark:bg-[#555555]'
                                          : ''
                                      }`}
                                      onClick={() => {
                                        setCurrentIndex(index);
                                        setIsPlaying(true);
                                      }}
                                    >
                                      <Image
                                        src={nft.coverImage}
                                        height={50}
                                        width={50}
                                        alt="nft"
                                        className="w-12 h-12 border border-gray-200 dark:border-[#303030] rounded"
                                        priority
                                      />
                                      <div className="flex flex-col text-left ml-2">
                                        <h1 className="text-sm font-semibold">
                                          {nft.heatCount} | {nft.name}
                                        </h1>

                                        <h1 className="text-xs text-gray-400">
                                          {nft.seller.substring(0, 5)}...{' '}
                                          {nft.seller.substring(38, 42)}
                                        </h1>
                                      </div>
                                    </li>
                                    <Separator className="my-2" />
                                  </>
                                ))
                              ) : (
                                <h1>It looks like there are no songs!</h1>
                              )}
                            </div>
                          </ScrollArea>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* give heat */}
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="lg" variant="destructive">
                        {/* Give Heat fire emoji */}
                        Give Heat🔥
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Give Heat!🔥</AlertDialogTitle>
                        <Accordion type="single" collapsible className="full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-2xl">
                              What is Heat?
                            </AccordionTrigger>
                            <AccordionContent className="text-xl">
                              Heat 🔥 is a way to show your appreciation for a
                              song. The more heat a song has, the more it will
                              be promoted and pushed to the top of the queue.{' '}
                              <br /> <br />
                              <p className="text-center text-xl mt-4">
                                <span className="font-bold">
                                  1 Heat = 1 MATIC.
                                </span>
                                <br />
                                You can give as much heat as you want.
                                <br />
                                Please refresh the page after giving heat to see
                                the updated amount.
                                <br />
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <AlertDialogDescription>
                          <div className="flex justify-center text-center ">
                            <div className="form-control mt-4  rounded-xl">
                              {nfts[currentIndex] && (
                                <div
                                  id="heatcountdiv"
                                  className="bg-[#DADDE2] dark:bg-[#1f1f1f] border border-[#2a2a2a] mt-4 p-4 max-w-xl rounded-md"
                                >
                                  <h1
                                    id="heatcounttext"
                                    className="text-center text-xl "
                                  >
                                    You are giving {heatCount} Heat 🔥 to{' '}
                                    {nfts[currentIndex].name}
                                  </h1>
                                  <div
                                    id="heatanimation"
                                    className="hidden  text-center justify-center items-center"
                                  >
                                    <span className="fire-emoji">🔥</span>
                                    <span className="fire-emoji">🔥</span>
                                    <span className="fire-emoji">🔥</span>
                                    <span className="fire-emoji">🔥</span>
                                    <span className="fire-emoji">🔥</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full items-center space-x-2 mt-12">
                            <Input
                              onChange={(event) =>
                                setHeatCount(event.target.value)
                              }
                              type="number"
                              min="0"
                              //
                              // do not allow negative values

                              placeholder="Enter Heat count"
                            />

                            {loading ? (
                              <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Confirm Transaction!
                              </Button>
                            ) : (
                              <Button
                                onClick={handleGiveHeat}
                                disabled={heatCount === 0}
                                type="submit"
                                className=" w-1/3"
                                variant="destructive"
                              >
                                Give Heat!
                              </Button>
                            )}
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ) : (
            <h1>It looks like there are no songs!</h1>
          )}
        </div>
      </div>
      {/* RIGHT COLUMN */}
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-1/4 border-l border-black dark:border-[#1f1f1f]">
        <div className="h-1/2">
          <h1 className="text-3xl text-center ml-4 mb-1">
            Heat Leaderboard 🔥
          </h1>
          <div className="w-full flex justify-center">
            <motion.div
              className="relative w-16 h-full mr-2 bg-gray-200 dark:bg-[#1f1f1f] rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: fourthPlaceHeight }}
              transition={{ duration: 1 }}
              whileHover={{ height: podiumHeight, width: '20%' }}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <motion.span
                  className="text-lg font-bold transform -rotate-90 whitespace-nowrap text-black dark:text-white"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }} // add a delay to make sure the bar is fully loaded before showing the text
                >
                  {nfts[3] ? nfts[3].name : 'No NFTs'} | {nfts[3]?.heatCount} 🔥
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              className="relative w-16 h-full mr-2 bg-orange-500 rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: secondPlaceHeight }}
              transition={{ duration: 1 }}
              whileHover={{ height: podiumHeight, width: '20%' }}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white">
                <motion.span
                  className="text-lg font-bold transform -rotate-90 text-black dark:text-white whitespace-nowrap"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {nfts[1] ? nfts[1].name : 'No NFTs'} | {nfts[1]?.heatCount} 🔥
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              className="relative w-16 h-full mr-2 bg-orange-500 rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: firstPlaceHeight }}
              transition={{ duration: 1 }}
              whileHover={{ height: podiumHeight, width: '20%' }}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white">
                <motion.span
                  className="text-lg font-bold transform -rotate-90 text-black dark:text-white whitespace-nowrap"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {nfts[0] ? nfts[0].name : 'No NFTs'} | {nfts[0]?.heatCount} 🔥
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              className="relative w-16 h-full mr-2 bg-orange-500 rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: thirdPlaceHeight }}
              transition={{ duration: 1 }}
              whileHover={{ height: podiumHeight, width: '20%' }}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white">
                <motion.span
                  className="text-lg font-bold transform -rotate-90 text-black dark:text-white whitespace-nowrap"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {nfts[2] ? nfts[2].name : 'No NFTs'} | {nfts[2]?.heatCount} 🔥
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              className="relative w-16 h-full mr-2 bg-gray-200 dark:bg-[#1f1f1f] rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: fifthPlaceHeight }}
              transition={{ duration: 1 }}
              whileHover={{ height: podiumHeight, width: '20%' }}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white">
                <motion.span
                  className="text-lg font-bold transform -rotate-90 text-black dark:text-white whitespace-nowrap"
                  style={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {nfts[0] ? nfts[0].name : 'No NFTs'} | {nfts[0]?.heatCount} 🔥
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="h-1/2 border-t border-black dark:border-[#1f1f1f]">
          <h1 className="text-3xl text-center ml-4 mt-4">
            More Here Soon :D <br /> For now, enjoy the Heat Leaderboard! &uarr;
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
