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
     createPost(parent, { data: { title, body, published, author }}, { db: { users, posts}}, info) {
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
         return post;
     },
     deletePost(parent, { id }, { db: { posts, comments }}, info) {
        const postIndex = posts.findIndex(post => post.id === id);
        if(postIndex === -1) throw new Error('Unable to find the post');

        comments = comments.filter(comment => comment.post !== id);

        const deletedPosts = posts.splice(postIndex, 1);            
        return deletedPosts[0];

     },
     createComment(parent, { data: { text, post, author }}, { db: { users, posts, comments }}, info) {

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
     deleteComment(parent, { id }, { db: { comments }}, info) {
         const commentIndex = comments.findIndex(comment => comment.id === id);
         if(commentIndex === -1) throw new Error('Unable to find the comment');
         const deletedComment = comments.splice(commentIndex, 1);
         return deletedComment[0];
     }
}

export { Mutation };