import { GraphQLServer } from 'graphql-yoga';




// 2) Custom Type

// Demo Data
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

// Challenge
const posts = [{
    id: 'qqq',
    title: 'Apple',
    description: 'Sweet',
    published: 2004
}, {
    id: 'www',
    title: 'Internet',
    description: 'Addictive',
}, {
    id: 'eee',
    title: 'Fish',
    description: 'Tasty',
    published: 2013
}];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me (name: String, position: String): User!
        post: Post!
        grades: [Int!]!
        add(numbers: [Float!]!): Float
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        published: Int
        description: String!
    }
`;

//1) Scalar types
// const typeDefs = `
//     type Query {
//         grades: [Int!]!
//         add(numbers: [Float!]!): Float
        
//     }
// `;

const resolvers = {
    Query : {
        // Custom type
        // When Custom type using array,
        //  we do not need to square bracket in fetching data.
        /* 
            users {
               [id]  ==> x
            }

            Instead,
            users {
               id  ==> 0
            }
        */
        // 1) simple return
        // users(parent, args, ctx, info) {
            // 1) return users;
            
        // 2) With args
        users(parent, { query }, ctx, info) {
           if(!query) {
               return users;
           }
           // includes for string!!! return true or false
           return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()) );
            
        },
        //Challenge
        posts(parent, { query }, ctx, info) {
            if(!query) {
                return posts;
            }

            return posts.filter(post =>
                // mine 
                // post.title.toLowerCase().includes(query.toLowerCase()) || 
                // post.description.toLowerCase().includes(query.toLowerCase()));

                

            {
                // Master
                const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
                const isDescriptionMatched = post.description.toLowerCase().includes(query.toLowerCase());

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
                description: 'You ar awesome',
                published: 2009
            }
        },
        // Scalr type
        grades(parent, args, ctx, info) {
            return [ 99, 10, 22 ];
        },
        add(parent, { numbers }, ctx, info) {
            //console.log(numbers)
            if(numbers.length === 0) {
                return 0;
            }

            // array.reduce!!! --- Important
            // [ 1, 2, 5, 7]
            // acummulator : at the beginning 1 
            //      but it is accumulated in a defined way
            // currentValue: started in the second value, 
            //      then third value, forth value .....
            return numbers.reduce((accumulator, currentValue) => accumulator + currentValue)
        }
        
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('graphql query!!!'));
