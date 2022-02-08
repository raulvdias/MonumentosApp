if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: 'mongodb+srv://raulteste:310898@monumentoapp.lh6wq.mongodb.net/monumentoapp?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/monumentoapp'}
}