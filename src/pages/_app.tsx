import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Poppins } from '@next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ChainId } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import axios from 'axios';
import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  Calculator,
  CreditCard,
  Music,
  Radio as RadioIcon,
  Settings,
  Upload,
  User,
  Info,
} from 'lucide-react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = React.useState(false);
  const [nfts, setNfts] = React.useState([]);
  const [songsLoaded, setSongsLoaded] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // if user presses control + k
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  React.useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    console.log('Loading songs...');
    // @ts-ignore
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      // @ts-ignore
      Radio.abi,
      // @ts-ignore
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i: any) => {
        try {
          const NFTContract = new web3.eth.Contract(
            // @ts-ignore
            NFT.abi,
            // @ts-ignore
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
    const topThreeNfts = sortedNfts.slice(0, 3);

    // setTopThreeNfts(topThreeNfts);
    // @ts-ignore
    setNfts(sortedNfts);
    // @ts-ignore
    setSongsLoaded(true);
  }

  return (
    <main className={poppins.className}>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <meta name="author" content="Christopher Abdo" />
          <meta
            name="description"
            content="Etherwav is an algorthmically rewarding and community driven Web3 radio built to reward creators for making amazing music."
          />
          <meta
            name="keywords"
            content="Christopher Abdo, Etherwav, web3 radio, web3, software engineer, developer, programming, projects"
          />
        </Head>

        <ThemeProvider>
          {/* @ts-ignore */}
          <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="mt-3 w-[95%]">
              <CommandInput placeholder="Type a command or search..." />
            </div>

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation Suggestions">
                <Link href="/radio">
                  <CommandItem>
                    <RadioIcon className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Radio</span>
                  </CommandItem>
                </Link>
                <Link href="/upload">
                  <CommandItem>
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Upload</span>
                  </CommandItem>
                </Link>
                <Link href="/profile">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Profile</span>
                  </CommandItem>
                </Link>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Search For Songs & Artists">
                {nfts.length ? (
                  nfts.map((nft, index) => (
                    <Link key={index} href="/radio">
                      <CommandItem>
                        <Image
                          //  @ts-ignore
                          src={nft.coverImage}
                          width={40}
                          height={40}
                          alt="nft"
                          className="min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px]"
                        />
                        <span className="text-black dark:text-white ml-2">
                          {/* @ts-ignore */}
                          {nft.name}
                        </span>

                        <CommandShortcut>
                          {/* @ts-ignore */}
                          <Popover>
                            <PopoverTrigger>
                              <Info className="h-2 w-2" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    More Info
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Here you will find some more info about this
                                    song and artist.
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Title</Label>

                                    <h1 className="col-span-2 h-8">
                                      {/* @ts-ignore */}
                                      {nft.name}
                                    </h1>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxWidth">Artist</Label>
                                    <h1 className="col-span-2 h-8 truncate">
                                      {/* @ts-ignore */}
                                      {nft.seller}
                                    </h1>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxWidth">Heat Count</Label>
                                    <h1 className="col-span-2 h-8 truncate">
                                      {/* @ts-ignore */}
                                      {nft.heatCount} 🔥
                                    </h1>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="height">Audio Source</Label>
                                    <h1
                                      onClick={() => {
                                        // @ts-ignore
                                        window.open(nft.image);
                                      }}
                                      className="col-span-2 h-8 truncate hover:underline cursor-pointer"
                                    >
                                      {/* @ts-ignore */}
                                      {nft.image}
                                    </h1>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxHeight">
                                      Image Source
                                    </Label>
                                    <h1
                                      onClick={() => {
                                        // @ts-ignore
                                        window.open(nft.coverImage);
                                      }}
                                      className="col-span-2 h-8 truncate hover:underline cursor-pointer"
                                    >
                                      {/* @ts-ignore */}
                                      {nft.coverImage}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </CommandShortcut>
                      </CommandItem>
                    </Link>
                  ))
                ) : (
                  <h1>No songs found</h1>
                )}
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <Navbar open={open} setOpen={setOpen} />
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </ThirdwebProvider>
    </main>
  );
}
