const mongoose = require('mongoose');

module.exports = {
  connect: () => connect(),
  mongoType: () => mongoose.Types,
};

async function connect() {
  const atlasUri =
    'mongodb+srv://bs:bs123@bs23cluster.wvff3.mongodb.net/bstest?retryWrites=true&w=majority';
  if (mongoose.connection.readyState === 0) {
    return await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      keepAlive: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } else return true;
}
