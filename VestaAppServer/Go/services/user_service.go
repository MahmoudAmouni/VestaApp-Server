package services

import (
	"VestaAppServer/config"
	"VestaAppServer/models"
)

type UserService struct{}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := config.DB.Find(&users)
	return users, result.Error
}

func (s *UserService) GetUserByID(id string) (models.User, error) {
	var user models.User
	result := config.DB.Preload("PantryItems.ItemName").
		Preload("PantryItems.Unit").
		Preload("OwnedHomes.Devices.DeviceName").
		Preload("OwnedHomes.SavedRecipes").
		First(&user, id)
	return user, result.Error
}
