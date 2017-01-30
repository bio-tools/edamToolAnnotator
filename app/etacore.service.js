'use strict'
angular.module('edamToolAnnotator').
service('ETACore', function(){

     /**
     * Stringify tree structure and replace null values with empty strings
     */
     function stringifyTree(jsonTree){
         return JSON.stringify(jsonTree, function(key, value) { return value == null ? "" : value });
     }


    /**
     * Helper recursive accumulator function for flattenEdamTree()
     *
     * @see flattenEdamTree()
     */
     function flattenEdamTreeAcc(jsonTree, res, path){
         var r = Math.random();
         jsonTree.random = r;
         res.push (
         {
             "random": r,
             "definition" : jsonTree.definition,
             "text": jsonTree.text,
             "narrow_synonyms": jsonTree.narrow_synonyms,
             "exact_synonyms": jsonTree.exact_synonyms,
             "data" : jsonTree.data,
             "longtext" : "Synonyms: [" + jsonTree.exact_synonyms.concat(jsonTree.narrow_synonyms).join(", ") + "]" + "<br>" + jsonTree.definition,
             "path" : path
         });

         for (var i = 0; i < jsonTree.children.length; i++){
             flattenEdamTreeAcc(jsonTree.children[i], res, path + ".children[" + i + "]");
         }

         return res;
     }


    /**
     * Creates a list of all EDAM terms in the EDAM tree
     * Also creates an extra property called longtext from the text and the synonyms, used in autocomplete
     * @param  {Object} jsonTree
     *   EDAM tree in JSON format
     * @return {Array}
     *   Returns an array of objects which describe EDAM terms
     */
     this.flattenEdamTree = function(jsonTree){
         return flattenEdamTreeAcc(jsonTree, [], "$[0]");
     }

    /**
     * Removes duplicated EDAM terms in the flat list and aggregates their different paths in the tree in a list of paths.
     * Additionally, the initial tree structure will get a flaID that points back to the same term in the array
     * so that they can be accessed from the tree
     * @param  {Array} flatJsonTree
     *   Array of objects which describe EDAM terms
     * @param  Object jsonTree
     *   EDAM tree in JSON format
     * @return {Array}
     *   Array of objects which describe EDAM terms
     */
      this.removeDuplicateTerms = function(flatJsonTree, jsonTree){

         var seen = {};
         flatJsonTree.forEach(function(entry){
             var key = entry.text + entry.data.uri;

             if (!seen.hasOwnProperty(key)){
                 seen[key] = entry;
                 seen[key].paths = [entry.path];
             }else{
                 seen[key].paths.push(entry.path);
             }
         });
         var res = [];
         Object.values(seen).forEach(function(entry, index){
             res.push(entry);
             for (var i = 0; i < entry.paths.length; i++){
                 jsonPath(jsonTree, entry.paths[i])[0].flatID = index;
             }
         });
         return res;

     }

    // remove duplicate items from array
    this.uniq_fast = function (a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }

    // given a path in a tree (jsonPath notation), create an array with the paths to the parents of the node in the initial path
    // This is used to expand all the (parent) nodes leading to the final node that we want to see / expand.
    this.getMyPaths = function (path){
        var list = path.split(".")
        if (list.length <= 1){
            return list[0];
        }
        var str = list[0];
        var ret = [list[0]];
        for (var i = 1; i < list.length; i++){
            ret.push(str + "." + list[i]);
            str = str + "." + list[i];
        }
        return ret;
    }

});