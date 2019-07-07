import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import { Query, Mutation, User, Post, Comment } from './resolvers';

const server = new GraphQLServer({
    // path is based on root directory!!!!
    typeDefs: './restructuring/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    // as we setup context here,
    //  we can distribute "db" into appropriate resolver functions
    //  by using "ctx" args!!! 

    // Also, it makes the resolvers locations moves around anywhere.
    context: {
        db
    }
});

server.start(() => console.log('basic restructuring!'));