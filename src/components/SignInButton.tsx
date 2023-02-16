import {
  useAddress,
  useNetworkMismatch,
  useNetwork,
  ConnectWallet,
  ChainId,
  MediaRenderer,
} from '@thirdweb-dev/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useLensUser from '../lib/auth/useLensUser';
import useLogin from '../lib/auth/useLogin';
import { Button } from './ui/button';

type Props = {};

export default function SignInButton({}: Props) {
  const address = useAddress(); // Detect the connected address
  const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
  const [, switchNetwork] = useNetwork(); // Function to switch the network.
  const { isSignedInQuery, profileQuery } = useLensUser();
  const { mutate: requestLogin } = useLogin();

  // 1. User needs to connect their wallet
  if (!address) {
    return <ConnectWallet />;
  }

  // 2. User needs to switch network to Polygon
  if (isOnWrongNetwork) {
    return (
      <button
        className="hidden"
        onClick={() => switchNetwork?.(ChainId.Polygon)}
      >
        Switch Network
      </button>
    );
  }

  // Loading their signed in state
  if (isSignedInQuery.isLoading) {
    return <div>Loading... you might need to refresh</div>;
  }

  // If the user is not signed in, we need to request a login
  if (!isSignedInQuery.data) {
    return (
      <Button
        className="w-full"
        variant="default"
        size="lg"
        onClick={() => requestLogin()}
      >
        Sign in with Lens 🌿
      </Button>
    );
  }

  // Loading their profile information
  if (profileQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // If it's done loading and there's no default profile
  if (!profileQuery.data?.defaultProfile) {
    return <div>No Lens Profile.</div>;
  }

  // If it's done loading and there's a default profile
  if (profileQuery.data?.defaultProfile) {
    return (
      <Button
        variant="default"
        size="lg"
        className="flex border border-white rounded-md"
        disabled
      >
        {/* <MediaRenderer
          // @ts-ignore
          src={profileQuery?.data?.defaultProfile?.picture?.original?.url || ''}
          alt={profileQuery.data.defaultProfile.name || ''}
          style={{
            width: 48,
            height: 48,
            borderRadius: '20%',
          }}
        />
        <Link
          href={`/profile/${profileQuery.data.defaultProfile.handle}`}
          className="text-xl font-bold ml-4 mt-2.5"
        >
          Welcome {profileQuery.data.defaultProfile.name}! 🎉
        </Link> */}
        <Link
          className="text-md"
          href={`/profile/${profileQuery.data.defaultProfile.handle}`}
        >
          Welcome {profileQuery.data.defaultProfile.name} (
          {profileQuery.data.defaultProfile.handle})! 🎉
        </Link>
      </Button>
    );
  }

  return <div>Something went wrong.</div>;
}
