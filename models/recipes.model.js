import prisma from "../database/connection.database.js";

export const createRecipe = async ({ title, description, userId, ingredients = [] }) => {
    try {
        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                userId,
                ingredients: ingredients.length > 0 ? {
                    create: ingredients.map(ingredient => ({
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                    })),
                } : undefined,
            },
            select: {
                id: true,
                title: true,
                description: true,
                userId: true,
                ingredients: true,
            },
        });

        return { ok: true, recipe, message: 'Recipe created successfully' };
    } catch (error) {
        console.error(error);
        return { ok: false, message: 'Could not create the recipe' };
    }
};

export const getRecipes = async () => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
            },
        });

        return {
            ok: true,
            recipes,
        };
    } catch (error) {
        console.error('Error al obtener las recetas:', error);

        return {
            ok: false,
            message: 'No se pudieron obtener las recetas.',
        };
    }
};


export const getRecipesByUserId = async (userId) => {
    try {
        const recipes = await prisma.recipe.findMany({
            where: { userId: userId }
        });

        if (!recipes.length) {
            return { ok: false, message: 'No recipes found for this user.' };
        }

        return { ok: true, recipes };
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return { ok: false, message: 'Error fetching recipes.' };
    }
};

export const editRecipe = async (id, title, description, ingredients) => {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: parseInt(id) },
        });

        if (!recipe) {
            return { ok: false, message: 'Recipe not found.' };
        }


        const updatedRecipe = await prisma.recipe.update({
            where: { id: parseInt(id) },
            data: {
                title,
                ingredients,
                description,
            },
        });

        return { ok: true, updatedRecipe };
    } catch (error) {
        console.error('Error updating recipe:', error);
        return { ok: false, message: 'Error updating recipe.' };
    }
};

export const deleteRecipeById = async (id) => {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: parseInt(id) },
            include: { ingredients: true }
        });

        if (!recipe) {
            return { ok: false, message: 'Recipe not found.' };
        }

        if (recipe.ingredients.length > 0) {
            await prisma.ingredient.deleteMany({
                where: { recipeId: parseInt(id) },
            });
        }

        await prisma.recipe.delete({
            where: { id: parseInt(id) },
        });

        return { ok: true, message: 'Recipe deleted successfully.' };
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return { ok: false, message: 'Error deleting recipe.' };
    }
};


