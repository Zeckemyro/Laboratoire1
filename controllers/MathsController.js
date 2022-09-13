const path = require('path');
const fs = require('fs');
const { parse } = require('query-string');
module.exports = 
    class MathsController extends require('./Controller'){
        constructor(HttpContext){
            super(HttpContext);
            this.params = HttpContext.path.params;
        }
        sendError(errorMessage){
            this.params.error = errorMessage;
            return false;
        }
        getNumber(name) {
            if (name in this.params) {
                let n = this.params[name];
                let value = parseFloat(n);
                if (!isNaN(value)){
                    this.params[name] = value;
                    return true;
                }
                else
                    return this.sendError(name + " is not a number");
            } else {
                return this.sendError(name + " is missing");
            }
        }
        checkNbParams(nbParams){
            if(Object.keys(this.HttpContext.path.params).length > nbParams){
                this.sendError("Too many parameters");
                return false;
            }
            return true;
        }
        get(){
            if(this.HttpContext.path.queryString == '?'){
                // Send help page
                let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathsServiceHelp.html");
                let content = fs.readFileSync(helpPagePath);
                this.HttpContext.response.content("text/html", content);
            }else{
                if(this.HttpContext.path.params.op){

                    if(this.HttpContext.path.params.op === ' ') {
                        this.HttpContext.path.params.op = '+';
                    }
                    switch(this.HttpContext.path.params.op){
                        case '+':
                            if (this.checkNbParams(3) && this.getNumber('x') && this.getNumber('y')) 
                                this.params.value = this.params.x + this.params.y;
                            break;
                        case '-':
                            if (this.checkNbParams(3) && this.getNumber('x') && this.getNumber('y')) 
                            this.params.value = this.params.x - this.params.y;
                            break;
                        case '*':
                            if (this.checkNbParams(3) && this.getNumber('x') && this.getNumber('y')) 
                            this.params.value = this.params.x * this.params.y;
                            break;
                        case '/':
                            if (this.checkNbParams(3) && this.getNumber('x') && this.getNumber('y')) {
                                if(this.params.y === 0 && this.params.x === 0)
                                {
                                    this.params.value = "NaN";
                                }
                                else if(this.params.y === 0 && (this.params.x > 0 || this.params.x < 0))
                                {
                                    this.params.value = "Infinity";
                                }
                                else{
                                    this.params.value = this.params.x / this.params.y;
                                }
                            }
                            break;
                        case '%':
                            if (this.checkNbParams(3) && this.getNumber('x') && this.getNumber('y')){
                                if(this.params.y === 0)
                                {
                                    this.params.value = "NaN";
                                }else{
                                    this.params.value = this.params.x % this.params.y;
                                }
                            }
                            break;
                        case '!':
                            if (this.checkNbParams(2) && this.getNumber('n')){
                                if(this.params.n <= 0){
                                    this.params.error = "'n' parameter must be a positive integer";
                                }else{
                                    this.params.value = factorial(this.params.n);
                                }
                            }
                            break;
                        case 'p':
                            if (this.checkNbParams(2) && this.getNumber('n'))
                                this.params.value = isPrime(this.params.n);
                            break;
                        case 'np':
                            if (this.checkNbParams(2) && this.getNumber('n'))
                                this.params.value = findPrime(this.params.n);
                            break;
                        default:
                            this.sendError("parameter 'op' is missing");
                    }
                    this.HttpContext.response.JSON(this.HttpContext.path.params);
                }else{
                    this.sendError("parameter 'op' is missing");
                    this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
            }
        }
    }
    function isPrime(value) {
        let number = value;
        if (number < 0)
            number * -1;
        for(var i = 2; i < number; i++) {
            if(number % i === 0) {
                return false;
            }
        }
        return number > 1;
    }
    function findPrime(n){
        let primeNumer = 0;
        for ( let i=0; i < n; i++){
            primeNumer++;
            while (!isPrime(primeNumer)){
                primeNumer++;
            }
        }
        return primeNumer;
    }
    function factorial(n){
        if(n===0||n===1){
          return 1;
        }
        return n*factorial(n-1);
    }
    