package seeder

import (
	"VestaAppServer/config"
	"VestaAppServer/models"
	"fmt"
	"log"
	"os"
)

func SeedAdmin() {
	var adminRole models.Role
	err := config.DB.FirstOrCreate(&adminRole, models.Role{Role: "admin"}).Error
	if err != nil {
		log.Fatal("Failed to seed admin role:", err)
	}

	var adminUser models.User
	result := config.DB.Where("email = ?", adminEmail).First(&adminUser)
	
	if result.Error != nil {
		newAdmin := models.User{
			Name:     "Vesta Admin",
			Email:    adminEmail,
			Password: adminPassword, 
			RoleID:   &adminRole.ID, 
		}
		
		if err := config.DB.Create(&newAdmin).Error; err != nil {
			log.Printf("Failed to create admin user: %v", err)
		} else {
			fmt.Printf("Admin user created: %s / Role: admin / ID: %d\n", adminEmail, newAdmin.ID)
		}
	} else {
		needSave := false
		if adminUser.RoleID == nil || *adminUser.RoleID != adminRole.ID {
			adminUser.RoleID = &adminRole.ID
			needSave = true
		}
		if adminUser.Password != adminPassword {
			adminUser.Password = adminPassword
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
