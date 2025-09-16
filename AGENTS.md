# Agent Guidelines for Cyberpunk Dashboard

## Commands
- **Install**: `pnpm i`
- **Dev**: `pnpm dev` (http://localhost:3000)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Start**: `pnpm start`
- **Test**: No test runner yet; use `node scripts/test-deployment.js [base-url] [admin-key]` for API checks

## Code Style
- **Language**: TypeScript (strict mode enabled)
- **Formatting**: 2 spaces indent, double quotes, semicolons
- **Imports**: Use `@/` path aliases (e.g., `@/lib/utils`, `@/components/ui/button`)
- **Components**: PascalCase (e.g., `Button`, `UserCard`)
- **Files**: kebab-case for routes, lowercase for UI components
- **Types**: Use Zod schemas with type inference (e.g., `export type User = z.infer<typeof UserSchema>`)

## Error Handling
- Use try-catch blocks in API routes
- Return NextResponse.json with appropriate status codes
- Validate input with Zod schemas
- Log errors via `lib/request-logger` (never log secrets)

## Naming Conventions
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case for pages/routes, camelCase for utilities

## Architecture
- **Components**: Default to server components; add `"use client"` only when needed
- **API Routes**: Use App Router with `route.ts` files
- **Database**: Supabase with RLS enabled
- **State**: React hooks for client state, server actions for mutations

## Security
- Never commit secrets; use environment variables
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_API_KEY`
- Use `lib/auth-middleware` for protected routes
- Redact sensitive data in logs

## Commit Style
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Keep commits atomic and focused
- Update `scripts/00N_*.sql` for DB changes
