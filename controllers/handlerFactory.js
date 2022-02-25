const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeautures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(
          `${req.params.id} numaralı id ile eşleşen veri bulunamadı`,
          404
        )
      );
    }

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`${req.params.id} numaralı id ile tur bulunamadı`, 404)
      );
    }
    res.status(200).json({ status: 'success', data: { doc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, _next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateModel) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateModel) query = query.populate(populateModel);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`${req.params.id} numaralı id ile döküman bulunamadı`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, _next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourID) filter = { tour: req.params.tourID };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    //features.query.explain();
    const doc = await features.query;

    //console.log(req.requestTime);
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });
