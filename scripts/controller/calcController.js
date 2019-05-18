class calcController{

    constructor(){
        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");

        this.initialize();
        this.initButtonsEvents();
      //  this.initKeyboard();
    }

    initialize(){

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        /* setTimeout(() => {

             clearInterval(interval);
            
         }, 10000);*/
    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll(".btn");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "click|drag", e => {

                let textBtn = btn.innerHTML;

                this.execBtn(textBtn);
    
            });

        });
    }

    addEventListenerAll(element, events, fn){

        events.split("|").forEach(event => {

            element.addEventListener(event, fn, false);

        });
    }

    copyToClipboard(){

        let input = document.createElement("input");

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    pasteFromClipboard(){

        document.addEventListener(`paste`, e =>{

            let text = e.clipboardData.getData("Text");

            this.displayCalc = parseFloat(text);

            console.log(text);

        });

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this._lastNumber = lastNumber;

        this.displayCalc = lastNumber;

    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length - 1; i >= 0; i-- ){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
   
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    isOperator(value){

        console.log(`isOperator value: ${value}`);

        return  (["+","-","*","%","/"].indexOf(value) > -1);
    }

    execBtn(value){
console.log(this._operation);
        switch(value){

            case "C":
                this.clearAll();
                break;

            case "CE":
                this.clearEntry();
                break;

            case "+":
                this.addOperation("+");
                break;

            case "-":
                this.addOperation("-");
                break;

            case "÷":
                this.addOperation("/");
                break;

            case "X":
                this.addOperation("*");
                break;

            case "%":
                this.addOperation("%");
                break;

            case "=":
                 this.calc();
                break;

            case ",":
                this.addDot();
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            case "←":
                this.ereaseLastNumber();
                break;

            case "¹/x":
                this.divideBy();
            default:
                this.setError();
                break;
        }
    }

    divideBy(){

    }
    
    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation("0.");

        }else{

            this.setLastOperation(lastOperation.toString() + ".");

        }

        this.setLastNumberToDisplay();

    }

    clearAll(){

        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";

        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    ereaseLastNumber()
    {
        let lastOperation = this.getLastOperation();

        if(!this.isOperator(lastOperation)){

            this._lastNumber = this._lastNumber.toString().slice(0, -1);

            this.setLastOperation(this._lastNumber);

            this.setLastNumberToDisplay();
        }
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){
            //string

            if(this.isOperator(value)){

                this.setLastOperation(value);

            }else{

                this.pushOperation(value);
                this.setLastNumberToDisplay();

            }

        }else {
            //number
            if(this.isOperator(value))
            {
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }
        }
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }

    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    getResult(){

        try{

            return eval(this._operation.join(""));

        }catch(e){

            setTimeout(() => {
                this.setError();
            }, 1);

        }
    }

    setError(){
        this.displayCalc = "Error";
    }

    calc(){

        let last = "";
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber =  this.getResult();

        } else if(this._operation.length == 3){

            this._lastNumber =  this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == "%"){

            result /= 100;

            this._operation = [result];

        }else{
            
            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

}