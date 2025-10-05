# Aqua Dashboard

## Project Overview

The Aqua Dashboard is a Next.js application designed for real-time monitoring and visualization of aquatic data. It provides a comprehensive dashboard displaying various sensor readings such as temperature, ozone, ammonia, oxygen, conductivity, and total dissolved solids (TDS) through interactive charts and detailed tables. The application leverages Supabase for secure user authentication and efficient data management.

## Features

- **User Authentication:** Secure login and sign-out functionality powered by Supabase.
- **Real-time Data Monitoring:** Displays the latest aquatic sensor data.
- **Interactive Dashboard:** Visualizes key metrics using various charts (Temperature, Ozone, Ammonia, Oxygen, Conductivity, TDS).
- **Detailed Data Table:** Presents raw sensor data in an easy-to-read tabular format.
- **Responsive Design:** Optimized for various screen sizes, from desktop to mobile.
- **Modern UI:** Built with Tailwind CSS and Radix UI components for a clean and intuitive user experience.

## Technologies Used

This project is built using the following key technologies:

- **Next.js 15:** A React framework for building full-stack web applications.
- **React 19:** A JavaScript library for building user interfaces.
- **Supabase:** An open-source Firebase alternative providing authentication, database, and real-time capabilities.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **Shadcn UI:** A collection of re-usable components built using Radix UI and Tailwind CSS.
- **Recharts:** A composable charting library built with React and D3.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/PUTAXD/aqua_dashboard.git
    cd aqua_dashboard
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

You can find these credentials in your Supabase project settings.

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/`: Contains the main application pages and API routes.
  - `src/app/page.tsx`: The landing page, displaying recent aqua data in a table.
  - `src/app/dashboard/page.tsx`: The main dashboard with interactive charts and detailed sensor data.
  - `src/app/login/page.tsx`: User login page.
  - `src/app/auth/signout/route.ts`: API route for user sign-out.
- `src/components/`: Reusable UI components.
- `src/hooks/`: Custom React hooks, e.g., `use-aqua-data.ts` for data fetching.
- `src/lib/supabase/`: Supabase client and server configurations.
- `src/type/`: TypeScript type definitions, e.g., `aquaData.ts`.

## Deployment

**We already deploy it on vercel [right here](https://aqua-dashboard-y857.vercel.app/dashboard)**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
