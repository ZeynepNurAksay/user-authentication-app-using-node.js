import { Router } from "express";
import {userAuth} from "../middlewares/auth-guard.js";
import {Post, Profile, User} from "../models/index.js";
import { DOMAIN } from "../constants/index.js";
import {uploadPostImage as uploader} from "../middlewares/uploader.js";
import validator from "../middlewares/validator-middleware.js";
import { postValidations } from "../validators/index.js";
import generateSlug from "../functions/slug-generator.js";

const router = Router();

/**
 * @description To upload post image
 * @access Private
 * @api /posts/api/post-image-upload
 * @type POST
 */

router.post('/api/post-image-upload', userAuth, uploader.single('image'), async(req,res) => {
    try {
        let {file} = req;
        console.log("FILE", file);
        let filename = DOMAIN + "post-images/" + file.filename;
        return res.status(200).json({
            message: "Image uploaded successfully.",
            filename,
            success: true
        });
    } catch(err) {
        return res.status(400).json({
            message: "Unable to create the post.",
            success: false
        });
    }
});

/**
 * @description To create a new post by the authenticated user.
 * @access Private
 * @api /posts/api/create-post
 * @type POST
 */

router.post('/api/create-post', userAuth, postValidations, validator, async(req,res) => {
    try {
        let {body} = req;
        let post = new Post({
            author: req.user._id,
            ...body,
            slug: generateSlug(body.title)
        });
        await post.save();
        console.log("NEW_POST", post);
        return res.status(201).json({
            post,
            message: "Your post is published.",
            success: true
        });
    } catch( err) {
        return res.status(400).json({
            message: "Unable to create the post.",
            success: false
        });
    }
});

/**
 * @description To update a post posted by the authenticated user.
 * @access Private
 * @api /posts/api/update-post/:id
 * @type PUT
 */

router.put('/api/update-post/:id', userAuth, postValidations, validator, async(req,res) => {
    try {
        let {id} = req.params;
        let {user,body} = req;
        let post = await Post.findById(id);

        if(!post) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            });
        }

        if(post.author.toString() !== user._id.toString()) {
            return res.status(401).json({
                message: "Post does not belong to you.",
                success: false
            });
        }

        post = await Post.findOneAndUpdate(
            {author:user._id, _id:id}, 
            {
                ...body,
                slug: generateSlug(body.title)
            }, 
            {
                new:true
            });

        return res.status(200).json({
            message: "Post updated successfully.",
            post,
            success: true
        });
    } catch(err) {
        return res.status(400).json({
            message: "Unable to update the post.",
            success: false
        });
    }
});

/**
 * @description To like a post by an authenticated user.
 * @access Private
 * @api /posts/api/like-post/:id
 * @type PUT
 */
router.put('/api/like-post/:id', userAuth, async(req,res) => {
    try {
        let {id} = req.params;
        let post = await Post.findById(id);

        if(!post) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            });
        }

        if(post.likes.user.includes(req.user._id)){
            return res.status(400).json({
                message: "You have already liked this post.",
                success: false
            });
        }

        post = await Post.findOneAndUpdate(
            {_id:id},
            {likes: {
                count: post.likes.count + 1, 
                user: [...post.likes.user, req.user._id]
            }},
            {new:true}
        );

        return res.status(200).json({
            message: "You liked this post.",
            success: true
        });
    } catch(err) {
        return res.status(400).json({
            message: "Unable to like the post. Please try again later.",
            success: false
        });
    }
});

export default router;