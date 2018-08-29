const path = require('path');
const aws = require('aws-sdk');
const s3 = new aws.S3();

const multer  = require('multer');
const multerS3 = require('multer-s3');

exports.localUploader = function(uploadDir) {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.resolve(process.cwd(), uploadDir));
		},
		filename: function (req, file, cb) {
			const fileName = file.originalname.split('.')[0];
			const fileType = file.originalname.split('.')[1];
			cb(null, `${fileName}-${Date.now()}.${fileType}`);
		}
	});
	return multer({ storage });
};

exports.awsS3Uploader = function(awsS3BucketName) {
	return multer({
		storage: multerS3({
			s3: s3,
			bucket: awsS3BucketName,
			acl: 'public-read',
			contentType: multerS3.AUTO_CONTENT_TYPE,
			// metadata: function (req, file, cb) {
			// 	cb(null, Object.assign({}, req.body));
			// },
			key: function (req, file, cb) {
				const fileName = file.originalname.split('.')[0];
				const fileType = file.originalname.split('.')[1];
				console.log(file);
				cb(null, `${fileName}-${Date.now()}.${fileType}`);
			}
		})
	});
};


