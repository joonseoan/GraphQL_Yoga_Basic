import { GraphQLServer } from 'graphql-yoga';

// 1)
// import Name_NAME_Modified, { message, location, getGreeting } from './myModule';
// console.log(Name_NAME_Modified)
// console.log(message, location)
// console.log(getGreeting('James'))


// 2) 
// GraphQL Scalar type: String, Boolean, Float, Int, ID

// type definition (schema)
const typeDefs = `
    type Query {
        hello: String!
        helloquery: String!
        helloold: String!
        name: String!
        location: String!
        bio: String!
        id: ID!
        age: Int!
        employeed: Boolean!
        gpa: Float
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        isStock: Boolean!
        me: User!
        post: Post!
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
        body: String!
        published: Int! 
    }
`

// Resolvers
const resolvers = {
    Query: {

        // hello: 'hello'
        // ES16

        hello() {
            return 'This is my first query'
        },

        // arrow ok. but if we use 'this' tp get another property {name: 'james'}
        // it does not work.
        // In Object, this in the function is only for binding!!!
        helloquery: () => {
            // return `james, ${this.hello}` // this is undefined because
            // arrow is already used to bind this function to Query 
            return 'This is my firt query.'
        },

        // ES 15
        helloold: function () {
            return 'This is my first query'
        },

        name() {
            return 'James'
        },
        location() {
            return 'Oakville'
        },
        bio() {
            return 'Developer'
        },
        id() {
            return 'abc123'
        },
        age() {
            return 25
        },  
        employeed() {
            return true
        },  
        gpa() {
            return null
        },
        title() {
            return 'Mac Book'
        },
        price() {
            return 3333.99
        },
        releaseYear() {
            return 2019
        },
        rating() {
            return 4.5
        },
        isStock() {
            return false
        },
        me() {
            return {
                id: '1234qwert',
                name: 'Mike',
                email: 'abc@abc.com',
                // 1) age: 29 // can delet this.
                // 2) We can set nullable property ***********
                //      even thogh User type is not nullable!!!!
            }

            
        },
        
        post() {
            return {
                id: '234yuio',
                title: 'History',
                // This is not null!!!!! *************
                body: '',
                published: 2009
            }
        }
         
        
        


    }
}



const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('Server is up at localhost 4000'));