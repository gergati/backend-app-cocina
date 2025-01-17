import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { RecipeController } from "../controllers/recipe.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/newRecipes', RecipeController.newRecipes)
router.get('/renew', verifyToken, UserController.revalidarToken)
router.get('/recipes', RecipeController.traerRecipes)
router.get('/recipes/:userId', RecipeController.traerRecipesPorUserId)
router.put('/recipes/:id', RecipeController.editarRecipeById)
router.delete('/recipes/:id', RecipeController.deleteRecipe)

export default router;