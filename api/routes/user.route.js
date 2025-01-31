import express  from "express"



const router = express.Router();


router.get('/test', function(req, res){
    res.send('Hello from the API endpoint!');
})

export default router;

