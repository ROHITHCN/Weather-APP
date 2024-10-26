# Weather-APP 🌤️

## Overview
Weather-APP is a real-time data processing system designed to monitor weather conditions across major Indian metros and deliver summarized insights using rollups and aggregates. This system pulls weather data from the OpenWeatherMap API, providing daily summaries, alerting capabilities, and insightful visualizations to keep users informed of weather trends.

## Live Demo

You can access the live version of this project [here](https://juspay-saas-dashboard.netlify.app/).

## Features

- Real-Time Weather Monitoring:
  Continuous retrieval of up-to-date weather data for major Indian metropolitan cities:
    Bengaluru
    Delhi
    Mumbai
    Chennai
    Kolkata
    Hyderabad
- Temperature Conversion:
  Automatic conversion of temperature values from Kelvin to Celsius for user-friendly display.
- Daily Weather Summaries:
  Generate comprehensive daily summaries with weather aggregates, including:
    Average Temperature: Overall average temperature for the day.
    Maximum Temperature: Highest recorded temperature of the day.
    Minimum Temperature: Lowest recorded temperature of the day.
    Dominant Weather Condition: The most frequent weather condition throughout the day (e.g., Clear, Cloudy, Rainy).
- Customizable Alerts:
  Set your own alerting thresholds based on:
    Temperature limits (e.g., receive an alert if the temperature exceeds 40°C).
    Specific weather conditions (e.g., alerts for storms or rain).
- Email Notifications:
  Receive real-time email notifications when any of your weather thresholds are triggered. Stay informed wherever you are.
  We've optimized the alert-setting process using Zod for validation, ensuring that your input is correct and reliable.
- Visual Graph for Average Temperature
    Visual Representation: The system includes a visually engaging graph that displays the average temperature trends over time using Chart.js. This allows users to easily interpret weather patterns and temperature fluctuations at a glance.
- Extended Weather Metrics:
  In addition to temperature, the system also supports monitoring and displaying other weather parameters, such as:
    Humidity
    Wind Speed
    Precipitation
    Visibility
- DB Optimization: Entry Limitation Feature:

  Prevent Traffic Congestion: Limits the number of entries to 10 per user to avoid database overload and reduce traffic bottlenecks.
  1)Ensure Data Integrity: Restricts excessive or redundant entries, keeping the data clean and relevant.
  2)Boost Performance: Helps maintain faster query responses and optimized read/write operations for a smoother experience.
  3)Enhance Resource Management: Limits entry volume to manage storage efficiently and improve scalability.
  4)Ensure System Scalability: This optimization supports system performance and responsiveness as the user base grows.

## Libraries and Dependencies
  Here's a list of the dependencies with their versions and purposes

### Frontend Dependencies

| Library                    | Version   | Purpose                                                              |
|----------------------------|-----------|----------------------------------------------------------------------|
| `@material-tailwind/react` | ^2.1.10   | React components styled with Tailwind CSS.                           |
| `@testing-library/jest-dom`| ^5.17.0   | Custom Jest matchers for DOM node assertions.                        |
| `@testing-library/react`   | ^13.4.0   | React testing utilities for Jest.                                    |
| `@testing-library/user-event` | ^13.5.0 | Simulates user interactions in tests.                                |
| `axios`                    | ^1.7.7    | Promise-based HTTP client for making API requests.                   |
| `chart.js`                 | ^4.4.5    | JavaScript charting library for data visualization.                  |
| `react`                    | ^18.2.0   | Core React library.                                                  |
| `react-chartjs-2`          | ^5.2.0    | React wrapper for Chart.js.                                          |
| `react-dom`                | ^18.2.0   | DOM-specific methods for React.                                      |
| `react-icons`              | ^5.3.0    | Icon library for React with popular icon packs.                      |
| `react-scripts`            | 5.0.1     | Scripts and configuration for Create React App.                      |
| `react-toastify`           | ^10.0.6   | Library for toast notifications in React.                            |
| `web-vitals`               | ^2.1.4    | Library to measure essential web performance metrics.                |
| `@types/chart.js`          | ^2.9.41   | Type definitions for Chart.js.                                       |
| `tailwindcss`              | ^3.4.14   | Utility-first CSS framework for custom styling.                      |

### Backend Dependencies

| Library                    | Version   | Purpose                                                              |
|----------------------------|-----------|----------------------------------------------------------------------|
| `axios`                    | ^1.7.7    | Promise-based HTTP client for making API requests.                   |
| `cors`                     | ^2.8.5    | Middleware for handling Cross-Origin Resource Sharing.               |
| `dotenv`                   | ^16.4.5   | Loads environment variables from `.env` files.                       |
| `express`                  | ^4.21.1   | Web application framework for Node.js.                               |
| `luxon`                    | ^3.5.0    | Library for working with dates and times.                            |
| `mongoose`                 | ^8.7.2    | MongoDB object modeling tool for Node.js.                            |
| `nodemailer`               | ^6.9.15   | Module for sending emails.                                           |
| `zod`                      | ^3.23.8   | Schema validation library.                                           |
| `nodemon`                  | ^3.1.7    | Tool for automatically restarting the server during development.     |

  
# Design Choices

Material-Tailwind for better UI

Real-Time Data Processing: The system fetches weather data from the OpenWeatherMap API every 5 minutes to ensure real-time monitoring. You can obtain your API key by following the link.

Database: Weather data, including daily summaries, is stored persistently using MongoDB. You can set up your MongoDB cluster through MongoDB Atlas.

Email Notifications: Alerts and notifications are sent via email using Nodemailer, a Node.js module for sending emails.

MailTrap: for mail notofications and testing
