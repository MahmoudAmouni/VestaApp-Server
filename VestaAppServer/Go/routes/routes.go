package routes

import (
	"VestaAppServer/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	userController := controllers.UserController{}

	r.GET("/users", userController.GetUsers)
	r.GET("/users/:id", userController.GetUserByID)
}
