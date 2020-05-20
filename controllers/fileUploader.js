const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { spawn } = require('child_process');
const instagram = require('./instagram');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public');
  },
  filename(req, file, cb) {
    if (file.mimetype === 'audio/wav') {
      cb(null, `${file.originalname}.wav`);
    } else {
      cb(null, `${file.originalname}`);
    }
  },
});
const upload = multer({ storage }).single('file');

exports.fileUploader = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    if (req.file) {
      const { recepients } = req.body;
      const filePath = req.file.path;
      const filePathJPG =
        path.parse(filePath).ext === '.png'
          ? `public/${path.parse(filePath).name}.jpg`
          : '';
      let response;
      if (filePathJPG) {
        sharp(filePath)
          .jpeg()
          .toFile(filePathJPG, async (err_1, info) => {
            if (!err_1) {
              console.log(info);
              response = await instagram.uploadFile(
                filePathJPG,
                recepients,
                'photo',
              );
              fs.unlinkSync(filePathJPG);
              fs.unlinkSync(filePath);
              if (response) {
                res.status(200).json({
                  type: 'uploadFileSuccess',
                  payload: {
                    status: true,
                    response,
                  },
                });
              }
            }
            return false;
          });
      } else {
        response = await instagram.uploadFile(filePath, recepients, 'photo');
        fs.unlinkSync(filePath);
        if (response) {
          res.status(200).json({
            type: 'uploadFileSuccess',
            payload: {
              status: true,
            },
          });
        }
      }
    }
    return false;
  });
};

exports.sendAudio = async (req, res) => {
  const sendAudioToInstagram = async (filePath, recepient) => {
    try {
      const response = await instagram.uploadFile(filePath, recepient, 'audio');
      return response;
    } catch (error) {
      return error;
    }
  };

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }
    if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file, req.body);
    if (req.file) {
      const filePath = req.file.path;
      const { recepient } = req.body;
      const fileName = path.parse(filePath).name;
      const resType = 'Audio sent successfully';
      try {
        const child = spawn(
          'ffmpeg',
          [
            '-i',
            `${path.resolve(filePath)}`,
            '-c:a',
            'aac',
            '-ar',
            44100,
            '-metadata:g',
            'com.android.version="8.0.0"',
            '-movflags',
            'use_metadata_tags',
            `${path.resolve('public', `${fileName}.mp4`)}`,
          ],
          {
            stdio: 'inherit',
          },
        );
        child.on('close', async (data) => {
          const mp4Path = path.resolve('public', `${fileName}.mp4`);
          if (data === 0) {
            const response = await sendAudioToInstagram(mp4Path, recepient);
            if (response === resType) {
              res.status(200).send({
                type: 'AudioSentResponse',
                payload: {
                  status: true,
                  message: response,
                },
              });
              fs.unlinkSync(filePath);
              fs.unlinkSync(mp4Path);
            } else {
              res.status(500).send({
                type: 'AudioSentError',
                payload: {
                  status: false,
                  message: response,
                },
              });
              fs.unlinkSync(filePath);
              fs.unlinkSync(mp4Path);
            }
          }
        });
        child.on('error', (spawnErr) => {
          throw new Error(spawnErr);
        });
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  });
};

exports.profilePhotoUpdater = (req) => {
  return new Promise((resolve, reject) => {
    upload(req, null, (err) => {
      if (err instanceof multer.MulterError) {
        reject(err);
      }
      if (err) {
        reject(err);
      }
      if (req.file) {
        resolve(req);
      }
      return 0;
    });
  });
};
