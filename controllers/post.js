const Post = require('../models/post')
const Joi = require('@hapi/joi')




exports.getPosts = (req, res) => {

    const posts = Post.find().select("_id title body")
    .then(posts => {

        res.json({posts:posts});
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res) => {

    const schema = Joi.object({
        title: Joi.string().required().min(4).max(25),
        body: Joi.string().required().min(4).max(2000)

    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({

            error: error

        });
    }
    else {
        const post = new Post(req.body);
        //console.log("CREATING POST", req.body);

        post.save()
        .then(result => {

            return res.status(200).json({

                post: result

            });

        });

    }

};