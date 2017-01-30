'use strict';
angular.module('edamToolAnnotator').
service('FuseSearch', function(){
    // hardcode the options for now, perhaps send them in later
    //
    //  Should support any combination of keys: e.g. just text; text and definition, etc
    //  A good place to start is to have text, exact and narrow synonyms as keys but not definition
    //  The user can then tick/mark/select definition as a match, so it becomes a key

    //"sweet spot" for fuse options
    this.search = function(str, edamFlatTree){
        var options = {
            threshold: 0.2,
            shouldSort: true,
            location: 0,
            tokenize: true,
            matchAllTokens: true,
            keys: ["text","exact_synonyms","narrow_synonyms","definition"]

        };

        var fuse = new Fuse(edamFlatTree, options);
        return (fuse.search(str));

    }
});