const  sharp = require('sharp')
const {S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const {getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const config = require('config')

const s3Options = {
  region: config.get('region'),
  credentials: {
    secretAccessKey: config.get('secretKey'),
    accessKeyId: config.get("accessKey")
  },
}

const s3 = new S3Client({
  region: config.get('region'),
  credentials: {
    secretAccessKey: config.get('secretKey'),
    accessKeyId: config.get('accessKey')
  }
})




const postProfileImage = async (file, imageName) => {
try {
  const buffer = await sharp(file.buffer).resize(320, 240, {fit: 'cover'}).toBuffer()

  const postParams  = {
    Bucket: config.get("bucketName"),
    Body: buffer,
    Key: imageName,
    ContentType: file.mimetype
  }

  const command = new PutObjectCommand(postParams)

  
 await s3.send(command)
} catch (error) {}
  
}

const getProfileImage = async (data) => {
  const commandParams  = {
    Bucket: config.get("bucketName"),
    Key: data.image_name,
  }
  const command = new GetObjectCommand(commandParams)
  data.image_url = await getSignedUrl(s3, command, { expiresIn: 3600 })
  
}




module.exports =  {
  postProfileImage,
  getProfileImage
}


