⚙️ Core Configuration & Database

    src/App.jsx

        Purpose: The "Traffic Cop." Holds your React Router and controls which page loads based on the URL.

    src/db/database.js

        Purpose: The Dexie.js setup file. Creates your local offline database and defines the 5 tables (parents, children, chores, rewards, transactions).

    src/db/authService.js

        Purpose: The security file. Hashes passwords (SHA-256) and handles the logic for logging in and registering users.

🏠 Public & Auth Pages (src/Pages/auth/)

    src/Pages/Home.jsx

        Purpose: The main landing page. Detects if it's the first time using the app, and provides buttons to Parent Login or Child Login.

    src/Pages/auth/ParentRegister.jsx

        Purpose: The "First-Time Setup" screen where the very first Admin Parent account is created.

    src/Pages/auth/ParentLogin.jsx

        Purpose: The login screen for parents.

    src/Pages/auth/ChildLogin.jsx

        Purpose: The login screen for kids.

👨‍👩‍👧 Parent Dashboard & Tools (src/Pages/parent/)

    src/Pages/parent/ParentDashboard.jsx

        Purpose: The parent's main hub. Used to assign chores to specific kids and create new items for the reward store.

    src/Pages/parent/FamilySetup.jsx

        Purpose: Account creation screen where parents register their children into the database.

    src/Pages/parent/AuditLog.jsx

        Purpose: The transaction history receipt. Shows parents exactly who earned points, who spent points, and when.

🧸 Child Dashboard & Tools (src/Pages/child/)

    src/Pages/child/ChildDashboard.jsx

        Purpose: The kid's main hub. Displays their current "Piggy Bank" point balance and allows them to click "Mark Done" on assigned chores.

    src/Pages/child/RewardStore.jsx

        Purpose: The digital storefront where kids can spend their earned points to buy the rewards their parents created.