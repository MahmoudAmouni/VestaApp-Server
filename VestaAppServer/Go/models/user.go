package models

import (
	"time"
)

type User struct {
	ID         uint         `json:"id" gorm:"primaryKey"`
	Name       string       `json:"name"`
	Email      string       `json:"email"`
	CreatedAt  time.Time    `json:"created_at"`
	PantryItems []PantryItem `json:"pantry_items" gorm:"foreignKey:OwnerUserID"`
	OwnedHomes []Home       `json:"owned_homes" gorm:"foreignKey:OwnerID"`
}

func (User) TableName() string {
	return "users"
}
