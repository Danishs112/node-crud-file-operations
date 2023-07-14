const fs  = require('fs');
const express = require('express');

const app = express();

app.use(express.json())


// app.get('/', (req,res) => {
//     res.status(200).json({message:'Hello from the server side', app:'Natour'})
// })

const tours = JSON.parse(fs.readFileSync("./data/tour-simple.json"))

app.get('/api/v1/tours',(req,res) => {
     res.status(200).json({
        status:'success',
        length : tours.length,
        data: {
            tours
        }
     })
})

app.post('/api/v1/tours',(req,res) => {
    const newId = tours.length+ 1;
    console.log(tours.length)
    const newTour = Object.assign({id:newId}, req.body)

    tours.push(newTour)

    fs.writeFile(
        './data/tour-simple.json',
        JSON.stringify(tours, null, 2),
        err => {
            res.status(201).json({
                status: 'success',
                data:{
                    tour:newTour
                }
            })
        }
    )
})

app.get('/api/v1/tours/:id', (req,res) => {
   
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id == id);

    if(!tour){
        res.status(201).json({
            status:'fail',
            message:'not found'
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    })
})

app.patch('/api/v1/tours/:id',(req,res) => {
    
    const id = req.params.id * 1;
    let tour = req.body;

    if(!tours[id]){
        res.status(500).json({
            status:'failed',
            message: 'invalid id'
        })
    }
    
    const new_tour =tours.map(u => u.id !==  id ? u : {id,...tour})
    

    fs.writeFileSync(
        './data/tour-simple.json',
        JSON.stringify(new_tour,null,2),
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    )
})

app.delete('/api/v1/tours/:id', (req,res) => {
  
    const id = req.params.id * 1;

    const new_tours = tours.filter((item) => item.id !== id)

    if(!tours[id]){
        res.status(500).json({
            status:'failed',
            message: 'invalid id'
        })
    }

    fs.writeFileSync(
        './data/tour-simple.json',
         JSON.stringify(new_tours,null,2),
         res.status(200).json({
            status:'success',
            message:'data deleted successfully'
         }) )

})

const port = 3000;

app.listen(port,() => {
    console.log(`App running on port ${port}...`)
})