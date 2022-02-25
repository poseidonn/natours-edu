const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    /* name: String,
    rating: Number,
    price: Number, */
    name: {
      type: String,
      required: [true, 'Turun adı olmalı'],
      unique: [true, 'Aynı isimli bir tur var'],
      trim: true,
      maxlength: [40, 'Turun adı 40 karakter ya da daha az olmalı'],
      minlength: [10, 'Turun adı 10 karakter veya daha fazla olmalı'],
      //validate: [validator.isAlpha, 'Turun adında sadece harf olmalı'],
      validate: {
        validator: (val) =>
          validator.isAlpha(val, ['tr-TR'], {
            ignore: ' ',
          }),
        message: 'Turun adında zart zurt',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Turun uzunluğu olmalı'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Turun maximum grup sayısı olmalı'],
    },
    difficulty: {
      type: String,
      required: [true, 'Turun zorluk seviyesi olmalı'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Zorluk easy,medium ya da difficult olabilir',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Puan 1'den düşük olamaz"],
      max: [5, "Puan 5'ten büyük olamaz"],
      set: (value) => Math.round(value * 10) / 10,
      // value 4.66666 olsa 5'e yuvarlayacak. 10 ile çarptığımızda 47ye yuvarlıyor sonra
      //10'a böldüğümüzde istediğimiz sonucu alıyoruz. 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Ücret girilmeli'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only point to current doc on NEW document creation
          return value < this.price;
        },
        message: 'indirim, ücretten ({VALUE}) fazla olamaz yaprağım',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Turun tanımı olmalı'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Turun kapak resmi olmalı'],
    },
    images: [String],
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.index({ price: 1, ratingsAvarage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ starstLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

// document middleware save() ve create() komutundan önce çalışır
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  //this.select('-__v');
  next();
});

// Query middleware

//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  //console.log(docs);
  next();
});

// Aggregate middleware

tourSchema.pre('aggregate', function (next) {
  for (let i = 0; i < this.pipeline().length; i += 1) {
    if (Object.prototype.hasOwnProperty.call(this._pipeline[i], '$geoNear')) {
      this.pipeline().splice(1, 0, {
        $match: { secretTour: { $ne: true } },
      });
    }
  }
  //console.log(this.pipeline());
  next();
});
/*
 tourSchema.post('aggregate', function (docs, next) {
  console.log(this);
  next();
}); */

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
