const express = require('express');
const { passport } = require('../auth');
const { Post, User } = require('../models');
const { localUploader, awsS3Uploader } = require('../util/helpers/fileUpload');

const auth	= require('./auth');
const posts = require('./posts');
const upload = require('./upload');

const uploadHelpers = {
	localUpload: localUploader('upload'),
	awsS3Upload: awsS3Uploader(process.env.AWS_S3_BUCKET),
};

const api = express.Router();

auth.api(api, passport);
posts.api(api, Post, User);
upload.api(api, uploadHelpers);

module.exports = api;
