package models

type Role struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Role string `json:"role"`
}

func (Role) TableName() string { return "user_roles" }
