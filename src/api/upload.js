exports.api = function (api, uploadHelpers) {
	const { localUpload, awsS3Upload } = uploadHelpers;

	api.post('/v1/upload', localUpload.single('fileUpload'), (req, res, next) => {
		// req.file is the `avatar` file
		// req.body will hold the text fields, if there were any
		console.log(req.file);
	});

	api.post('/v1/upload-s3', awsS3Upload.single('fileUploadS3'), (req, res, next) => {
		// req.file is the `avatar` file
		// req.body will hold the text fields, if there were any
		console.log('Uploaded: ', req.file, ' to AWS S3 Bucket: ', process.env.AWS_S3_BUCKET);
		// console.log('\n\nBody:', req.body);
	});

	return api;
};