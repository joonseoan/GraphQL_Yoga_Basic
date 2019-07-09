import uuidv4 from 'uuid/v4'; 

const Mutation = {
    createUser(parent, { data: { name, email, age }}, { db: { users }}, info) {
         const emailTaken = users.some(user => user.email === email);
         if(emailTaken) throw new Error('Email is already taken');
         
         const user = {
             id: uuidv4(),
             name,
             email,
             age
         }

         users.push(user);
         return user;

     },
     updateUser(parent, { id, data: { name, email, age }}, { db: { users }}, info) {
        const user = users.find(user => user.id === id);
        if(!user) throw new Error('Unable to find the user');
        
        if(typeof name === 'string') {
            user.name = name;
        }
        
        if(typeof email === 'string') {
            const isEmailExisting = users.some(user => user.email === email);
            if(isEmailExisting) throw new Error('The email already exists.');
            user.email = email;
        }

        if(typeof age !== 'undefined') {
            console.log(typeof age)
            if(typeof age === 'number') {
                user.age = age;
            } else {
                throw new Error('Invalid Input')
            }
        } 
        return user;
     },
     deleteUser(parent, { id }, { db: { users, posts, comments }}, info) {
        const userIndex = users.findIndex(user => user.id === id );
        if(userIndex === -1) {
            throw new Error('Unable to find the user');   
        }
        
        posts = posts.filter(post => {
            const match = post.author === id;
            if(match) {
                comments = comments.filter(comment => comment.post !== post.id)
            }
            return !match;
        })
        comments = comments.filter(comment => comment.author !== id);

        const deletedUsers =  users.splice(userIndex, 1);

        return deletedUsers[0];

     },
     createPost(parent, { data: { title, body, published, author }}, { db: { users, posts }, pubsub }, info) {
         const userVerified = users.some(user => user.id === author);
         if(!userVerified) throw new Error('User is required to signup');

         const post = {
             id: uuidv4(),
             title,
             body,
             published,
             author
         }

         posts.push(post);
         if(published) pubsub.publish('post', { 
             // mapping it over the return type of Schema
             post: {
                 mutation: 'CREATED',
                 data: post
             } 
            });
         
         return post;
     },
     updatePost(parent, { id, data: { title, body, published, author }}, { db: { users, posts }}, info) {
         const userVerified = users.some(user => user.id === author)
         if(!userVerified) throw new Error('Unable to find the user');

         const post = posts.find(post => post.id === id);
         if(!post) throw new Error('Unable to find the post');

         if(typeof title === 'string') {
            post.title = title;
         }

         if(typeof body === 'string') {
             post.body = body;
         }

         if(typeof published !== 'undefined' && typeof published === 'boolean') {
             post.published = published;
         }

         return post;
     },
     deletePost(parent, { id }, { db: { posts, comments }, pubsub}, info) {
        const postIndex = posts.findIndex(post => post.id === id);
        if(postIndex === -1) throw new Error('Unable to find the post');

        comments = comments.filter(comment => comment.post !== id);

        // ES5
        // const deletedPosts = posts.splice(postIndex, 1);            

        //ES6
        const [ post ] = posts.splice(postIndex, 1); 

        // deleted notification
        if(post.published) {
            pubsub.publish('post', { post: {
                mutation: 'DELETED',
                data: post
            }})
        }

        return post;
        // return deletedPosts[0];

     },
     createComment(parent, { data: { text, post, author }}, { db: { users, posts, comments }, pubsub }, info) {

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
         // post (postId) must areadly exist.!!
         // On a basis of this state, we can use subscription,
         //     because the pubsub.asyncIterator is setup to find the existing postId
         pubsub.publish(`comment ${ post }`, {
             comment
         });
         return comment;
     },
     deleteComment(parent, { id }, { db: { comments }}, info) {
         const commentIndex = comments.findIndex(comment => comment.id === id);
         if(commentIndex === -1) throw new Error('Unable to find the comment');
         const deletedComment = comments.splice(commentIndex, 1);
         return deletedComment[0];
     },
     updateComment(parent, { id, data: { text, author, post } }, { db: { users, posts, comments }}, info) {
         const isUserVerified = users.some(user => user.id === author);
         if(!isUserVerified) throw new Error('Unable to find the user');

         const isPostExisting = posts.some(each_post => each_post.id === post);
         if(!isPostExisting) throw new Error('Unable to find the post');

         const comment = comments.find(comment => comment.id === id);
         if(!comment) throw new Error('Comment is not availalbe!');

         if(typeof text === 'string') {
             comment.text = text;
         }

         return comment;
     }
}

export { Mutation };