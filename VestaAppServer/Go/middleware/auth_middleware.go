package middleware

import (
	"VestaAppServer/config"
	"VestaAppServer/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Missing X-User-ID header"})
			c.Abort()
			return
		}

		var user models.User
		if err := config.DB.Preload("Role").First(&user, userID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User not found"})
			c.Abort()
			return
		}

		if user.Role == nil || user.Role.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Admins only"})
			c.Abort()
			return
		}

		c.Next()
	}
}
