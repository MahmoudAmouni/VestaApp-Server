<img src="./readme/titles/title1.svg"/>

<br><br>

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br><br>

<!-- project overview -->
<img src="./readme/titles/title2.svg"/>

> VestaApp is a comprehensive smart home assistant that integrates inventory management, device control, and AI-driven insights. 
> Unify your home experience by connecting your pantry, recipes, and electrical devices into a single, intelligent interface.

<br><br>

<!-- System Design -->
<img src="./readme/titles/title3.svg"/>

### System Design
<img src="./readme/system-design/system design.png" style="width: 100%;"/>

### Database Schema
[View Interactive Diagram](https://dbdiagram.io/d/VestaDB-696f74f5bd82f5fce2052481)
<img src="./readme/database/VestaDB.png" style="width: 100%;" />

<br><br>

<!-- Project Highlights -->
<img src="./readme/titles/title4.svg"/>

### Key Features


<br>

- **IoT Devices**: Connects directly to ESP32 hardware to monitor physical inventory and control home devices based on your environment.
- **RAG: Intelligent Memory**: Retrieves context from your personal logs to provide grounded, accurate suggestions based on your data.
- **Ai-Agent: Vesta Assistant**: An autonomous voice agent that controls your electrical devices and manages your pantry and shopping list through natural conversation.


<img src="./readme/features/vesta-features.png"/>

### Vesta 
> This is your home assistant Vesta, she is here to help you with whatever you need.
<img src="./readme/vesta/vesta.gif" style="width: 100%;" />


<br><br>

<!-- Demo -->
<img src="./readme/titles/title5.svg"/>

### User Screens & Demos

| Welcome | Login | Signup | Google Verification |
| :---: | :---: | :---: | :---: |
| <img src="./readme/demo/screenshots/welcome.png" width="200" /> | <img src="./readme/demo/screenshots/login.png" width="200" /> | <img src="./readme/demo/screenshots/signup.png" width="200" /> | <img src="./readme/demo/screenshots/google verification.png" width="200" /> |

| Dashboard (Dark) | Dashboard (Light) | Room Details (Empty) |
| :---: | :---: | :---: |
| <img src="./readme/demo/gif/dashboard-ezgif.com-video-to-gif-converter.gif" width="280" /> | <img src="./readme/demo/gif/dashboard-light-ezgif.com-video-to-gif-converter (2).gif" width="280" /> | <img src="./readme/demo/screenshots/roomdetailsempty.png" width="280" /> |

| Pantry (Full) | Pantry (Empty) | Pantry (Light) |
| :---: | :---: | :---: |
| <img src="./readme/demo/screenshots/pantryfull.png" width="280" /> | <img src="./readme/demo/screenshots/pantryempty.png" width="280" /> | <img src="./readme/demo/screenshots/pantryemptylight.png" width="280" /> |

| Shopping List (Full) | Shopping List (Empty) | Shopping List (Light) |
| :---: | :---: | :---: |
| <img src="./readme/demo/screenshots/shoppinglistfull.png" width="280" /> | <img src="./readme/demo/screenshots/shoppinglistempty.png" width="280" /> | <img src="./readme/demo/screenshots/shoppinglistemptylight.png" width="280" /> |

| Recipe Creation | Saved Recipes | No Saved Recipes |
| :---: | :---: | :---: |
| <img src="./readme/demo/gif/recipe-ezgif.com-video-to-gif-converter.gif" width="280" /> | <img src="./readme/demo/screenshots/savedrecipes.png" width="280" /> | <img src="./readme/demo/screenshots/savedrecipesempty.png" width="280" /> |

| Room Control | Rooms (Empty) | Rooms (Light) |
| :---: | :---: | :---: |
| <img src="./readme/demo/gif/rooms-ezgif.com-video-to-gif-converter.gif" width="280" /> | <img src="./readme/demo/screenshots/roomsempty.png" width="280" /> | <img src="./readme/demo/screenshots/roomsemptylight.png" width="280" /> |

| Profile | About | Privacy Policy | Terms & Conditions |
| :---: | :---: | :---: | :---: |
| <img src="./readme/demo/screenshots/profile.png" width="200" /> | <img src="./readme/demo/screenshots/about.png" width="200" /> | <img src="./readme/demo/screenshots/privacy.png" width="200" /> | <img src="./readme/demo/screenshots/terms.png" width="200" /> |

### IoT Control Demo
<img src="./readme/IoT/iot.gif" style="width: 100%;" />

<br><br>

<!-- Development & Testing -->
<img src="./readme/titles/title6.svg"/>

### Development

- **Server**: `VestaAppServer` (Laravel & Django)
- **Client**: `VestaClient` (React Native/Expo)

### Testing & CI/CD

| Frontend Tests | Backend Tests | CI/CD |
| --------------------------------------- | ------------------------------------- | ------------------------------------- |
| ![Frontend](./readme/tests/frontend-tests.png) | ![Backend](./readme/tests/backend-tests.png) | ![CICD](./readme/tests/deployment.png) |

#### How to Run Tests

**Frontend (React Native)**
```bash
cd VestaClient/React-Native
npm test
```

**Backend (Laravel)**
```bash
cd VestaAppServer/Laravel
php artisan test
```


<br><br>

### Dataset 

- **RAG System**: Vector database for recipe retrieval.

![Dataset](./readme/dataset/image.png)

### AI Agent Workflow

<img src="./readme/ai-agent-workflow/ai-agent-flow.jpg"/>

<br><br>

<!-- APIs -->
<img src="./readme/titles/title7.svg"/>

### API & Postman

| AI Chat | Rooms | Saved Recipes |
| :---: | :---: | :---: |
| <img src="./readme/postman/aichat.png" width="280" /> | <img src="./readme/postman/rooms.png" width="280" /> | <img src="./readme/postman/savedRecipes.png" width="280" /> |

<br><br>


