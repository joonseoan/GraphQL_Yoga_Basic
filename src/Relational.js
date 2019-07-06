import { GraphQLServer } from 'graphql-yoga';

const users = [{
    id: 'ert345',
    name: 'Mike',
    email: 'a@a.com',
    age: 23
}, {
    id: 'rty456',
    name: 'Sarah',
    email: 'sarah@gmail.com'
}, {
    id: '567tyu',
    name: 'James',
    email: 'james@gmail.com',
    age: 45
}];

const posts = [{
    id: 'qqq',
    title: 'Apple',
    body: 'Sweet',
    published: true,
    author: 'ert345'
}, {
    id: 'www',
    title: 'Internet',
    body: 'Addictive',
    author: 'rty456'
}, {
    id: 'eee',
    title: 'Fish',
    body: 'Tasty',
    published: true,
    author: 'rty456'
}];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me (name: String, position: String): User!
        post: Post!
        grades: [Int!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!        
    }

    type Post {
        id: ID!
        title: String!
        published: Boolean
        body: String!
        author: User!
    }
`;

const resolvers = {
    Query : {
        users(parent, { query }, ctx, info) {
           if(!query) {
               return users;
           }
           return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()) );
            
        },
        posts(parent, { query }, ctx, info) {
            if(!query) {
                return posts;
            }

            return posts.filter(post =>
            {
                const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
                const isDescriptionMatched = post.body.toLowerCase().includes(query.toLowerCase());

                return isTitleMatched || isDescriptionMatched;
            })
        },
        me(parent, args, ctx, info) {
            return {
                id: '123qwe',
                name: 'James',
                email: 'abc@abc.com',
                age: 23
            }
        },
        post(parent, args, ctx, info) {
            return { 
                id: '234wer',
                title: 'Manager',
                body: 'You ar awesome',
                published: false
            }
        }
    }, 
    Post: {
        author(parent, args, ctx, info) {
            // console.log(parent)
            return users.find(user => user.id === parent.author)
        }
    },
    User : {
        posts(parent, args, ctx, info) {
            return  posts.filter(post => post.author === parent.id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('graphql query!!!'));
