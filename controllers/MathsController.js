const path = require('path');
const fs = require('fs');
module.exports = 
    class MathsController extends require('./Controller'){
        constructor(HttpContext){
            super(HttpContext);
        }
        sendError(errorMessage){
            this.HttpContext.path.params.error = errorMessage();
        }
        get(){
            if(this.HttpContext.path.queryString == '?'){
                // Send help page
                let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathsServiceHelp.html");
                let content = fs.readFileSync(helpPagePath);
                this.HttpContext.response.content("text/html", content);
            }else{
                if(this.HttpContext.path.params.op){
                    if(this.HttpContext.path.params.op === ' '){
                        this.HttpContext.path.params.op = '+'
                    }
                    switch(this.HttpContext.path.params.op){
                        case '+':
                            this.checkParams(3)
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) + parseInt(this.HttpContext.path.params.y);
                            console.log(parseInt(this.HttpContext.path.params.x));
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case '-':
                            this.checkParams(3)
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) - parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case '*':
                            this.checkParams(3)
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) * parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case '/':
                            this.checkParams(3)
                            if(parseInt(this.HttpContext.path.params.y) === 0 && parseInt(this.HttpContext.path.params.x) === 0)
                            {
                                this.HttpContext.path.params.value = "NaN";
                            }
                            else if(parseInt(this.HttpContext.path.params.y) === 0 && (parseInt(this.HttpContext.path.params.x) > 0 || parseInt(this.HttpContext.path.params.x) < 0))
                            {
                                this.HttpContext.path.params.value = "Infinity";
                            }
                            else{
                                this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) / parseInt(this.HttpContext.path.params.y);
                            }
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case '%':
                            this.checkParams(3)
                            if(parseInt(this.HttpContext.path.params.y) === 0)
                            {
                                this.HttpContext.path.params.value = "NaN";
                            }else{
                                this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) % parseInt(this.HttpContext.path.params.y);
                            }
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case '!':
                            this.checkParams(2)
                            if(parseInt(this.HttpContext.path.params.n) <= 0){
                                this.HttpContext.path.params.error = "'n' parameter must be a positive integer";
                            }else{
                                this.HttpContext.path.params.value = factorial(parseInt(this.HttpContext.path.params.n));
                            }
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case 'p':
                            this.checkParams(2)
                            this.HttpContext.path.params.value = isPrime(parseInt(this.HttpContext.path.params.n));
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        case 'np':
                            this.checkParams(2)
                            this.HttpContext.path.params.value = findPrime(parseInt(this.HttpContext.path.params.n));
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        default:
                            this.HttpContext.path.params.error = "parameter 'op' is missing";
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                    }
                }else{
                    this.HttpContext.path.params.error = "parameter 'op' is missing";
                    this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
            }
        }
        checkParams(nbParams){
            if(Object.keys(this.HttpContext.path.params).length > nbParams){
                this.sendError("Too many parameters");
            }
            return true;
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
    