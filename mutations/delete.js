import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

let users = [{
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

let posts = [{
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

let comments = [{
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
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: createUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: createPostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: createCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
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
    Mutation: {
        createUser(parent, { data: { name, email, age }}, ctx, info) {
             const emailTaken = users.some(user => user.email === email);
             if(emailTaken) throw new Error('Email is already taken');
             
             const user = {
                 id: uuidv4(),
                 name,
                 email,
                 age
             }
 
             users.push(user); // can use it with const type because it is not fro heam memory
             return user;
 
         },
         deleteUser(parent, { id }, ctx, info) {
            // user.id === id (true) : returns the first index number only 
                // out of elements which are matched with the condition.
            // user.id === id (false) : returns -1
            const userIndex = users.findIndex(user => user.id === id );
            if(userIndex === -1) {
                // never found the match
                throw new Error('Unable to find the user');   
            }
            
            /* must checkout the value is an array or object */
            // In this case, values are arrays!!!

            // delete  author in post
            posts = posts.filter(post => {
                // in order to delete post in comment first
                const match = post.author === id;
                if(match) {
                    // deleting post in comment first before deleting post in User
                    comments = comments.filter(comment => comment.post !== post.id)
                }
                // === filter(post => post.author !== id)
                return !match;
            })
            // deletting author in comment
            comments = comments.filter(comment => comment.author !== id);

            /* 
                var months = ['Jan', 'March', 'April', 'June'];
                months.splice(1, 0, 'Feb');
                // inserts at index 1
                console.log(months);
                // expected output: Array ['Jan', 'Feb', 'March', 'April', 'June']

                months.splice(4, 1, 'May');
                // replaces 1 element at index 4
                console.log(months);
                // expected output: Array ['Jan', 'Feb', 'March', 'April', 'May']
            */
            
            // firtst arg: indexNumber to be replaced or inserted
            // second arg: replace 1 element?
            // third arg : inserted or repalced valie
            //      because the third value is not available,
            //      it is replaced with ""
            const deletedUsers =  users.splice(userIndex, 1);

            return deletedUsers[0];

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
         deletePost(parent, { id }, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === id);
            if(postIndex === -1) throw new Error('Unable to find the post');

            comments = comments.filter(comment => comment.post !== id);

            // returns deleted element(s) only
            // console.log(posts) => returns the entire array without the deleted element(s)
            const deletedPosts = posts.splice(postIndex, 1);

            
            return deletedPosts[0];

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
         },
         deleteComment(parent, { id }, ctx, info) {
             const commentIndex = comments.findIndex(comment => comment.id === id);
             if(commentIndex === -1) throw new Error('Unable to find the comment');
             const deletedComment = comments.splice(commentIndex, 1);
             return deletedComment[0];
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('basic mutations'));