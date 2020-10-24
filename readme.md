### Development

1. Sequelize is setup following this tutorial https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp
1. If sequelize is not installed, globally, can use `npx sequelize-cli <command>`

### ENV RC

```bash
eval "$(direnv hook zsh)"
```

### Database sequlize thingy

1. fresh migrate

```bash
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
```

### Model & Seeder

```bash
npx sequelize-cli model:generate --name Role --attributes name:string
npx sequelize-cli seed:generate --name role
```

### to run the app

`npm install`

`npx nodemon`

### to visualize ERD

`npm run erd`

### CI AT BUILDKITE

- use devofotech@gmail.com (password like usual)
