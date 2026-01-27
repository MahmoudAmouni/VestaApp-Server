package routes

import (
	"VestaAppServer/controllers"
	"VestaAppServer/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	userController := controllers.UserController{}

	// Public Routes (none for now)

	// Admin Routes
	admin := r.Group("/")
	admin.Use(middleware.AdminOnly())
	{
		admin.GET("/users", userController.GetUsers)
		admin.GET("/users/:id", userController.GetUserByID)
	}
}
