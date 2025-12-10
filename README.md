# bank_work

This repository contains a small bank demo with a Node/Express backend and a React + Vite frontend.

## Quick start

1. Backend env
   - Copy the example file and update it with your MongoDB Atlas password (do not commit this file):

     ```powershell
     cd Backend
     copy .env.example .env
     # Edit Backend\.env and replace <db_password> with your Atlas DB password
     ```

   - Optional: set `FRONTEND_URL` in `Backend/.env` to your dev frontend URL (default `http://localhost:5173`).

2. Frontend env

   - Copy frontend example:

     ```powershell
     cd ..\fronted
     copy .env.example .env
     ```

   - Ensure `VITE_API_URL` points to the backend (default `http://localhost:5000`).

3. Install and run

   - Start backend:

     ```powershell
     cd ..\Backend
     npm install
     npm run dev    # uses nodemon, or `npm start` to run without nodemon
     ```

   - Start frontend (in separate terminal):

     ```powershell
     cd ..\fronted
     npm install
     npm run dev
     ```

4. Test the app

   - Open the Vite dev URL printed in the console (e.g., `http://localhost:5173` or another port Vite picks).
   - Register as a customer, login, and go to the Transactions page to deposit/withdraw.

## Notes

- Backend reads `MONGO_URI`, `JWT_SECRET`, `PORT`, and `FRONTEND_URL` from `Backend/.env`.
- Frontend reads `VITE_API_URL` from `fronted/.env`.
- Do not commit `.env` files with secrets.

If you want, I can (a) run a smoke test here to verify deposit/withdraw end-to-end, or (b) add a small script to start both services concurrently.
