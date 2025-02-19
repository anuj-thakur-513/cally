# Cally

Backend of [https://cally.anujthakur.dev](https://cally.anujthakur.dev)

This is a very simple and basic alternate to [cal.com](cal.com). It lets you share your scheduler link with people and lets them send meeting requests to you. You'll be receiving an email on any new meeting request

## Run Locally

Clone the project

```bash
  git clone https://github.com/anuj-thakur-513/cally
```

Go to the project directory

```bash
  cd cally
```

Install dependencies

```bash
  npm install
```

- Update `.env.sample` to `.env` and add the required variables
- Also connect to your PostgreSQL DB using prisma and add the required key files in the prisma directory

Start the server

```bash
  npm run start:dev
```

## Contributing to Cally

- Fork the repo
- Create a new branch for your feature or bug fix
- Make your changes
- Commit your changes
- Push your changes to your fork
- Create a pull request
