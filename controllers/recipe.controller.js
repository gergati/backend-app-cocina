import { createRecipe, deleteRecipeById, editRecipe, getRecipes, getRecipesByUserId } from "../models/recipes.model.js";




const newRecipes = async (req, res) => {
    try {
        const { title, description, userId, ingredients } = req.body;

        // if (!title || !description || !userId || !Array.isArray(ingredients) || ingredients.some(ing => !ing.name || !ing.quantity)) {
        //     return res.status(400).json({
        //         ok: false,
        //         message: 'Campos faltantes o inválidos: title, description, userId, ingredients',
        //     });
        // }

        const result = await createRecipe({ title, description, userId, ingredients });

        if (!result.ok) {
            return res.status(400).json({
                ok: false,
                message: result.message,
            });
        }

        return res.status(201).json({
            ok: true,
            message: result.message,
            recipe: result.recipe,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Server error',
        });
    }
};

export const traerRecipes = async (req, res) => {
    try {
        const result = await getRecipes();

        if (!result.ok) {
            return res.status(400).json({
                ok: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            ok: true,
            recipes: result.recipes,
        });
    } catch (error) {
        console.error('Error en traerRecipes:', error);

        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor.',
        });
    }
};

export const traerRecipesPorUserId = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await getRecipesByUserId(userId);

        if (!result.ok) {
            return res.status(400).json({
                ok: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            ok: true,
            recipes: result.recipes,
        });
    } catch (error) {
        console.error('Error en traerRecipes:', error);

        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor.',
        });
    }
}


export const editarRecipeById = async (req, res) => {
    const { id } = req.params;  // Obtener el userId y recipeId desde los parámetros de la URL
    const { title, ingredients, description } = req.body;  // Obtener los nuevos datos de la receta desde el cuerpo de la solicitud

    try {



        const updatedRecipe = await editRecipe(id, title, description, ingredients)

        // Enviar la receta actualizada como respuesta
        return res.status(200).json({ ok: true, updatedRecipe });

    } catch (error) {
        console.error('Error updating recipe:', error);
        return res.status(500).json({ ok: false, message: 'Error updating recipe.' });
    }
};

export const deleteRecipe = async (req, res) => {
    const { id } = req.params; // Obtener el id de la receta desde los parámetros

    try {
        const result = await deleteRecipeById(id);

        if (!result.ok) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error in deleteRecipeHandler:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};





export const RecipeController = {
    newRecipes,
    traerRecipes,
    traerRecipesPorUserId,
    editarRecipeById,
    deleteRecipe
};