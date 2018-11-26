const graphql = require('graphql');
import axios from 'axios';

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`);
        return response.data;
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
       type: CompanyType,
       async resolve(parentValue, args) {
         const response = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`);
         return response.data;
       }
    }
  })
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/users/${args.id}`);
        return response.data;
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/companies/${args.id}`);
        return response.data;
      }
    },
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
         firstName: { type: new GraphQLNonNull(GraphQLString) },
         age: { type: new GraphQLNonNull(GraphQLInt) },
         companyId: { type: GraphQLString }
      },
      async resolve(parentValue, { firstName, age }) {
        const response = await axios.post('http://localhost:3000/users', { firstName, age });
        return response.data;
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      async resolve(parentValue, { id }) {
        const response = await axios.delete(`http://localhost:3000/users/${id}`);
        return response.data;
      }
    },
  }
});

export default new GraphQLSchema({
  query,
  mutation
});
