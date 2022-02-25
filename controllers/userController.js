const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Diske kaydetmek için fonksiyon. Aşağıda fotoğraf ile ilgili biçimlendirme
// fonksiyonu olduğu için diske kaydetmek yerine ram'e kaydediyoruz

/* const multerStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (req, file, callback) => {
    // user-68934893834-384939494.jpeg
    const extension = file.mimetype.split('/')[1];
    callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
}); */

// Fotoğrafı disk yerine ram(buffer)'e kaydediyor
const multerStorage = multer.memoryStorage();

const multerFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Bu resim değil. Düzgün dosya yükle orospu', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, _res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 85 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTed password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Bu yol şifre değiştirmek için değil', 400));
  }

  // 2) Update user document

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, _next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Hata', message: 'Yok böyle route. Sign uptan kayıt ol' });
};

// Do NOT update password with this
exports.updateUser = factory.updateOne(User);

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
