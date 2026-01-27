package controllers

import (
	"VestaAppServer/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	Service services.UserService
}

func (ctrl *UserController) GetUsers(c *gin.Context) {
	users, err := ctrl.Service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (ctrl *UserController) GetUserByID(c *gin.Context) {
	id := c.Param("id")
	user, err := ctrl.Service.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
