import { GraphQLServer } from 'graphql-yoga';



//1) Scalar types
const typeDefs = `
    type Query {
        grades: [Int!]!
        add(numbers: [Float!]!): Float
        
    }
`;

const resolvers = {
    Query : {
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
