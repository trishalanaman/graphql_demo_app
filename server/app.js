const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');


const app = express();


// connect to mlab database
// make sure to replace my db string & creds with your own
mongoose.connect('mongodb+srv://Trishala:expressapp@cluster0-8pl9u.mongodb.net/GRAPHQL-EXPRESS?retryWrites=true&w=majority',{
    useCreateIndex: true,     
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});