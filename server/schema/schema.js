const graphql = require('graphql');
const User = require('../models/user');
const Otp = require('../models/otp');
const _ = require('lodash');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require('../check-auth')
const nodemailer = require('nodemailer');
const user = require('../models/user');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
    })
});

const OtpType = new GraphQLObjectType({
    name: 'Otp',
    fields: ( ) => ({
        email: { type: GraphQLString },
        code: { type: GraphQLString },
        attempt: { type: GraphQLInt }
    }) 
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        }
    }
});

var signup = {
    type: UserType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args){
        var x=await User.find({"email": args.email});
        var hashed= await bcrypt.hash(args.password, 10);    
            let user = new User({
                name: args.name,
                age: args.age,
                email: args.email,
                password: hashed
            });
        user.token = jwt.sign({ userId: user.id }, APP_SECRET)
        return user.save()
    }  
}

var login = {
    type: UserType,
    args: { 
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args){
        var x=await User.find({"email": args.email});
        var user=x[0];
        if (!user) {
            throw new Error('No such user found')
        }
        
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
            throw new Error('Invalid password')
        }
        user.token =jwt.sign({ userId: user.id }, APP_SECRET);
        return user;
    }
}

var reset_password = {
    type: UserType,
    args: { 
        email: { type: new GraphQLNonNull(GraphQLString) },
        old_password: { type: new GraphQLNonNull(GraphQLString) },
        new_password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args){
        var x=await User.find({"email": args.email});
        var user=x[0];
        if (!user) {
            throw new Error('No such user found')
        }       
        const valid = await bcrypt.compare(args.old_password, user.password);
        if (!valid) {
            throw new Error('Invalid current password')
        }
        else {
            var hashed= await bcrypt.hash(args.new_password, 10);
            user.password=hashed;
        }
        user.token =jwt.sign({ userId: user.id }, APP_SECRET);
        return user.save();
    }
}



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:   'agarwaltanu752@gmail.com',
        pass:   'tanu@123A'
    }
});

var send_otp = {
    type: OtpType,
    args: { 
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args){
        var x=await User.find({"email": args.email});
        var user=x[0];
        if (!user) {
            throw new Error('No such user found')
        }       
        else {
            var y=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
            var hashed= await bcrypt.hash(y, 10);
            
            let mailOptions = {
                from: 'agarwaltanu752@gmail.com',
                to:  args.email,
                subject: 'OTP to reset password',
                text: 'Enter this OTP with email and new password in query ( reset_password_after_receiving_otp), you will have three attempts to change your password : '+ y
                };
            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                }
                    console.log(response)
                });
            var already_present=await Otp.find({"email": args.email});
            if(already_present[0]){
                already_present[0].code=hashed;
                return already_present[0].save();
            }
            else{
                let otp = new Otp({
                    email: args.email,
                    code: hashed,
                    attempt: 0
                });
                return otp.save();
            }
        }      
    }   
}

var reset_password_otp = {
    type: OtpType,
    args: { 
        email: { type: new GraphQLNonNull(GraphQLString) },
        otp: { type: new GraphQLNonNull(GraphQLString) },
        new_password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args){
        var x=await User.find({"email": args.email});
        var y=await Otp.find({"email": args.email});
        if (!x[0]||!y[0]) {
            throw new Error('No such user found')
        }   
        y[0].attempt = y[0].attempt + 1;    
        const valid = await bcrypt.compare(args.otp,y[0].code);
        if (y[0].attempt>3) {
            y[0].save()
            throw new Error('All attempts exhausted.')
        }
        else if (!valid) {
            y[0].save()
            throw new Error('Invalid otp. '+(3-y[0].attempt)+' attempts left')
        }
        else {
            var hashed= await bcrypt.hash(args.new_password, 10);
            x[0].password=hashed;
            y[0].attempt=0;
        }
        x[0].save();
        return y[0].save();
    }
}

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: signup,
        login: login,
        reset_password: reset_password,
        forgot_password: send_otp,
        reset_password_after_receiving_otp: reset_password_otp
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});