# Prism

## Description

A robust financial application built with NestJS, Prisma ORM with a Postgres database, and Bootstrap SCSS.

[Preview](/assets/preview.jpeg)

## Installation

1. **Prerequisites:**

   - Ensure you have Node.js and npm installed on your system.
   - Refer to [NestJS Installation Guide](https://docs.nestjs.com/first-steps) for detailed instructions.
   - Ensure Docker installed on your system.

2. **Clone or Download the Repository:**

   - Clone the repository using Git:

     ```bash
     git clone https://github.com/ppauliushchyk/prism.git
     ```

   - Download the repository as a ZIP file.

3. **Install Dependencies:**

   - Navigate to the project directory:

     ```bash
     cd prism
     ```

   - Install project dependencies:

     ```bash
     npm install
     ```

4. **Set Up Environment Variables:**

   - Locate the `.template.env` file within the project directory.
   - Copy the `.template.env` file and rename it to `.env`.
   - Open the `.env` file in a text editor and set the required environment variables.

5. **Set up the database:**

   - Start the Postgres database using docker-compose:

     ```bash
     docker-compose up -d database
     ```

   - Run the Prisma migrations:

     - To apply pending migrations:

       ```bash
       npx prisma migrate dev
       ```

## Development

1. **Start Development Server:**

   - Run the following command to start the server and access the application at `http://localhost:3000`:

     ```bash
     npm run start
     ```

     ```bash
     npm run start:dev
     ```

     ```bash
     npm run start:prod
     ```

## Testing

1. **Unit Tests:**

   - Run unit tests for individual components with:

     ```bash
     npm run test
     ```

2. **End-to-End (E2E) Tests:**

   - Run E2E tests using Cypress with:

     ```bash
     npm run test:e2e
     ```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
npm install -g mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
