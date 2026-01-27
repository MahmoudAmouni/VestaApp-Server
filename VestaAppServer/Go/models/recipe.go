package models

type SavedRecipe struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	HomeID      uint   `json:"home_id"`
	RecipeName  string `json:"recipe_name"`
	Ingredients string `json:"ingredients"`
	Directions  string `json:"directions"`
	Link        string `json:"link"`
}

func (SavedRecipe) TableName() string { return "saved_recipes" }
