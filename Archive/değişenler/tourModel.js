// Embeded type relation
/* tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
}); */

/* tourSchema.pre('save', (next) => {
  console.log('Dosya kaydedilecek');
  next();
});

tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
}); */
