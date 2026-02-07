export { AuthController, MovieController, UserController } from "@/infra/http/controllers";
export { AuthMiddleware, errorHandler } from "@/infra/http/middlewares";
export { ErrorPresenter } from "@/infra/http/presenters";
export { authRoutes, movieRoutes, userRoutes } from "@/infra/http/routes";
