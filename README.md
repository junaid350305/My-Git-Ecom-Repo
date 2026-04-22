A full-stack e-commerce solution built with the MERN stack, featuring a custom Admin Dashboard and a 100% test-covered core.
## Key Features
- **Frontend:** Responsive React 18 UI with MUI v7, featuring Dark Mode, Shopping Cart (Context API), and dynamic product filtering.
- **Backend:** Modular Express.js API with custom mock-file storage for ultra-fast performance without DB overhead.
- **Admin Suite:** Protected dashboard for managing products, orders, users, and business reports.
- **Quality Assurance:** 100% Unit & Integration test coverage for critical components and API endpoints.

## Tech Stack
- **Frontend:** React 18, Vite, MUI v7, Vitest, React Testing Library.
- **Backend:** Node.js, Express.js, Jest, Supertest.
- **State Management:** React Context API (Cart & Admin contexts).
- **Styling:** CSS Grid & MUI Custom Theme Engine.

## Testing & Coverage (100% Milestone)
This project prioritizes code reliability. Core logic and critical components maintain **100% coverage** across Statements, Branches, Functions, and Lines.

### Backend (53 Tests)
- **Coverage:** 100% (Auth, Products, Orders, Users, Reports, Settings)
- **Run Tests:** `npm run test:coverage` (inside `/server`)

### Frontend (43 Tests)
- **Coverage:** 100% scoped to `Header`, `ProductCard`, and `CartContext`.
- **Run Tests:** `npm run test:coverage` (inside `/client`)
