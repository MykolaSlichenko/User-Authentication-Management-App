# Rsbuild project

## Setup

Install the dependencies:

```bash
npm install
```

## Get started

Start the dev server, and the app will be available at [http://localhost:3000](http://localhost:3000).

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Docker

### Production Build

Build the Docker image:

```bash
docker build -t auth-react-app .
```

Run the container:

```bash
docker run -p 3001:3001 auth-react-app
```

Or use Docker Compose:

```bash
docker-compose up
```

### Development Build

Run the development server in Docker:

```bash
docker-compose -f docker-compose.dev.yml up
```

This mounts your source code volume for hot reloading during development.

## Learn more

To learn more about Rsbuild, check out the following resources:

- [Rsbuild documentation](https://rsbuild.rs) - explore Rsbuild features and APIs.
- [Rsbuild GitHub repository](https://github.com/web-infra-dev/rsbuild) - your feedback and contributions are welcome!
