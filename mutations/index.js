import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

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



/* 
    Posts and Comments get returned!!
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }

*/

// 2) Simpler One
//   Please, note that in order to make a variable like the one below,
//      the fields inside of the object must be all scalar type.

// data: the name is not a pre-built name

/*
// client mutation!!!
// must put "data"

mutation {
  createUser(
    data: { // ===> data
      name: "Jake",
      email: "jake@gmail.com",
      age: 34
    }
  ) {
    id
    name
    email
    posts {
      id
    }
  }
}

*/
const typeDefs = `

    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: createUserInput!): User!
        createPost(data: createPostInput!): Post!
        createComment(data: createCommentInput!): Comment!
    }

    input createUserInput {
        name: String!
        email: String!
        age: Int
    }

    input createPostInput {
        title: String!
        body: String!
        published: Boolean
        author: ID!
    }

    input createCommentInput {
        text: String!
        post: ID!
        author: ID!
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

// 1) Long Mutation 
// const typeDefs = `

//     type Query {
//         users(query: String): [User!]!
//         posts(query: String): [Post!]!
//         comments: [Comment!]!
//         me: User!
//         post: Post!
//     }

//     type Mutation {
//         createUser(name: String!, email: String!, age: Int): User!
//         createPost(title: String!, body: String!, published: Boolean, author: ID!): Post!
//         createComment(text: String!, post: ID! , author: ID!): Comment!
//     }



//     type User {
//         id: ID!
//         name: String!
//         email: String!
//         age: Int
//         posts: [Post!]!
//         comments: [Comment!]!
//     }

//     type Post {
//         id: ID!
//         title: String!
//         body: String!
//         published: Boolean
//         author: User!
//         comments: [Comment!]!
//     }

//     type Comment {
//         id: ID!
//         text: String!
//         author: User!
//         post: Post!
//     }
// `;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users
        },
        posts(parent, args, ctx, info) {
            return posts;
        },
        comments(parent, args, ctx, info) {
            return comments;
        },
        me(parent, args, ctx, info) {
            return {
                id: 'ttt',
                name: 'Alex',
                email: 'alex@example.com',
                age: 23
            }
        },
        post(parent, args, ctx, info) {
            return {
                id: 'aaa',
                title: 'Awesome you',
                body: 'hahahaha',
                published: false
            }
        }
    },
    User: {
        posts(parent, args, ctx, info) {

            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    Comment: {
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post);

        },
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        }
    },
    Mutation: {
        // since
        /* 
            input createUserInput {
                name: String!
                email: String!
                age: Int
            }
        
        */
       createUser(parent, { data: { name, email, age }}, ctx, info) {
        // createUser(parent, { name, email, age }, ctx, info) {
            // req is not available in graphql yoga?
            // console.log(args) ====> user input data
            // console.log(info.req)

            // array.some: return true or false!!!
            // If the array has a single value which is same as the input value
            //  it returs "true"
            const emailTaken = users.some(user => user.email === email);
            if(emailTaken) throw new Error('Email is already taken');
            
            // babel-plugin-object
            // const one = {
            //     name: 'toronto',
            //     country: 'Canada'

            // }

            // const two = {
            //     pop: 555555,
            //     ...one
            // }



            const user = {
                id: uuidv4(),
                name,
                email,
                age
            }

            // [ ...users, user ]; // cannot use with const type
            users.push(user); // can use it with const type because it is not fro heam memory
            return user;

        },
        createPost(parent, { data: { title, body, published, author }}, ctx, info) {
            const userVerified = users.some(user => user.id === author);
            if(!userVerified) throw new Error('User is required to signup');

            const post = {
                id: uuidv4(),
                title,
                body,
                published,
                author
            }

            // interim because database is used
            posts.push(post);
            return post;
        },
        createComment(parent, { data: { text, post, author }}, ctx, info) {

            const postVerifed = posts.some(each_post => each_post.id === post && each_post.published);
            const userVerified = users.some(user => user.id === author);
            if(!postVerifed || !userVerified) throw new Error('User or Post is not available.');

            const comment = {
                id: uuidv4(),
                text,
                post,
                author
            }

            comments.push(comment);
            return comment;
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('basic mutations'));