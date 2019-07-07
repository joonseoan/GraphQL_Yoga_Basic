const Query = {
    users(parent,{ query }, { db: { users }}, info) {
        if(!query) return users;

        return users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()));

    },
    posts(parent, { query }, { db: { posts }}, info) {
        if(!query) return posts;
        
        return posts.filter(post => {
            const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
            const isBodyMatched = post.body.toLowerCase().includes(query.toLowerCase());
            return isTitleMatched || isBodyMatched;
        });
    },
    comments(parent, args, { db: { comments }}, info) {
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
}

export { Query };