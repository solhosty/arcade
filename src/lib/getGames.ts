// @ts-nocheck
import { Connection } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { userPublicKey } from '../lib/stores';
import { get } from 'svelte/store';
import { games } from '../components/gamelist.ts';
import { PUBLIC_RPC_HOST } from '$env/static/public';
const getGames = async () => {
	const publicKey = get(userPublicKey);
	const network = PUBLIC_RPC_HOST;
	const connection = new Connection(network);
	const wallet = publicKey;
	const metaplex = new Metaplex(connection, wallet);
	const myNfts = await metaplex.nfts().findAllByOwner({
		owner: wallet
	});

	const nfts = await Promise.all(
		myNfts.map(async (nft) => {
			console.log(nft);
			try {
				const response = await fetch(nft.uri);
				const metadata = await response.json();
				if (metadata.animation_url && games.includes(metadata.name)) {
					return {
						nft,
						metadata
						// add selected property
					};
				} else {
					return null;
				}
			} catch (error) {
				console.log(error);
			}
		})
	).then((nfts) => nfts.filter((nft) => nft));
	return nfts;
};
export { getGames };
