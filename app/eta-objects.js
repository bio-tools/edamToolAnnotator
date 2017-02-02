// EDAMTerm object
// basic term and uri object used in annotations
function EDAMTerm (term, uri){
    this.term = term;
    this.uri = uri;
}

EDAMTerm.prototype.fromObj = function(obj){
    this.term = obj.term;
    this.uri = obj.uri;
    return this;
}
EDAMTerm.prototype.getAsObj = function(){
    return this;
}

EDAMTerm.prototype.getTermAsObj = function(){
    return {"term":this.term};
}

EDAMTerm.prototype.getUriAsObj = function(){
    return {"uri":this.uri};
}

EDAMTerm.prototype.getAsArray = function(){
    return [this];
}

EDAMTerm.prototype.getTerm = function(){
    return this.term;
}

EDAMTerm.prototype.getUri = function(){
    return this.uri;
}

EDAMTerm.prototype.getStringify = function(){
    return JSON.stringify(this);
}

EDAMTerm.prototype.setTerm = function(term){
    this.term = term;
    return this;
}

EDAMTerm.prototype.setUri = function(uri){
    this.uri = uri;
    return this;
}

EDAMTerm.prototype.unset = function(){
    delete this.term;
    delete this.uri
    return this;
}

EDAMTerm.prototype.isSet = function(){
    return (this.hasOwnProperty("uri") && (typeof this.uri === 'string' || this.uri instanceof String) &&
        this.hasOwnProperty("term") && (typeof this.term === 'string' || this.term instanceof String)
        );
}

//EDAMTermArray object,
// an array of EDAMTerms

function EDAMTermArray(arrayOfEDAMTerms){
    this.terms = arrayOfEDAMTerms;
}

EDAMTermArray.prototype.fromArray = function(arr){
    this.terms = [];
    for (var i = 0; i < arr.length; i++ ){
        if (arr[i] instanceof Object && arr[i].hasOwnProperty("term") && arr[i].hasOwnProperty("uri") && arr[i].term instanceof String && arr[i].uri instanceof String){
            var t = new EDAMTerm(arr[i].term, arr[i].uri);
            this.addTermNoDuplicates(t);
        }
    }
    return this;
}

EDAMTermArray.prototype.getAsArray = function(){
    return this.terms;
}

EDAMTermArray.prototype.getAsObj = function(){
    return this;
}

EDAMTermArray.prototype.getAtIndex = function(index){
    return this.terms[index];
}

EDAMTermArray.prototype.getStringifyObj = function(){
    return JSON.stringify(this);
}

EDAMTermArray.prototype.getStringifyArray = function(){
    return JSON.stringify(this.terms);
}

EDAMTermArray.prototype.addTerm = function(edamTerm){
    this.terms.push(edamTerm);
}

EDAMTermArray.prototype.addTermNoDuplicates = function(edamTerm){
    for (var i = 0; i < this.terms.length; i++){
        if (edamTerm.getUri() === this.terms[i].getUri()){
            // return false if object already exists found
            return false;
        }
    }
    this.terms.push(edamTerm);
    return this;
}

EDAMTermArray.prototype.removeAtIndex = function(index){
    this.terms.splice(index,1);
}

/* obj is well formed JSON object with properties:
    "function": array of {"operation","input","output" and "comment"} objects
        "operation": array of objects with "term" and "uri" properties, can be empty, can be missing
    "input": array of "data" and "format" {"data", "format"} objects
            "data": object with "term" and "uri" properties, can be missing, cannot be empty if present
            "format": array of objects with "term" and "uri" properties, can be empty, can be missing, cannot be present in the absence of "data"
        "output": array of "data" and "format" , same as input
        "comment": string of characters , representing the user comment to the function
*/
function ETAFunctions(obj){
    "use strict";
    // CODE MAINLY FOR THE PURPOSE OF CHECKING IF obj IS WELL FORMED
    // SECONDARY TO TRANSFORM SOME OBJECT PARTS INTO DEFINED OBJECTS SO WE CAN USE THEIR MEMBER FUNCTIONS

    try {
        JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return this;
    }
    if (!obj.hasOwnProperty("function")){
        return this;
    }
    if (obj.function.constructor !== Array){
        return this;
    }else if (obj.function.length > 0){
        this.function = [];
    }

    for (var i = 0; i < obj.function.length; i++){
        var f = obj.function[i];
        this.function.push(new ETAFunction(f));
    }
}


ETAFunctions.prototype.getFunctions = function(){
    return this.function;
}

ETAFunctions.prototype.setFunctionsFromObj = function(obj){
    this.function = [{}];

    try {
        JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return this;
    }
    if (!obj.hasOwnProperty("function")){
        return this;
    }
    if (obj.function.constructor !== Array){
        return this;
    }else if (obj.function.length > 0){
        this.function = [];
    }

    for (var i = 0; i < obj.function.length; i++){
        var f = obj.function[i];
        this.function.push(new ETAFunction(f));
    }
}

ETAFunctions.prototype.setFunctionsFromArray = function(array){
    return this.setFunctionsFromObj({
        "function" : array
    });
}

ETAFunctions.prototype.hasFunctions = function(){
    return this.function.length > 0;
}

ETAFunctions.prototype.isWellDefined = function(){
    return (this.hasOwnProperty("function") && this.function.constructor === Array);
}

ETAFunctions.prototype.noOfFunctions = function(){
    return this.function.length;
}

ETAFunctions.prototype.addFunction = function(obj){
    this.function.push(new ETAFunction(obj));
    return this;
}

ETAFunctions.prototype.createFunction = function(){
   if (!this.isWellDefined()){
       this.function = [];
   }

   this.function.push(new ETAFunction({}));
   return this;
}


ETAFunctions.prototype.removeFunctionAtIndex = function(index){
    this.function.splice(index,1);
    if (this.function.length === 0){
        delete this.function;
    }
}




//////////////
// ETAFunction

function ETAFunction(obj){
    //operations
    //this.operation = [];
    if (obj.hasOwnProperty("operation") && obj.operation.constructor === Array){
        //operation
        this.operation = [];
        for (var i = 0; i < obj.operation.length; i++){
            var op = obj.operation[i];
            if (op.hasOwnProperty("term") && op.hasOwnProperty("uri")){
                this.operation.push(new EDAMTerm(op.term,op.uri));
            }
        }
    }

    //inputs
    //this.input = [];
    if (obj.hasOwnProperty("input") && obj.input.constructor === Array){
        //input
        this.input = [];
        for (var i = 0; i < obj.input.length; i++){
            var io = obj.input[i];
            this.input.push (new ETAIO(io));
        }
    }

    //outputs
    //this.output = [];
    if (obj.hasOwnProperty("output") && obj.output.constructor === Array){
        //output
        this.output = [];
        for (var i = 0; i < obj.output.length; i++){
            var io = obj.output[i];
            this.output.push (new ETAIO(io));
        }
    }

    //comment
    //this.comment = "";
    if (obj.hasOwnProperty("comment") && (typeof obj.comment === 'string' || obj.comment instanceof String)){
        this.comment = obj.comment;
    }
}

// getter and setter for comment
ETAFunction.prototype.getComment = function(){
    return this.comment;
}

ETAFunction.prototype.setComment = function(c){
    this.comment = c;
    return this;
}

// simple getters for operation, input and output

ETAFunction.prototype.getOperations = function(){
    return this.operation;
}

ETAFunction.prototype.getInputs = function(){
    return this.input;
}

ETAFunction.prototype.getOutputs = function(){
    return this.output;
}

// setters for operation, input and output

ETAFunction.prototype.setOperationsFromObj = function(obj){
    this.operation = [];
    if (obj.hasOwnProperty("operation") && obj.operation.constructor === Array){
        //operation
        for (var i = 0; i < obj.operation.length; i++){
            var op = obj.operation[i];
            if (op.hasOwnProperty("term") && op.hasOwnProperty("uri")){
                this.operation.push(new EDAMTerm(op.term,op.uri));
            }
        }
    }
    return this;
}

ETAFunction.prototype.setInputsFromObj = function(obj){
    this.input = [];
    if (obj.hasOwnProperty("input") && obj.input.constructor === Array){
        //input
        for (var i = 0; i < obj.input.length; i++){
            var io = obj.input[i];
            this.input.push (new ETAIO(io));
        }
    }
    return this;
}

ETAFunction.prototype.setOutputsFromObj = function(obj){
    this.output = [];
    if (obj.hasOwnProperty("output") && obj.output.constructor === Array){
        //output
        for (var i = 0; i < obj.output.length; i++){
            var io = obj.output[i];
            this.output.push (new ETAIO(io));
        }
    }
    return this;
}

ETAFunction.prototype.setOperationsFromArray = function(array){
    return this.setOperationsFromObj({
        "operation" : array
    });
}

ETAFunction.prototype.setInputsFromArray = function(array){
    return this.setInputsFromObj({
        "input" : array
    });
}

ETAFunction.prototype.setOutputsFromArray = function(array){
    return this.setOutputFromObj({
        "output" : array
    });
}

// operationArray is an array of well formed EDAMTerm objects
ETAFunction.prototype.setEDAMOperations = function(operationArray){
    this.operation = formatArray;
    return this;
}

// inputArray is an array of well formed ETAIO objects
ETAFunction.prototype.setInputs = function(inputArray){
    this.input = inputArray;
    return this;
}

// outputArray is an array of well formed ETAIO objects
ETAFunction.prototype.setOutputs = function(outputArray){
    this.output = outputArray;
    return this;
}

// get operation, input and output at index
ETAFunction.prototype.getOperationAtIndex = function(index){
    return this.operation[index];
}

ETAFunction.prototype.getInputAtIndex = function(index){
    return this.input[index];
}

ETAFunction.prototype.getOutputAtIndex = function(index){
    return this.ouput[index];
}

// add operations , inputs and outputs

//operationTerm is well formed EDAMTerm object
ETAFunction.prototype.addEDAMOperationTerm = function(operationTerm){
    this.operation.push(operationTerm);
    return this;
}

//inp is well formed ETAIO object
ETAFunction.prototype.addInput = function(inp){
    this.input.push(inp);
    return this;
}

//out is well formed ETAIO object
ETAFunction.prototype.addInput = function(out){
    this.output.push(out);
    return this;
}

// obj is well formed structure with term and uri string properties
ETAFunction.prototype.addOperationObj = function(obj){
    this.operation.push(new EDAMTerm(obj.term,obj.uri));
    return this;
}

ETAFunction.prototype.addInputObj = function(obj){
    this.input.push(new ETAIO(obj));
    return this;
}

ETAFunction.prototype.addOutputObj = function(obj){
    this.ouput.push(new ETAIO(obj));
    return this;
}

ETAFunction.prototype.createOperation = function(){
   this.operation = [];
}

ETAFunction.prototype.createInput = function(){
   if (!this.isInputWellDefined()){
       this.input = [];
   }
   this.input.push(new ETAIO({}));
}

ETAFunction.prototype.createOutput = function(){
   if (!this.isOutputWellDefined()){
       this.output = [];
   }
   this.output.push(new ETAIO({}));
}

ETAFunction.prototype.createComment = function(){
   this.comment = "";
}

ETAFunction.prototype.clearOperations = function(){
    this.operation = [];
    delete this.operation;
    return this;
}

ETAFunction.prototype.removeOperationAtIndex = function(index){
    this.operation.splice(index,1);
    return this;
}

ETAFunction.prototype.removeInputAtIndex = function(index){
    this.input.splice(index,1);
    if (this.input.length === 0){
        delete this.input;
    }
    return this;
}

ETAFunction.prototype.removeOutputAtIndex = function(index){
    this.output.splice(index,1);
    if (this.output.length === 0){
        delete this.output;
    }
    return this;
}

ETAFunction.prototype.hasOperationProperty = function(){
    return (this.hasOwnProperty("operation") && this.operation.constructor === Array);
}

ETAFunction.prototype.hasCommentProperty = function(){
    return (this.hasOwnProperty("comment") && (typeof this.comment === 'string' || this.comment instanceof String));
}

ETAFunction.prototype.isInputWellDefined = function(){
    return (this.hasOwnProperty("input") && this.input.constructor === Array);
}

ETAFunction.prototype.isOutputWellDefined = function(){
    return (this.hasOwnProperty("output") && this.output.constructor === Array);
}

ETAFunction.prototype.hasInputs = function(){
    return this.input.length > 0;
}

ETAFunction.prototype.hasOutputs = function(){
    return this.output.length > 0;
}

ETAFunction.prototype.addOperationTermNoDuplicates = function(edamTerm){
    for (var i = 0; i < this.operation.length; i++){
        if (edamTerm.getUri() === this.operation[i].getUri()){
            // return false if object already exists found
            return false;
        }
    }
    this.operation.push(edamTerm);
    return this;
}

ETAFunction.prototype.addOperationObjNoDuplicates = function(obj){
    for (var i = 0; i < this.operation.length; i++){
        if (obj.uri === this.operation[i].getUri()){
            // return false if object already exists found
            return false;
        }
    }
    this.operation.push(new EDAMTerm(obj.term,obj.uri));
    return this;
}



// ETAIO
function ETAIO(obj){
    //data
    if (obj.hasOwnProperty("data") && obj.data.hasOwnProperty("term") && obj.data.hasOwnProperty("uri")){
        this.data = new EDAMTerm(obj.data.term,obj.data.uri);
    }else{
        this.data = {};
    }

    // formats

    if (obj.hasOwnProperty("format") && obj.format.constructor === Array){
        //format
        this.format = [];
        for (var i = 0; i < obj.format.length; i++){
            var f = obj.format[i];
            if (f.hasOwnProperty("term") && f.hasOwnProperty("uri")){
                this.format.push(new EDAMTerm(f.term,f.uri));
            }
        }
    }
}


ETAIO.prototype.getData = function(){
    return this.data;
}

ETAIO.prototype.getFormats = function(){
    return this.format;
}


//obj is well formed term object
ETAIO.prototype.setDataFromObj = function(obj){
    if (obj.hasOwnProperty("data") && obj.data.hasOwnProperty("term") && obj.data.hasOwnProperty("uri")){
        this.data = new EDAMTerm(obj.data.term,obj.data.uri);
    }else{
        this.data = {};
    }
    return this;
}


//obj is well formed array of terms
ETAIO.prototype.setFormatsFromObj = function(obj){
    this.format = [];
    if (obj.hasOwnProperty("format") && obj.format.constructor === Array){
        //format
        for (var i = 0; i < obj.format.length; i++){
            var f = obj.format[i];
            if (f.hasOwnProperty("term") && f.hasOwnProperty("uri")){
                this.format.push(new EDAMTerm(f.term,f.uri));
            }
        }
    }
    return this;
}

ETAIO.prototype.setFormatsFromArray = function(array){
    return this.setFormatFromObj({
        "format" : array
    });
}

//edamTerm is EDAMTerm object
ETAIO.prototype.setDataFromTerm = function(edamTerm){
    this.data = edamTerm;
    return this;
}

ETAIO.prototype.setDataFromTermObj = function(obj){
    if (obj.hasOwnProperty("term") && obj.hasOwnProperty("uri")){
        return this.setDataFromTerm(new EDAMTerm(obj.term,obj.uri));
    }
    this.data = {};
    return this;

}

// formatArray is an array of well formed EDAMTerm objects
ETAIO.prototype.setEDAMFormats = function(formatArray){
    this.format = formatArray;
    return this;
}


ETAIO.prototype.getFormatAtIndex = function(index){
    return this.format[index];
}

ETAIO.prototype.addEDAMFormatTerm = function(formatTerm){
    this.format.push(formatTerm);
    return this;
}

ETAIO.prototype.addFormatObj = function(obj){
    this.format.push(new EDAMTerm(obj.term,obj.uri));
    return this;
}


ETAIO.prototype.addFormatTermNoDuplicates = function(edamTerm){
    for (var i = 0; i < this.format.length; i++){
        if (edamTerm.getUri() === this.format[i].getUri()){
            // return false if object already exists found
            return false;
        }
    }
    this.format.push(edamTerm);
    return this;
}

ETAIO.prototype.addFormatObjNoDuplicates = function(obj){
    for (var i = 0; i < this.format.length; i++){
        if (obj.uri === this.format[i].getUri()){
            // return false if object already exists found
            return false;
        }
    }
    this.format.push(new EDAMTerm(obj.term,obj.uri));
    return this;
}


ETAIO.prototype.removeFormatAtIndex = function(index){
    this.format.splice(index,1);
    return this;
}

ETAIO.prototype.clearFormats = function(){
    this.format = [];
    delete this.format;
    return this;
}

ETAIO.prototype.clearData = function(){
    this.data = {};
    delete this.data;
    return this;
}


ETAIO.prototype.isDataWellFormed = function(){
    if (this.hasOwnProperty("data") && this.data.hasOwnProperty("term") && this.data.hasOwnProperty("uri"));
}

ETAIO.prototype.hasData = function(){
    for(var prop in this.data) {
        if(this.data.hasOwnProperty(prop)){
            return true;
        }
    }

    return JSON.stringify(this.data) !== JSON.stringify({});
}

ETAIO.prototype.hasDataProperty = function(){
    return (this.hasOwnProperty("data"));
}

ETAIO.prototype.createData = function(){
    this.data = {};
}

ETAIO.prototype.createFormat = function(){
   this.format = [];
}


ETAIO.prototype.hasFormatProperty = function(){
    return (this.hasOwnProperty("format") && this.format.constructor === Array);
}


ETAIO.prototype.hasFormat = function(){
    return this.format.length > 0;
}

