# Contributing to Altimeter

Thank you for your interest in contributing to Altimeter! This document provides guidelines for contributing to the project.

## Repository Structure

- **Upstream Repository**: [pqub/altimeter](https://github.com/pqub/altimeter) - The main/owner repository
- **Your Fork**: `<your-username>/altimeter` - Your personal fork for development

## How to Contribute

### 1. Setting Up Your Development Environment

```bash
# Fork the repository on GitHub first, then clone your fork
git clone https://github.com/<your-username>/altimeter.git
cd altimeter

# Add the upstream repository as a remote
git remote add upstream https://github.com/pqub/altimeter.git

# Install dependencies
pnpm install

# Run tests to ensure everything works
pnpm run test:unit
```

### 2. Making Changes

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines
3. Run linting and type checking:

   ```bash
   pnpm run lint
   pnpm run check-types
   ```

4. Run tests to ensure nothing is broken:

   ```bash
   pnpm run test:unit
   ```

5. Format your code:
   ```bash
   pnpm run format
   ```

### 3. Committing Your Changes

We use [conventional commits](https://www.conventionalcommits.org/) for clear commit history:

```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve issue with xyz"
```

Common commit types:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### 4. Creating a Pull Request to Upstream

To contribute your changes back to the main repository (pqub/altimeter):

#### Option A: Via GitHub Web Interface

1. Push your changes to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Navigate to [github.com/pqub/altimeter](https://github.com/pqub/altimeter)

3. Click "New Pull Request"

4. Click "compare across forks"

5. Set the following:
   - **base repository**: `pqub/altimeter`
   - **base branch**: `main` (or appropriate target branch)
   - **head repository**: `<your-username>/altimeter`
   - **compare branch**: `feature/your-feature-name`

6. Fill in the PR description with:
   - A clear title describing the change
   - Detailed description of what was changed and why
   - Any relevant issue numbers
   - Screenshots if applicable (especially for UI changes)

#### Option B: Via GitHub CLI

If you have the GitHub CLI installed:

```bash
# Ensure you're on your feature branch
git checkout feature/your-feature-name

# Push to your fork
git push origin feature/your-feature-name

# Create PR to upstream
gh pr create --repo pqub/altimeter --base main --head <your-username>:feature/your-feature-name
```

### 5. After Creating the Pull Request

- Respond to any review comments promptly
- Make requested changes on the same branch
- Push updates to keep the PR in sync:
  ```bash
  git push origin feature/your-feature-name
  ```

## Code Style Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features

## Testing

Before submitting a PR, ensure:

- [ ] All existing tests pass: `pnpm run test:unit`
- [ ] New features have corresponding tests
- [ ] Code is formatted: `pnpm run format`
- [ ] No linting errors: `pnpm run lint`
- [ ] Type checking passes: `pnpm run check-types`

## Building and Packaging

To test the extension locally:

```bash
# Build the extension
pnpm run compile

# Package as .vsix
pnpm run package
```

## Questions or Issues?

If you have questions or run into issues:

1. Check existing [issues](https://github.com/pqub/altimeter/issues)
2. Create a new issue if your question hasn't been addressed
3. Provide as much context as possible

## License

By contributing to Altimeter, you agree that your contributions will be licensed under the MIT License.

## Thank You! 🎉

Your contributions help make Altimeter better for everyone. We appreciate your time and effort!
