package seeder

import (
	"VestaAppServer/config"
	"VestaAppServer/models"
	"fmt"
	"log"
)

func SeedAdmin() {
	var adminRole models.Role
	err := config.DB.FirstOrCreate(&adminRole, models.Role{Role: "admin"}).Error
	if err != nil {
		log.Fatal("Failed to seed admin role:", err)
	}

	var adminUser models.User
	result := config.DB.Where("email = ?", "admin@vesta.app").First(&adminUser)
	
	if result.Error != nil {
		newAdmin := models.User{
			Name:     "Vesta Admin",
			Email:    "admin@vesta.app",
			Password: "12345678", 
			RoleID:   &adminRole.ID, 
		}
		
		if err := config.DB.Create(&newAdmin).Error; err != nil {
			log.Printf("Failed to create admin user: %v", err)
		} else {
			fmt.Printf("Admin user created: admin@vesta.app / Role: admin / ID: %d\n", newAdmin.ID)
		}
	} else {
		needSave := false
		if adminUser.RoleID == nil || *adminUser.RoleID != adminRole.ID {
			adminUser.RoleID = &adminRole.ID
			needSave = true
		}
		if adminUser.Password != "12345678" {
			adminUser.Password = "12345678"
			needSave = true
		}
		
		if needSave {
			config.DB.Save(&adminUser)
			fmt.Printf("Updated existing admin user with correct credentials. ID: %d\n", adminUser.ID)
		} else {
			fmt.Printf("Admin user already up to date. ID: %d\n", adminUser.ID)
		}
	}
}
