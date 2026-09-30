# Setup
1. Install Node 22+ and pnpm 9.15.
2. Run pnpm install.
3. Configure GRPC_JWT_SECRET and SESSION_SECRET in production.
4. Run pnpm db:generate.
5. Run pnpm db:migrate.
6. Run pnpm db:seed for local data.
7. Start the API with pnpm dev:api.
8. Start the user client with pnpm dev:user.
9. Run pnpm typecheck && pnpm lint && pnpm test:unit.
10. For the staged-change hook, run chmod +x .husky/pre-commit and git config core.hooksPath .husky.
11. Run pnpm test:e2e with the API available.
Never commit environment files, database files, node_modules, or build output.