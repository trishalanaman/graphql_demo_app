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

## Schema for the app is as follows - 
### Query 
> Users { name, age, email, password, token }

### Mutation
> signup (name, age, email, password): User

> login (email, password): User

> reset_password (email, old_password, new_password): User

> forgot_password (email): Otp

> reset_password_after_receiving_otp (email, otp, new_password): Otp

![Screenshot](https://github.com/trishalanaman/graphql_demo_app/blob/master/Screenshot%20from%202020-06-28%2023-37-33.png)
