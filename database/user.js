// User Utilities

createUser = (newUser) => {  
    console.log(user);

    // saving new user
    newUser.save().then((user)=>{
        console.log('user :>> ', user);
    }).catch((err)=>{
        console.log('err :>> ', err);
    });
}
module.exports = {
    createUser
};