import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/ui/use-toast';

import Web3 from 'web3';
import Radio from 'backend/build/contracts/Radio.json';
import NFT from 'backend/build/contracts/NFT.json';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const ipfsClient = require('ipfs-http-client');
const projectId = '2FdliMGfWHQCzVYTtFlGQsknZvb';
const projectSecret = '2274a79139ff6fdb2f016d12f713dca1';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const Upload = () => {
  const [formInput, updateFormInput] = useState({
    name: '',
    coverImage: '',
    genre: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isUploading, setIsUploading] = useState(false);
  const [inputType, setInputType] = useState('');
  const { toast } = useToast();

  const inputs = [
    <form key={0} className="form-control w-full max-w-xs ml-6">
      <label className="label">
        <span className="label-text">Upload a song or podcast | MP3, WAV</span>
      </label>
      <label>
        <input
          type="file"
          onChange={onChange}
          accept=".mp3, .wav"
          className="text-sm text-grey-500 h-11
            file:mr-5 file:py-2 file:px-6
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-[#DADDE2] dark:file:bg-[#303030] 
            hover:file:cursor-pointer hover:file:bg-[#DADDE2]/80 dark:hover:file:bg-[#303030]/80
            
          "
        />
        <br />
        {loading ? <>Uploading file...</> : ''}
      </label>
    </form>,
    <div key={1} className="form-control w-full max-w-xs ml-6 mb-1">
      <Label htmlFor="email-2">Title</Label>
      <Input
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
        value={formInput.name}
        type="email"
        id="email-2"
        placeholder="Title"
      />
    </div>,

    <form key={2} className="form-control w-full max-w-xs ml-6">
      <label className="label">
        <span className="label-text">Pick a Cover Image</span>
      </label>
      <label>
        <input
          type="file"
          onChange={createCoverImage}
          accept="image/*"
          className="text-sm text-grey-500 h-11
          file:mr-5 file:py-2 file:px-6
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-[#DADDE2] dark:file:bg-[#303030] 
          hover:file:cursor-pointer hover:file:bg-[#DADDE2]/80 dark:hover:file:bg-[#303030]/80
          
        "
        />
        <br />
        {loading ? <>Uploading file...</> : ''}
      </label>
    </form>,

    <div key={3} className="ml-5">
      <Label htmlFor="email-2">Genres</Label>
      <Select
        onValueChange={(value) =>
          updateFormInput({ ...formInput, genre: value })
        }
        value={formInput.genre}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lofi">Lofi</SelectItem>
          <SelectItem value="hiphop">Hiphop</SelectItem>
          <SelectItem value="podcast">Podcast</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  ];

  useEffect(() => {
    if (formInput.name && formInput.coverImage && formInput.genre && fileUrl) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formInput, fileUrl]);

  const onInputTypeChange = (e: any) => {
    setInputType(e.target.value);
  };

  async function onChange(e: any) {
    // upload image to IPFS
    setLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setLoading(false);
      // @ts-ignore
      setFileUrl(url);
      toast({
        title: 'Received Audio File',
        description:
          'Your audio file has been received. Continue to the next steps!',
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createCoverImage(e: any) {
    // upload image to IPFS
    setImageLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      // @ts-ignore
      setCoverImage(url);
      updateFormInput({
        ...formInput,
        coverImage: url,
      }); // update form input with cover image URL
      setImageLoading(false);
      toast({
        title: 'Received Cover Image',
        description: 'Your cover image has been received!',
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
      toast({
        title: 'Error uploading file',
        description: 'Please try again',
      });
    }
  }

  async function uploadToIPFS() {
    const { name, coverImage, genre } = formInput;
    if (!name || !coverImage || !genre || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        coverImage,
        image: fileUrl,
        genre,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  async function listNFTForSale() {
    const notification = toast({
      title: 'Minting song...',
      description: 'Please confirm both transactions!',
    });

    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const url = await uploadToIPFS();

      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      // @ts-ignore
      const NFTContractAddress = NFT.networks[networkId].address;
      // @ts-ignore
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();

      setIsUploading(true);

      const radioContract = new web3.eth.Contract(
        // @ts-ignore
        Radio.abi,
        // @ts-ignore
        Radio.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on('receipt', function (receipt: any) {
          console.log('minted');
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          radioContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on('receipt', function () {
              console.log('listed');

              toast({
                title: 'Minted!',
                description: 'Your audio has been uploaded to Etherwav!',
              });

              setIsUploading(false);

              // wait 2 seconds, then reload the page
              //   setTimeout(() => {
              //     router.push('/radio');
              //   }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error minting song',
        description: 'Please try again',
      });
    }
  }

  const handleClick = (next: any) => {
    if (next) {
      setDirection('left');
    } else {
      setDirection('right');
    }
  };

  return (
    <div className="bg-grid-gray-100 dark:bg-grid-[#0f0f0f]">
      <div className="flex flex-col items-center justify-center w-full px-12 py-4">
        {/* CARD */}
        <div className="w-96 border border-[#303030] rounded-md uploadcard bg-white dark:bg-black">
          <figure className="px-10 pt-5">
            <h1 className="text-3xl font-bold text-center">
              Upload to Etherwav
            </h1>
          </figure>
          <p className="mt-2 text-sm text-center">
            PLEASE NOTE: THE BUTTON WILL BE DISABLED UNTIL ALL ASSETS ARE
            UPLOADED TO IPFS, THIS CAN TAKE A COUPLE SECONDS
          </p>
          <div className="card-body mt-6">
            <AnimatePresence>
              <div
                className="input-container"
                style={{
                  display: 'inline-flex',
                  width: '100%',
                  overflowX: 'hidden',
                }}
              >
                {inputs[currentInputIndex] && (
                  <motion.div
                    key={currentInputIndex}
                    initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: direction === 'right' ? '-100%' : '100%' }}
                    transition={{ type: 'tween', duration: 0.5 }}
                  >
                    {inputs[currentInputIndex]}
                  </motion.div>
                )}
              </div>
            </AnimatePresence>

            <div className="flex justify-between mt-4 px-6">
              <Button
                variant="default"
                onClick={() => {
                  setCurrentInputIndex(currentInputIndex - 1);
                  handleClick(false);
                }}
                disabled={currentInputIndex === 0}
              >
                Previous
              </Button>

              <h1 className="">
                {currentInputIndex + 1} of {inputs.length}
              </h1>
              <Button
                variant="default"
                onClick={() => {
                  setCurrentInputIndex(currentInputIndex + 1);
                  handleClick(true);
                }}
                disabled={loading || currentInputIndex === inputs.length - 1}
              >
                Next
              </Button>
            </div>
            <div className="card-actions w-full mt-4 p-6">
              {disabled ? (
                <Button
                  disabled={disabled}
                  onClick={listNFTForSale}
                  className="w-full"
                  variant="default"
                >
                  Upload
                </Button>
              ) : isUploading ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please confirm both transactions
                </Button>
              ) : (
                <Button
                  disabled={disabled}
                  onClick={listNFTForSale}
                  className="w-full"
                  variant="default"
                >
                  Upload
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="divider">OR</div>

        <div className="card w-96 bg-white dark:bg-black border border-[#2a2a2a] rounded-md uploadcard">
          <figure className="px-10 pt-5">
            <h1 className="text-3xl font-bold text-center">
              Not sure what to upload?
            </h1>
          </figure>
          <div className="card-body items-center text-center">
            <h1 className="text-xl font-bold text-center">
              Browse the radio for some inspiration!
            </h1>
            <div className="card-actions w-full mt-4 p-4">
              <Link href="/radio" className="w-full">
                <Button variant="default" className="w-full">
                  Listen to radio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
