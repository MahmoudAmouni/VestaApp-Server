package routes

import (
	"VestaAppServer/controllers"
	"VestaAppServer/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	userController := controllers.UserController{}

	admin := r.Group("/")
	admin.Use(middleware.AdminOnly())
	{
		admin.GET("/users", userController.GetUsers)
		admin.GET("/users/:id", userController.GetUserByID)
	}
}
