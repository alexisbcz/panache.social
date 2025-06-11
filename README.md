# panache.social

> An open-source alternative to Reddit. Powered by the community.

[![Discord](https://img.shields.io/discord/1234567890?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/eMUC7ejHja)
[![GitHub Stars](https://img.shields.io/github/stars/alexisbcz/panache.social?style=social)](https://github.com/alexisbcz/panache.social/stargazers)
[![License](https://img.shields.io/github/license/alexisbcz/panache.social)](https://github.com/alexisbcz/panache.social/blob/main/LICENSE)

## Technology Stack

- **Frontend Framework**: [Next.js](http://nextjs.com) 15.3.3
- **Styling**: [TailwindCSS](https://tailwindcss.com) v4
- **UI Components**: [ShadCN UI](https://ui.shadcn.com)
- **Database**: [PostgreSQL](https://www.postgresql.org) 16
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Form Handling**: [React Hook Form](https://react-hook-form.com)
- **Validation**: [Zod](https://zod.dev)
- **Authentication**: [Better Auth](https://better-auth.com)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Docker and Docker Compose (for local development)
- Git

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/alexisbcz/panache.social
   cd panache.social
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values.

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Start the Development Environment**

   ```bash
   # Start the PostgreSQL database
   docker compose up -d

   # Push the database schema
   npx drizzle-kit push:pg

   # Start the development server
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Database: localhost:5432

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint

## Feature Requests & Contributing

Got a cool idea? Here's how to make it happen:

1. **Join the Party**: First things first - hop into our [Discord server](https://discord.gg/eMUC7ejHja). That's where all the magic happens.

2. **Check the Issues**: Take a look at our [GitHub issues](https://github.com/alexisbcz/panache.social/issues) - maybe someone already suggested something similar. If not, create a new one!

3. **Let's Talk About It**: Before you start coding, let's discuss your idea in Discord. We want to make sure it fits with our vision and get some community feedback.

4. **Get the Green Light**: Once we've discussed and refined your idea, you'll get the go-ahead to start implementing it.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue if needed
3. Join our community discussions
