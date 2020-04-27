const bodyParser = require('body-parser'),
      expresSanitizer = require('express-sanitizer'),
      methodOverride = require('method-override'),
      mongoose = require('mongoose'),
      express = require('express'),
      app = express();

//APP CONFIG

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expresSanitizer());
app.use(methodOverride('_method'));

//MONGOOSE CONFIG

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
                type: Date, 
                default: Date.now
             }
});

const Blog = mongoose.model('Blog', blogSchema);


//RESTFUL ROUTES

app.get('/', (req, res)=>{
    res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        } else{
            res.render('index', {blogs: blogs});
        }
    });
    
});

//NEW ROUTE
app.get('/blogs/new', (req, res)=>{
    res.render('new');
});

app.post('/blogs', (req, res)=>{

    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);

    Blog.create(req.body.blog, (err, newPost)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('blogs');
        }
    });
})

//SHOW ROUTE
app.get('/blogs/:id', (req, res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('show', {blog: blog});
        }
    });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', (req, res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            redirect('/blogs');
        } else{
            res.render('edit', {blog : blog});
        }
    });
});

app.put('/blogs/:id', (req, res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete('/blogs/:id', (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');
        }
    })
});

app.listen('3000', ()=>{
    console.log('Server is listening!');
});
      
      



