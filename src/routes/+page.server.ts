import recipes from '#lib/recipes.json';
export const load = () => {
	return { recipes: recipes.recipes };
};
