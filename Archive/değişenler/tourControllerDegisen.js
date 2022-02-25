//const fs = require('fs');
const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
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
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort('price ratingsAvarage') önce price ile price aynı olanları rating ile sıralıyor
    } else {
      query = query.sort('-createdAt');
    }

    //Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination

    /* const { limit, page } = req.query;

    const skip = ((Number(page) || 1) - 1) * (Number(limit) || 100);

    query = query.skip(skip).limit(Number(limit) || 100); */

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberTours = await Tour.countDocuments();
      if (skip >= numberTours) throw new Error('Sayfa bu kadar yaprağım');
    }

    const tours = await query;

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
