require('./tests').run({}, function(err, res){
  if (err){
    console.log(err);
    process.exit(1);
  }
  process.exit();
});