package models

type Home struct {
	ID           uint          `json:"id" gorm:"primaryKey"`
	OwnerID      uint          `json:"owner_id"`
	SavedRecipes []SavedRecipe `json:"saved_recipes" gorm:"foreignKey:HomeID"`
	Devices      []Device      `json:"devices" gorm:"foreignKey:HomeID"`
}

func (Home) TableName() string { return "homes" }
