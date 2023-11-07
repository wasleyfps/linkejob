const express    = require ('express');
const exphbs     = require('express-handlebars')
const app        = express();
const path       = require('path');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const job        = require('./models/job');
const Job        = require('./models/job');
const Sequelize  = require('sequelize');
const Op         =  Sequelize.Op;

const PORT  = 3000;

app.listen(PORT, function(){
    console.log(`O express ta na porta ${PORT}`);
});

//body_parser
app.use(bodyParser.urlencoded({ extends: false}));

//handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//db connection
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro no banco de dados");
    });


//routes
app.get('/', (req, res) =>{

    let search = req.query.job;
    let query  = '%'+search+'%';
    if(!search){
         Job.findAll({order:[
        ['createdAt', 'DESC']
    ]})
    .then(jobs =>{
        res.render('index',{
            jobs
        });
    })
    .catch(err => console.log(err));
    
    }else{
        Job.findAll({
            where:{title: {[Op.like]: query}},
            order:[
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index',{
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }
   
});

//jobs routes
app.use('/jobs', require('./routes/routesJobs')); 
