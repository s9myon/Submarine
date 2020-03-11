const express = require('express');
const router = express.Router();

function Router({ mediator, polyMath }) {

    router.get('/power/:value/:power', powerHandler);
    router.get('/poly/get/:value', getPolyHandler);
    router.post('/poly/sum', sumPolyHandler);
    router.post('/poly/sub', subPolyHandler);
    router.post('/poly/mult', multPolyHandler);
    router.all('/*', defaultHandler);

    // constructors
    const BaseRouter = require('./BaseRouter');
    // exemplars
    const baseRouter = new BaseRouter();    
    
    function getPolyHandler(req, res) {
        let { value } = req.params;
        const result = poly.getValue(value);
        if (result) {
            res.send(baseRouter.answer(result));
        } else {
            res.send(baseRouter.error(2000));
        }
        
    }
    
    function powerHandler(req, res) {
        const { value, power } = req.params;
        res.send({
            result: Math.pow(value, power)
        });
    }
       
    function sumPolyHandler(req, res) {
        let poly1 = polyMath.newPolynomial(req.body[0]);
        let poly2 = polyMath.newPolynomial(req.body[1]);
        let answer = polyMath.add(poly1, poly2);
        res.send(answer.members);
    }
    
    
    function subPolyHandler(req, res) {
        let poly1 = polyMath.newPolynomial(req.body[0]);
        let poly2 = polyMath.newPolynomial(req.body[1]);
        let answer = polyMath.sub(poly1, poly2);
        res.send(answer.members);
    }
    
    function multPolyHandler(req, res) {
        let poly1 = polyMath.newPolynomial(req.body[0]);
        let poly2 = polyMath.newPolynomial(req.body[1]);
        let answer = polyMath.mult(poly1, poly2);
        res.send(answer.members);
    }
    
    function defaultHandler(req, res) {
        res.send(baseRouter.error(404));
    }

    return router;
}

module.exports = Router;