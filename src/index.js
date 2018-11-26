import express from 'express';
import expressGraphQL from 'express-graphql';
import schema from '../schema/schema';

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: ${PORT}`));
