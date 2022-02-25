//const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeautures');

exports.createTour = async (req, res, next) => {
  try {
    /* const newTour = new Tour();
    newTour.save(); */

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'Hata', message: err.message });
  }
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    //console.log(req.requestTime);
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'Hata', message: err.message });
  }
};

exports.getTour = async (req, res) => {
  //console.log(req.params);
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({ id: req.params.id})

    //const tour = tours.find((element) => element.id === id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'Hata', message: 'Tur bulunamadı' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    res.status(404).json({ status: 'Hata', message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: { tour: 'Silindi' } });
  } catch (err) {
    res.status(404).json({ status: 'Hata', message: 'Tur silinemedi' });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAvarage: { $gte: 4.5 } },
      },
      {
        $group: {
          //_id: '$difficulty',
          //_id: '$ratingsAvarage',
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAvarage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      //{ $match: { _id: { $ne: 'EASY' } } },
    ]);
    res.status(200).json({ status: 'success', data: { stats } });
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStats: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStats: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({ status: 'success', data: { plan } });
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message });
  }
};
