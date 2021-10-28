# Content & Overview

- [Overview](#overview)
  - [User Schema](#user-schema)
    - [Values](#values)
    - [pre & methods & statics](#pre--methods--statics)
  - [Room Schema](#room-schema)
    - [Values](#values-1)
  - [Message Schema](#message-schema)
    - [Values](#values-2)
  - [Middleware](#middleware)
  - [User - Routes and methods](#user---routes-and-methods)
    - [**/user/signin** // *addUser*](#usersignin--adduser)
    - [**/user/login** // *loginUser*](#userlogin--loginuser)
    - [**/user/find** // *findUserById*](#userfind--finduserbyid)
    - [**/user/:id/findfriend** // *findUserKeyValue*](#useridfindfriend--finduserkeyvalue)
    - [**/user/:id/addfriend** // *addFriend*](#useridaddfriend--addfriend)
    - [**/user/auth** // *verifyCookie*](#userauth--verifycookie)
    - [**/user/logout** // *logout*](#userlogout--logout)
  - [Room - routes and controller](#room---routes-and-controller)
    - [**/room/:id/newroom** // *createEmptsRoom](#roomidnewroom--createemptsroom)
    - [**/room/:id/:roomId** // *inviteFriend*](#roomidroomid--invitefriend)
  - [Message - routes and controller](#message---routes-and-controller)
    - [**/msg/newmsg** // *createMessage*](#msgnewmsg--createmessage)
    - [**/msg/getmsg/** // *getMessage*](#msggetmsg--getmessage)


Our backend api - containing right now:

## User Schema 
### Values
- username
- password
- email
- avatar
- socketId
- rooms --> Array of ref 'Room'
- friends --> Array of ref 'User'
### pre & methods & statics
- pre('save') - hashing pw
- method - generate token
- method - checkMember
- statics - findbytoken 

## Room Schema
### Values
- roomName
- users - Array of ref 'User'
- messages - Array of ref 'Message'

## Message Schema
### Values
- message
- type
- sender --> Array of ref 'User'
- room --> Array of ref 'Room'


## Middleware
- authentication
  
    > **return** user
- <del>checkMember
- searchInput

    > **return** req.search = {username: input} || {email: input}
- validation 

## User - Routes and methods
### **/user/signup** // *addUser*
    > **req.body** --> info (complete user info)

    > **return** --> cookie && user
### **/user/login** // *loginUser*
    > **req.body** --> username, password

    > **res.send** --> cookie && user

### **/user/find** // *findUserById*
    > **req.body** --> id (userId)

    > **res.send** --> user (email, username)

### **/user/:id/findfriend** // *findUserKeyValue*
    > **req.search** --> needs middleware searchInput

    > **res.send** --> user

### **/user/:id/addfriend** // *addFriend*
    > **req.paprams** --> id (from user)

    > **req.body** --> friendId

    > **res.send** --> {updated : succesfull}

### **/user/auth** // *verifyCookie*
    > **res.send** --> req.user

### **/user/logout** // *logout*
    > **res.json** --> {message : Logged out..}


## Room - routes and controller
### **/room/newroom** // *createEmptsRoom
    > **req.user** --> user *from auth*
  
    > **req.body** --> roomName='empty', users=[]

    > **res.send** --> {newRoom, user.rooms}
### **GET  /room/:roomId/adduser/:friendId** // *inviteFriend*
    > **req.params** --> roomId, friendId
  
    > **req.user** --> user *from auth*
  
    > <del>**req.body** --> friendId<del>

    > **res.send** --> {success: 'just a string'}

## Message - routes and controller
### **/msg/newmsg** // *createMessage*
    > **req.body** --> roomId, msg

    > **req.user** --> user *from auth*

    > **res.send** --> {success: ''}

### **GET  /msg/getmsg/:roomId** // *getMessage*
    > <del>**req.body** --> roomId<del>

    > **req.params** --> roomId
  
    > **req.user** --> user *from auth* 

    > **res.send** --> room.messages
