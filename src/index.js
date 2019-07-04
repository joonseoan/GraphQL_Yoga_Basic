import { GraphQLServer } from 'graphql-yoga';

// {greeting with argument}
// argument "name: String!" about the client's request
//  not about resolver function. Please,find the one below
//  that does not have the argument in the resolver.
// However, when the client requests greeting and 
//  when the argument is mandatory like (name: String!) in schema
//  it must have the argument like greeting(name: 'Jess')

// localhost:4000
// with Argument
//  ex) greeting(name: 'Jess')
// withough Argument
// ex) greeting - o, greeting() - x

/* 
    Important!!!
    When we set the second argument in client's request,
    we must provide the first argumetn whichi is not "undefined" or "null"
    even though the first argument is nullable in the schema.!!!
        greeting(name: "jake", position: "ddd" ) ==> o
        greeting(name: "" || null, position: "ddd" ) ==> error
*/

/* 
   
1) greeting(name: "", position: "Best manager" ) => error: position is undefined

2) greeting(name: null, position: "Best Employee" ) => error: position is undefined

3) greeting(name: "Mike", position: "Best manager" ) => of course working

4) greeting => of course working

*/

const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(a: Float!, b: Float!): Float!
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

const resolvers = {
    Query: {
        // Not yet about arument
        // 1) greeting(){ return 'Hello' }// ==> working even though arg is mandatory above!!!
        // 2) Of course in case (name: String) which is not mandatory in schema, 
        //      greeting(){ return 'Hello' } is still also works!!
        
        // 3) 4 differetn argument!!!: parent, args, ctx, info
        //      args for argument!!!

        // 4) ES6
        greeting(parent, { name, position }, ctx, info) {        
        // old version
        // greeting(parent, args, ctx, info) {
        //  console.log(args) //  receives a object { name: Jess }

            console.log(name) 
            // When "name:String" is not mandatory,
            //  we can build up the logic below. ******
            if(name && position) {
                return `Hello, ${name}. Your position is at ${position}`
            } else if(position) {

                return `Your positon ${positon}`
                
            } else if(name) {
                return `Your name is ${name}`
            } else {
                return 'Hello'
            }

            // When "name: String!" in Schema, we can build a single logic
            // if(name) {
            //     return `Hello, ${name}`
            // }

        },
        add(parent, {a, b}) {
            return a + b
        },
        me() {
            return {
                id: '123qwe',
                name: 'Mike',
                email: 'abc@abc.com'
            }
        },
        post() {
            return {
                id: '456rty',
                title: 'History',
                body: '',
                published: 2003
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('Query: operational query with argument'));