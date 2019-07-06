// Challenge 1
import { GraphQLServer }  from 'graphql-yoga';

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

const comments = [{
    id: '123',
    text: 'So hot',
    author: 'ert345',
    post: 'www'
}, {
    id: '234',
    text: 'So cold',
    author: 'rty456',
    post: 'www'
}, {
    id: '345',
    text: 'Hey, your post is great',
    author: '567tyu',
    post: 'eee'
}, {
    id: '456',
    text: 'What a great article!',
    author: '567tyu',
    post: 'eee'
}];

const typeDefs = `
    type Query {
        comments: [Comment!]!
        users: [User!]!
        posts: [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users;
        },
        posts(parent, args, ctx, info) {
            return posts;
        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            console.log(parent)
            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user =>  user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('Challenge 1'));
