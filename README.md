# Content & Overview

- [Content & Overview](#content--overview)
  - [Socket Stuff](#socket-stuff)
    - [Emitters](#emitters)
    - [Listeners](#listeners)
  - [User Schema](#user-schema)
    - [Values](#values)
    - [pre & methods & statics](#pre--methods--statics)
  - [Room Schema](#room-schema)
    - [Values](#values-1)
  - [Message Schema](#message-schema)
    - [Values](#values-2)
  - [Middleware](#middleware)
  - [User - Routes and methods](#user---routes-and-methods)
    - [**/user/signup** // *addUser*](#usersignup--adduser)
    - [**/user/login** // *loginUser*](#userlogin--loginuser)
    - [**/user/find** // *findUserById*](#userfind--finduserbyid)
    - [**/user/:id/findfriend** // *findUserKeyValue*](#useridfindfriend--finduserkeyvalue)
    - [**/user/:id/addfriend** // *addFriend*](#useridaddfriend--addfriend)
    - [**/user/auth** // *verifyCookie*](#userauth--verifycookie)
    - [**/user/logout** // *logout*](#userlogout--logout)
  - [Room - routes and controller](#room---routes-and-controller)
    - [**/room/newroom** // *createEmptsRoom](#roomnewroom--createemptsroom)
    - [**GET  /room/:roomId/adduser/:friendId** // *inviteFriend*](#get--roomroomidadduserfriendid--invitefriend)
  - [Message - routes and controller](#message---routes-and-controller)
    - [**/msg/newmsg** // *createMessage*](#msgnewmsg--createmessage)
    - [**GET  /msg/:roomId** // *getMessage*](#get--msgroomid--getmessage)


Our backend api - containing right now:

## Socket Stuff
### Emitters
  - **register** to all friends {userId}
  -  **welcome** to other user {string}
  -  **unRegister** to all friends {userId}

### Listeners
> **"handshake"**
  - *expects:* userId
  
  - *doing:* join public space of other user
  
  - *response:* **welcome** to other user {string}   

> **"disconnect"**
  - *expects*:
  
  - *doing*: update User (online false)
  
  - *response*: **unRegister** to all friends {userId}
     


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
  
   <del> > **req.body** --> friendId

    > **res.send** --> {success: 'just a string'}

## Message - routes and controller
### **/msg/newmsg** // *createMessage*
    > **req.body** --> roomId, msg

    > **req.user** --> user *from auth*

    > **res.send** --> {success: ''}

### **GET  /msg/:roomId** // *getMessage*
   <del> > **req.body** --> roomId

    > **req.params** --> roomId
  
    > **req.user** --> user *from auth* 

    > **res.send** --> room.messages
