import express from 'express'
import expressGraphQL from 'express-graphql'

const app = express()

app.use('/graphql', expressGraphQL({
  graphiql: true 
}))

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: ${PORT}`))
