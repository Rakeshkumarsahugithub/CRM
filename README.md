# Telecaller
🌟 CRM Application - Telecaller
Introduction
This is a Customer Relationship Management (CRM) application designed for telecallers and administrators. The application features role-based access control, lead management, and real-time call status updates.

🚀 Features

🔐 Authentication & Authorization

JWT-based authentication

Role-based access control (Admin & Telecaller)

📞Telecaller Features

Add, edit, and delete customer leads

Update lead status (Connected/Not Connected)

Track call responses (Discussed, Callback, Busy, etc.)

👔Admin Features

Dashboard with key metrics

View all telecallers and their activities

Call trend analytics

# Technologies Used

## Frontend

- **React.js**  
  A popular JavaScript library for building user interfaces. React's component-based architecture allows for the creation of reusable UI components and makes the application highly interactive.

- **Redux**  
  A predictable state container for JavaScript apps, which is used for state management in complex React applications. Redux helps in managing the application state in a centralized way, improving code maintainability and debugging.

- **Material-UI**  
  A React UI framework that provides pre-designed, customizable UI components following Material Design principles. It ensures a visually appealing and responsive user interface.

- **React Router**  
  A standard library for routing in React applications, enabling dynamic navigation and allowing users to manage different routes in a Single Page Application (SPA).

- **Axios**  
  A promise-based HTTP client for the browser and Node.js. Axios is used to make API requests to the backend server, handling HTTP requests, and enabling communication between the frontend and the backend efficiently.

- **Chart.js**  
  A powerful JavaScript library used for creating interactive and animated charts. It is used in the dashboard to visualize key metrics like calls made, total customers contacted, and other data trends.

---

## Backend

- **Node.js**  
  A JavaScript runtime environment that executes code server-side. Node.js allows the use of JavaScript for backend development, enabling the building of scalable applications.

- **Express.js**  
  A minimalist web framework for Node.js, designed for building RESTful APIs and handling HTTP requests. It simplifies the routing and middleware processes in backend applications.

- **MongoDB**  
  A NoSQL database used to store and manage application data. MongoDB's document-based structure allows for flexible schema design, making it ideal for this application’s dynamic data.

- **Mongoose**  
  An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to interact with MongoDB, handle data validation, and perform CRUD operations easily.

- **JWT (JSON Web Token)**  
  A token-based authentication system used for securely transmitting information between server and client. JWT helps to manage user sessions and ensures secure access control throughout the application.

---

## Database

- **MongoDB**  
  The application uses MongoDB as the primary database to store customer leads, user data, and application-related information. MongoDB is well-suited for this use case due to its scalability and flexibility.
