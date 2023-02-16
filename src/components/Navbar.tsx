'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from 'lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Cloud,
  CreditCard,
  Github,
  Home,
  Keyboard,
  Laptop,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Radio,
  Search,
  Settings,
  Sun,
  Twitter,
  Upload,
  User,
  UserPlus,
  Users,
  Wifi,
} from 'lucide-react';
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
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ChainId } from '@thirdweb-dev/sdk';
import SignInButton from './SignInButton';

const CHAIN_ID = ChainId.Polygon;

const Navbar = ({ open, setOpen }: any) => {
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState('bottom');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header
      aria-label="Site Header"
      className="bg-white dark:bg-black sticky top-0 z-50 border-b border-black dark:border-[#1f1f1f]"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link
              href="/"
              className="text-2xl font-bold group transition-all duration-300 ease-in-out"
            >
              <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Etherwav
              </span>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Site Nav" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <NavigationMenu>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Radio</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orange-500 to-red-700 p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                              >
                                <h1 className="text-2xl font-bold text-white animate-bounce">
                                  🔥🔥🔥🔥
                                </h1>
                                <div className="mt-4 mb-2 text-lg font-medium text-white">
                                  Etherwav Radio
                                </div>
                                <p className="text-sm leading-tight text-white/90">
                                  The community driven and rewarding radio on
                                  Polygon
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <ListItem href="/radio" title="Launch Etherwav">
                            Tune in to Etherwav to vibe to the best music on
                            Polygon
                          </ListItem>
                          <ListItem href="/radio" title="Give Heat🔥">
                            Give heat to your favorite tracks and push them to
                            the top of the queue
                          </ListItem>
                          <ListItem
                            href="/radio"
                            title="Podcast and Live Streaming"
                          >
                            Podcasts available to upload and listen. Live
                            Streaming coming soon!
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/upload">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Upload
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/profile">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Profile
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenu>
                </li>

                <li>
                  <Button onClick={() => setOpen(true)} variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Quick Search | Ctrl K
                  </Button>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    {address ? (
                      <Button variant="default">
                        {address.substring(0, 5)}...{address.substring(38, 42)}
                      </Button>
                    ) : (
                      <Button variant="default">Connect Wallet</Button>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Connect your wallet to Polygon Mainnet
                      </DialogTitle>
                      <DialogDescription>
                        Please connect with one of the available wallet
                        providers to continue.
                      </DialogDescription>
                      <ConnectWallet accentColor="#f97316" colorMode="dark" />
                    </DialogHeader>

                    {/* <Button variant="subtle">Browser Wallet </Button> */}
                    {/* <Button variant="subtle">WalletConnect</Button> */}
                    {isOnWrongNetwork && (
                      <div className="mt-4">
                        <Button
                          variant="default"
                          onClick={() => switchNetwork?.(CHAIN_ID)}
                          className="w-full"
                        >
                          <Wifi />
                          &nbsp; Wrong Network. Switch to Polygon Mainnet.&nbsp;{' '}
                          <Wifi />
                        </Button>
                      </div>
                    )}

                    {address ? <SignInButton /> : null}
                  </DialogContent>
                </Dialog>

                <div className="hidden sm:flex">
                  {/* <Button
                    variant="subtle"
                    onClick={(e) =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                  >
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
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  </Button> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Sun className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Set Theme</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setTheme('light')}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="block md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Etherwav</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/">
                        <DropdownMenuItem>
                          <Home className="mr-2 h-4 w-4" />
                          <span>Home</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/profile">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/radio">
                        <DropdownMenuItem>
                          <Radio className="mr-2 h-4 w-4" />
                          <span>Radio</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/upload">
                        <DropdownMenuItem>
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Upload</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Theme</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                              <Sun className="mr-2 h-4 w-4" />
                              <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                              <Moon className="mr-2 h-4 w-4" />
                              <span>Dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTheme('system')}
                            >
                              <Laptop className="mr-2 h-4 w-4" />
                              <span>System</span>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        window.open('https://www.github.com/chrisabdo')
                      }
                    >
                      <Github className="mr-2 h-4 w-4" />
                      <span>GitHub</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open('https://www.twitter.com/abdo_eth')
                      }
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      <span>Twitter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href="/radio"
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-[#303030] dark:focus:bg-[#0a0a0a]',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-slate-500 line-clamp-2 dark:text-slate-400">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
