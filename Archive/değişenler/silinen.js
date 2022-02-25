/// Request body kontrol ediyor name ve price yoksa hata veriyor
/// Middleware
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'hata',
      message: 'İsim veya ücret eksik',
    });
  }
  next();
};

/// Request'teki id parametresini alıp tur sayısından fazla ise hata veriyor
/// Middleware

exports.checkID = (req, res, next) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'hata',
      message: 'Geçersiz ID',
    });
  }
  next();
};

//const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));

fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours);

      //console.log(req.body);
   const newId = tours[tours.length - 1].id + 1;
  //const newTour = Object.assign({ id: newId }, req.body);
  const newTour = { id: newId, ...req.body };

tours.push(newTour);
  
// Mongoose
    const tours = await Tour.find(JSON.parse(queryStr));

     const tours = await Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy'); // CHAIN QUERY */

     const query = Tour.find(queryObj); /// Build query
     const tours = await query;         /// Execute query