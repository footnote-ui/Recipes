<script>
	import { onMount } from 'svelte';

	let { data } = $props();
	let weeklyMenu = $state([]);
	let selectedRecipe = $state(null);
	let sidebarOpen = $state(false);
	let currentView = $state('home');
	let favorites = $state([]);

	onMount(() => {
		weeklyMenu = data.recipes;
		try {
			const saved = localStorage.getItem('meal-favorites');
			favorites = saved ? JSON.parse(saved) : [];
		} catch (e) {
			favorites = [];
		}
	});

	function closeSidebar() {
		sidebarOpen = false;
	}

	function handleNavClick(view) {
		currentView = view;
		closeSidebar();
	}

	function toggleFavorite(recipe) {
		const index = favorites.findIndex(f => f.id === recipe.id);
		if (index > -1) {
			favorites.splice(index, 1);
		} else {
			favorites.push(recipe);
		}
		favorites = favorites;
		localStorage.setItem('meal-favorites', JSON.stringify(favorites));
	}

	function isFavorite(recipeId) {
		return favorites.some(f => f.id === recipeId);
	}
</script>

<div class="app">
	<aside class="sidebar" class:open={sidebarOpen}>
		<div class="sidebar-header">
			<h2>MEALS</h2>
			<button class="close-btn" onclick={closeSidebar} aria-label="Close menu">✕</button>
		</div>
		<nav class="sidebar-nav">
			<button onclick={() => handleNavClick('home')} class="nav-item" class:active={currentView === 'home'}>
				<span class="icon">⌂</span>
				<span>Home</span>
			</button>
			<button onclick={() => handleNavClick('explore')} class="nav-item" class:active={currentView === 'explore'}>
				<span class="icon">◯</span>
				<span>Explore</span>
			</button>
			<button onclick={() => handleNavClick('favorites')} class="nav-item" class:active={currentView === 'favorites'}>
				<span class="icon">♡</span>
				<span>Favorites ({favorites.length})</span>
			</button>
			<button onclick={() => handleNavClick('settings')} class="nav-item" class:active={currentView === 'settings'}>
				<span class="icon">⚙</span>
				<span>Settings</span>
			</button>
		</nav>
	</aside>

	<div class="main">
		<div class="topbar">
			<button class="menu-toggle" onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle menu">≡</button>
			{#if currentView === 'home'}
				<h1>Weekly Meals</h1>
			{:else if currentView === 'favorites'}
				<h1>Your Favs</h1>
			{:else if currentView === 'explore'}
				<h1>Explore</h1>
			{:else if currentView === 'settings'}
				<h1>Settings</h1>
			{/if}
		</div>

		<div class="container">
			{#if currentView === 'home'}
				<div class="menu">
					{#each weeklyMenu as recipe}
						<div class="menu-card">
							<button class="card-content" onclick={() => (selectedRecipe = recipe)}>
								<div class="day">{recipe.day}</div>
								<div class="name">{recipe.name}</div>
								<div class="time">⏱ {recipe.time}</div>
							</button>
							<button class="favorite-btn" class:active={isFavorite(recipe.id)} onclick={() => toggleFavorite(recipe)} aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}>
								{isFavorite(recipe.id) ? '♥' : '♡'}
							</button>
						</div>
					{/each}
				</div>
			{:else if currentView === 'favorites'}
				{#if favorites.length === 0}
					<div class="empty-state">
						<p>No favorites yet. Click the heart icon to add meals to favorites.</p>
					</div>
				{:else}
					<div class="menu">
						{#each favorites as recipe}
							<div class="menu-card">
								<button class="card-content" onclick={() => (selectedRecipe = recipe)}>
									<div class="day">{recipe.day}</div>
									<div class="name">{recipe.name}</div>
									<div class="time">⏱ {recipe.time}</div>
								</button>
								<button class="favorite-btn active" onclick={() => toggleFavorite(recipe)} aria-label="Remove from favorites">♥</button>
							</div>
						{/each}
					</div>
				{/if}
			{:else if currentView === 'explore'}
				<div class="empty-state">
					<p>Explore feature coming soon!</p>
				</div>
			{:else if currentView === 'settings'}
				<div class="empty-state">
					<p>Settings feature coming soon!</p>
				</div>
			{/if}
		</div>
	</div>

	{#if selectedRecipe}
		<div class="modal" onclick={() => (selectedRecipe = null)}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<button class="modal-close" onclick={() => (selectedRecipe = null)} aria-label="Close">✕</button>
				<div class="modal-header">
					<div>
						<h2>{selectedRecipe.name}</h2>
						<p class="day-label">{selectedRecipe.day}</p>
					</div>
					<button class="modal-favorite" class:active={isFavorite(selectedRecipe.id)} onclick={() => toggleFavorite(selectedRecipe)}>
						{isFavorite(selectedRecipe.id) ? '♥' : '♡'}
					</button>
				</div>
				<h3>Ingredients:</h3>
				<ul class="ingredients-list">
					{#each selectedRecipe.ingredients as ingredient}
						<li>{ingredient}</li>
					{/each}
				</ul>
				<p class="time">⏱ Time: {selectedRecipe.time}</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.app {
		display: flex;
		height: 100vh;
		background: linear-gradient(135deg, #d32f2f 0%, #c2185b 50%, #7b1fa2 100%);
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 280px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(25px);
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		z-index: 999;
		padding-top: 20px;
		overflow-y: auto;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px 30px 20px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.sidebar-header h2 {
		color: white;
		font-size: 1.5em;
		margin: 0;
		font-weight: 700;
	}

	.close-btn {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		font-size: 1.2em;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0 15px;
		margin: 0;
	}

	.nav-item {
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 14px 18px;
		border-radius: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 1em;
		transition: all 0.2s;
		font-weight: 500;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateX(5px);
	}

	.nav-item.active {
		background: rgba(255, 255, 255, 0.3);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.nav-item:active {
		transform: scale(0.98);
	}

	.icon {
		font-size: 1.2em;
	}

	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 20px;
		background: rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
	}

	.menu-toggle {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		width: 40px;
		height: 40px;
		border-radius: 8px;
		font-size: 1.5em;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-toggle:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.topbar h1 {
		color: white;
		margin: 0;
		font-size: 1.8em;
		flex: 1;
	}

	.container {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.menu {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 15px;
	}

	.menu-card {
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(15px);
		border-radius: 15px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.menu-card:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
	}

	.card-content {
		background: none;
		border: none;
		padding: 18px;
		cursor: pointer;
		text-align: left;
		color: white;
		font-family: inherit;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.card-content:active {
		transform: scale(0.98);
	}

	.day {
		font-size: 0.8em;
		color: rgba(255, 255, 255, 0.8);
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 8px;
		font-weight: 600;
	}

	.name {
		font-size: 1.1em;
		font-weight: 600;
		color: white;
		margin-bottom: 10px;
	}

	.time {
		font-size: 0.9em;
		color: rgba(255, 255, 255, 0.7);
	}

	.favorite-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		font-size: 1.2em;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.favorite-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.favorite-btn.active {
		color: #ff4081;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.1em;
		text-align: center;
		padding: 40px;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background: white;
		border-radius: 20px;
		padding: 30px;
		max-width: 500px;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		position: relative;
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from { transform: translateY(30px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.modal-close {
		position: absolute;
		top: 15px;
		right: 15px;
		background: #f0f0f0;
		border: none;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		font-size: 1.2em;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
	}

	.modal-close:hover {
		background: #e0e0e0;
		transform: rotate(90deg);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 15px;
		margin-bottom: 20px;
	}

	.modal-header h2 {
		color: #333;
		margin: 0 0 5px 0;
		font-size: 1.6em;
	}

	.day-label {
		color: #d32f2f;
		font-weight: 600;
		font-size: 0.9em;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0;
	}

	.modal-favorite {
		background: rgba(255, 64, 129, 0.1);
		border: 1px solid rgba(255, 64, 129, 0.3);
		color: #ff4081;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		font-size: 1.3em;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.modal-favorite:hover {
		background: rgba(255, 64, 129, 0.2);
	}

	.modal-content h3 {
		color: #d32f2f;
		margin-top: 20px;
		margin-bottom: 15px;
		font-size: 1.1em;
	}

	.ingredients-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.ingredients-list li {
		padding: 10px 0 10px 25px;
		border-bottom: 1px solid #f0f0f0;
		position: relative;
		color: #555;
		font-size: 0.95em;
	}

	.ingredients-list li:before {
		content: '✓';
		position: absolute;
		left: 0;
		color: #d32f2f;
		font-weight: bold;
	}

	.ingredients-list li:last-child {
		border-bottom: none;
	}

	.modal-content .time {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 2px solid #f0f0f0;
		color: #d32f2f;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
		}

		.menu {
			grid-template-columns: 1fr;
		}

		.topbar {
			padding: 15px;
		}

		.topbar h1 {
			font-size: 1.4em;
		}

		.modal-content {
			margin: 20px;
			padding: 20px;
		}
	}
</style>
