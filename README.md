# graphql_demo_app
### An implementation of login app based on GraphQl. Server is running on Express & for database MongoDB is used.

This repository is for demonstration purposes only. To use this app locally on Linux machine, follow these steps -

Clone this repo and extract it's content. Then press Ctrl + Alt + T or open terminal in the same directory. Then enter following commands on the terminal
- `cd graphql_demo_app-master`
- `cd server`
- `sudo apt install nodejs`
- `npm init`
- `sudo npm install express`
- `sudo npm install express-graphql`
- `sudo npm install mongoose`
- `sudo npm install lodash`
- `sudo npm install bcrypt`
- `sudo npm install jsonwebtoken`
- `sudo npm install nodemon`
- `sudo npm install nodemailer`
- To run the server, type `nodemon app` or `node app`

App will now be running on http://localhost:4000/graphql

## Schema for the app is as followas - 
### Query 
Users {
name: String
age: Int
email: String
password: String
token: String
}

### Mutation
signup(
name: String!
age: Int!
email: String!
password: String!
): User

login(email: String!password: String!): User
reset_password(
email: String!
old_password: String!
new_password: String!
): User

forgot_password(email: String!): Otp

reset_password_after_receiving_otp(
email: String!
otp: String!
new_password: String!
): Otp
