export {
  AuthController,
  MovieController,
  UserController
} from "@/infrastructure/http/controllers";
export {
  AuthMiddleware,
  errorHandler
} from "@/infrastructure/http/middlewares";
export { ErrorPresenter } from "@/infrastructure/http/presenters";
export {
  authRoutes,
  movieRoutes,
  userRoutes
} from "@/infrastructure/http/routes";
