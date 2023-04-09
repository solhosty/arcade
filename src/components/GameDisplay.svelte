<script>
	// @ts-nocheck
	import { createQuery } from '@tanstack/svelte-query';
	import { getGames } from '../../api/solana/getGames.ts';
	import { userPublicKey } from '../../api/wallets/stores.ts';
	import '../../app.css'

    let cachedNFTs = localStorage.getItem('nftGames');
    let shouldFetchNFTs = !cachedNFTs;
    const nftsQuery = createQuery({
        queryKey: ['nfts'],
        queryFn: getGames,
        enabled: shouldFetchNFTs,
        initialData: cachedNFTs ? JSON.parse(cachedNFTs) : undefined,
        onSuccess: (data) => {
    localStorage.setItem('nftGames', JSON.stringify(data));
    sessionStorage.setItem('gamesFetched', 'true');
  },
});

$: {
  if (!$userPublicKey) {
    localStorage.removeItem('nftGames');
    sessionStorage.removeItem('gamesFetched');
  }
}
	let selectedAnimation = null;
</script>

{#if $nftsQuery.isLoading}
	<div class="arcade-intro loading w-9/12 m-auto items-center mb-1 relative mt-12">
		<h1 class="intro-title">minion arcade</h1>
		<div class="mt-0">
			<script
				src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
			></script>
			<lottie-player
				src="https://assets4.lottiefiles.com/private_files/lf30_vfygy1gs.json"
				background="transparent"
				speed=".5"
				style="width: 300px; height: 300px;"
				loop
				autoplay
			/>
		</div>
	</div>
{:else if $nftsQuery.isError}
	<h2>Error fetching NFTs: {$nftsQuery.error.message}</h2>
{:else}
	<h1 class="after mt-0">minion arcade</h1>
	{#if selectedAnimation}
		<div class="iframe-container m-auto flex flex-col mt-0 mb-0 max-w-full bg-cover">
			<div class="title-header mt-2 border-3 border-white border-dotted">
				{#if selectedAnimation}
				<h3>
				  {$nftsQuery.data.find(nft => nft.metadata.animation_url === selectedAnimation).metadata.name}
				</h3>
			  {/if}
			</div>
			<iframe
				class="game-console w-3/5 m-auto mt-1 flex mb-0"
				src={selectedAnimation}
				title=""
				loading
				allowfullscreen="true"
			/>
			<div class="iframe-text w-full flex flex-col m-auto">
				<div
					class="description-header border-3 border-white border-dotted rounded-xl"
				>
				{#if selectedAnimation}
				<h6>
				  {$nftsQuery.data.find(nft => nft.metadata.animation_url === selectedAnimation).metadata.description}
				</h6>
			  {/if}
				</div>
			</div>
		</div>
	{/if}
	<h4>Select a game</h4>
	<div class="card-grid justify-center drop-shadow-2xl flex flex-wrap m-auto mb-8">
		{#each $nftsQuery.data as nft}
			<div
				role="button"
				tabindex="0"
				class="card drop-shadow-2xl relative m-2 mt-4 w-24 h-24 mb-3 overflow-hidden cursor-pointer rounded-lg"
				on:click={() => (selectedAnimation = nft.metadata.animation_url)}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						selectedAnimation = nft.metadata.animation_url;
					}
				}}
			>
				<img src={nft.metadata.image} alt="" class="card-img relative w-full h-full object-cover" />
				<div class="card-overlay flex absolute bottom-0 left-0 w-full text-white opacity-0">
					<h5>{nft.metadata.name}</h5>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	@import url('https://use.typekit.net/ykf5ouy.css');
	@import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,700&family=Gajraj+One&family=Rubik+Mono+One&family=Shantell+Sans:ital,wght@1,700&display=swap');

	lottie-player {
		width: 40%;
		margin: auto;
		justify-content: center;
		display: flex;
	}
	:global(.wallet-adapter-button-trigger) {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		color: white;
		font-family: 'proxima-nova-condensed', sans-serif;
		margin: auto;
		justify-content: center;
		position: relative;
		left: 0%;
		box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);
	}
	
	.game-console {
		min-width: 95%;
		height: 900px;
		border-radius: 25px;
		border: none;
	}

	.card {
		max-width: 95%;
		transition: transform 0.2s ease-in-out;
	}
	.card:hover {
		transform: translateY(-10px);
		border: 3px white solid;
	}

	.card-overlay {
		height: 70%;
		background-color: rgba(0, 0, 0, 0.5);
		transition: opacity 0.3s;
	}

	.card:hover .card-overlay {
		opacity: 1;
	}

	.loading {
		position: relative;
		bottom: 5%;
	}
	.arcade-intro {
		border: 5px white solid;
		bottom: 14%;
		border-radius: 25px;
		box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
	}
	.card-grid {
		border: 4px white solid;
		max-width: 600px;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 25px;
		box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
	}
	.iframe-container {
		border: 4px white solid;
		width: 600px;
		height: 100%;
		border-radius: 25px;
		box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
		background-color: rgba(0, 0, 0, 0.5);
		background-image: url('/loading.svg') repeat;
	}

	h1 {
		font-family: 'unibody-8-new', sans-serif;
		font-weight: 900;
		font-style: normal;
		font-size: 3rem;
		text-align: center;
		text-shadow: 0 5px 0 #3b3b3b;
		margin-bottom: 1%;
	}

	h2 {
		font-family: unibody-8-new, sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 1.5rem;
		text-align: center;
		margin-top: 1%;
		margin-bottom: 2%;
		text-shadow: 0 5px 0 #3b3b3b;
	}
	h3 {
		text-align: center;
		font-family: unibody-8-new, sans-serif;
		font-weight: 700;
		font-style: normal;
		color: white;
		position: relative;
		font-size: 2rem;
		margin-top: 0%;
		margin-bottom: 2%;
		text-shadow: 0 5px 0 #3b3b3b;
		margin: auto;
	}

	h4 {
		margin-top: 0%;
		font-family: unibody-8-new, sans-serif;
		font-weight: 400;
		font-style: italic;
		font-size: 1.5rem;
		text-shadow: 0 5px 0 #3b3b3b;
		text-align: center;
		margin-bottom: 2%;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	h5 {
		font-family: 'Exo 2', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		text-align: center;
		margin: auto;
	}
	h6 {
		text-align: center;
		font-family: unibody-8-new, sans-serif;
		font-weight: 400;
		font-style: italic;
		font-size: 1rem;
		margin-top: 0%;
		text-shadow: 0 5px 0 #3b3b3b;
		width: 100%;
		margin-right: 20px;
		margin-bottom: 2%;
		margin-top: 2%;
		font-style: italic;
	}

	@keyframes progres {
		0% {
			width: 0%;
		}
		25% {
			width: 50%;
		}
		50% {
			width: 75%;
		}
		75% {
			width: 85%;
		}
		100% {
			width: 100%;
		}
	}
	@media (max-width: 760px) {
		.iframe-container {
			height: 1050px;
		}
		iframe {
			height: 1000px;
		}
		h1 {
			font-size: 3rem;
		}
		.arcade-intro {
			width: 85%;
			margin-top: 4%;
		}
		.loading {
			position: relative;
			bottom: 5%;
		}
		
	}
</style>
