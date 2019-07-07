import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import { Query, Mutation, User, Post, Comment } from './resolvers';

const server = new GraphQLServer({
    // path is based on root directory!!!!
    typeDefs: './mutations/update_after_restructuring/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
});

server.start(() => console.log('basic updating!'));