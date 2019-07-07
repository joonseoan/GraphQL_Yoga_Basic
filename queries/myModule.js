// export const message = 'Some Message from myModule.js';
// export const location =  'oakville';
// export default 'JAMES'; 

// OR

const message = 'Some Message from myModule.js';
const location =  'oakville';
const name = 'James';
const getGreeting = name => {
    return `Welcome to the course ${name}`;
}
export { message, location, getGreeting, name as default };