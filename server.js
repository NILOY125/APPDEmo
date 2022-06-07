const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const mongoose=require('mongoose')
const dbdriver="mongodb+srv://niloyBlog:BhrJX3OLHKmSS21K@cluster0.2vcoa.mongodb.net/StudentCrud"
const session=require('express-session')
const flash = require('connect-flash')
 
app.use(session({
    secret:'secrect',
    cookie:{maxAge:600000},
    resave:false,
    saveUninitialized:false
}))
app.use(flash())

//stape1 file upload
const multer=require('multer')

//step2 file upload
app.use('/upload',express.static(path.join(__dirname,'upload')))

// step3
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

//step4 file type
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.includes('png') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('jpeg')){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}

//step5 file upload
app.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('image'))


app.set('view engine','ejs')
app.set('views','views')

app.use(express.urlencoded({
    extended: true
}));

const route=require('./route/route')
app.use(route)
// const student=require('./route/student_route')
// app.use(student)
const apiRoute=require('./route/apiRoute')
app.use('/api', apiRoute)


const port=process.env.PORT || 2001
mongoose.connect(dbdriver,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    app.listen(port,()=>{
        console.log(`server running at http://localhost:${port}`);
        console.log(`Database connected`);
    })
}).catch(err=>{
    console.log(`connection failed`);
})
