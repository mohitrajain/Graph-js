/**
 * Created by mohit on 6/5/16.
 */

;(function (window){

// checking for libraries required

    if(typeof jQuery !== "function"){
        console.error('jQuery Library not found. Include jQuery.js and try Again');
    }

    if(typeof Treant !== "function"){
        console.error('Treant Library not found. Include Treant.js and try Again');
    }

    if(typeof Queue !== "function"){
        console.error('Queue Library not found. Include Queue.js and try Again');
    }

// every single object in tree is referred here as a node

// variable take care of unique node no. to every node

    var node = 1;

    var plotobj;

// global object for information of node number of super node (i.e. parent of every node ) and its children (i.e.
// parents of other sub graphs)

    var global = {};

    // this function returns time of creation of node objects

    Graph.timenow = function () {
        var t = new Date();
        return t.getTime();
    };

 // global object that contains information of all the objects created

    global['global']= {
        namestring :'global',
        nodeno :0,
        crtime :Graph.timenow(),
        parentname : 'super',
        children :  [],
        nodes:0
    };

var globallen = function () {
    var k=0;
    
    for(var i in global)
      k++;
    
    return k;
};

// Graph function creates new node objects of names passed as parameter or return reference to nodes which
// already available . ( Remember each return from here ia a object which contains node objects as its properties )

    function Graph() {
        
// if Graph function called without any parameter it will return object of node objects list available till that time

       if(Array.prototype.slice.call(arguments).length == 0){
           var ab = new Graph.make('');
           ab['global'] = global['global'];
           return ab;
       }

// for the first time creation of nodes passed as parameter ( as global object is empty except 'global' node property )

        if(globallen() != 1) {

            var arr = [];
            var a =[];
 // Array.prototype.slice.call(arguments) is a dynamically created  node Object such that arguments could easily traversed

              for (var i = 0; i < Array.prototype.slice.call(arguments).length; i++) {
                    
                if(global[Array.prototype.slice.call(arguments)[i]])
                    arr.push(Array.prototype.slice.call(arguments)[i]);
                    else
                    a.push(Array.prototype.slice.call(arguments)[i]);
            }

            var obj = new Graph.make(Array.prototype.slice.call(a));

            for(i = 0 ; i< arr.length; i++)
                obj[arr[i]]=global[arr[i]];

            return obj;

        }
        
        else {
            
            return new Graph.make(Array.prototype.slice.call(arguments));
            
        }

    }
    
// Graph.make function actually creates an ( object of ( nodes object ) ) ( i.e. ' this ') , after being called by Graph
// also these created node objects are being referenced to the global object , means only one copy is available  at a
// in memory ( i.e. in global object ) . Also methods on 'this' object ( i.e. function prototype methods ) will also 
// work on global object because every time we are creating 'this' object ( using new ) either string is empty or not
// if passed string is empty then we have empty 'this' returned from Graph.make in Graph as an object 'obj' and then
// further node objects are being added to this returned ' this ' object .( that's why method on 'this' (function
// prototype ) will also work on  every returned object by Graph )

     Graph.make = function (string){

         var o;
         
         for( var i = 0 ; i <string.length ; i++) {

             o = {
                 namestring:string[i],
                 nodeno :node++,
                 crtime : Graph.timenow(),
                 parentname : 'global',
                 children : [],
                 dataobj : {
                            parent :'',
                            text : { name:string[i] }
                            }
             };
                      
            this[string[i]] = o;
             
             global[string[i]] = o;
             global['global'].nodes++;

             var a = new Graph.make('');
             a['global'] = global['global'];
             a.addchildren(o.namestring);
         }
    };

 // Graph.calheight will return height of node passed as a parameter
 Graph.calheight = function (q) {
     
     var l=1;
     var h;
     
     for(var i in global[q].children){
       h = 1 + Graph.calheight(global[q].children[i]);
         if(h>l)
            l=h; 
    }

    return l;
 };


// returns a first object's name of the ( object of ( node objects ) ) passed as a parameter

 Graph.objname = function (a) {
    for(var i in a)
    if(global[i])
        return global[i].namestring;

};
    
    
// returns length ( no. of properties ) of object passed

Graph.thislen = function (a) {
    var k=0;
    for(j in a )
     if(global[j])
        k++;
    
    return k;     
         };
    
// this removes a node and its sub nodes ( nodes will be set to null such that it will be collected by garbage collector
// sometime later )

    Graph.clearchain = function (st) {
       
        // iteration of Graph.clearchain function to delete all the nodes
        for(var j in global[st].children)
            Graph.clearchain(global[st].children[j]);

       delete global[st];

        //console.error(global['global'].nodes);
        global['global'].nodes--;
    };

// Graph.clear node will delete node information of children nodes from dataobj of genral node ( created by Graph.make )
Graph.clearnode = function (t) {

    for(var u in global[t].dataobj.children)
        Graph.clearnode(global[t].dataobj.children[u].text.name);

    delete global[t].dataobj;

};

/*
// Graph.makedataobj to create dataobj object in each object ( deleted to deallocate memory allocated by Treant Constructor )
Graph.makedataobj = function (v) {

    for(var u in global[v].children)
    Graph.makedataobj(global[v].children[u]);

    global[v].dataobj = {
        parent:'',
        text:{ name :global[v].namestring}
    };
    
};*/

// Graph.clearchild to empty the children array in each node ( created by Treant Constructor )
Graph.clearchild = function (v) {

    for(var u in global[v].children)
        Graph.clearchild(global[v].children[u]);

   delete global[v].dataobj.children ;

}


// Graph.prototype is actually a prototype for Graph.make function which are being referenced to each other in later section
// all the objects created using Graph.make using 'new' operator will have this object as its prototype    
    
    Graph.prototype = {
        
     adata : function () {
         console.log(global);
     },

// set properties of individual nodes except Parent Property      
        
     setnode:function (f) {

         if(Graph.thislen(this) === 1) {
             for (var i in f) {
                  global[Graph.objname(this)].dataobj[i] = f[i];  
             }
         }
         else
             console.error('Please Choose one node at time to represent it as a parent');
     },   
        
// plot Graph selected by Graph using ' Treant '  Library functions 

        plot: function(parameter) {
            
 if(Graph.thislen(this) === 1) {

     if (parameter && parameter.hasOwnProperty('container')) {

//To clear the graph which is already present at our desired location

         if (plotobj) {

// For clearing children array in each node's ( created by Graph.make Constructor ) children Array 

             for(var h in global['global'].children)
             if(global[global['global'].children[h]].dataobj)
                Graph.clearchild(global['global'].children[h]);

/*
// Now creating dataobj in each object created by Graph.make ( as dataobj has been deleted in above step )
            // for(var h in global['global'].children)
              //  Graph.makedataobj(global['global'].children[h]);*/

             plotobj.destroy();
         }

// Array contains all the information Treant constructor for the possible chart configurations
// Some are all ready set to default ( note : if some Property is not given here , you can edit here )

         var a = [{
             container: parameter.container,
             rootOrientation: parameter.rootOrientation || 'NORTH',
             nodeAlign: parameter.nodeAlign || 'CENTER',
             levelSeparation: parameter.levelSeparation || 30,
             siblingSeparation: parameter.siblingSeparation || 30,
             subTeeSeparation: parameter.subTeeSeparation || 30,
             hideRootNode: parameter || hideRootNode || true,
             animateOnInit: parameter.animateOnInit || false,
             animateOnInitDelay: parameter.animateOnInitDelay || 500,
             scrollbar: parameter.scrollbar || 'native',
             padding: parameter.padding || 15,
             connectors: parameter.connectors || {type: 'step'}
         }];


         if (this['global'])
             a.push({
                 text: {name: 'global'}
             });
         else {
             a[0].hideRootNode = false;
            delete global[Graph.objname(this)].dataobj.parent;
             a.push(global[Graph.objname(this)].dataobj);

         }

         // variables used to create a array of nodes which will be used in function constructor 'Treant'

         var s;
         var Q = new Queue();
         var B = [];

         if (this['global']) {
             B.push('global');
             Q.enqueue('global');
         }
         else {
             B.push(Graph.objname(this));
             Q.enqueue(Graph.objname(this));
         }

         while (Q.getLength() > 0) {

             s = Q.dequeue();

             for (var i in global[s].children) {
                 //console.error('s = ' + s);
                 // console.error('Q = ' + Q);
                 //console.log('B = ' + B);
                 Q.enqueue(global[s].children[i]);
                 B.push(global[s].children[i]);

                 if (s === a[1].text.name){
                     global[global[s].children[i]].dataobj.parent = a[1];
                     a.push(global[global[s].children[i]].dataobj);
                 }
                 else {
                     global[global[s].children[i]].dataobj.parent = a[B.indexOf(s) + 1];
                     a.push(global[global[s].children[i]].dataobj);
                 }
             }

         }
         //console.log(a);

         plotobj = new Treant(a);

     }
     
   else 
     console.error('Please Select Container for your ploting of the Graph . After selecting container try again .');    

 }
         else 
     console.error('Please Choose one node at time to represent it as a parent');
            
        },
        
// it will return max height of the tree starting from super node

      maxheight:function () {
          if(this['global']) {

              if (Graph.thislen(this) > 1)
                  console.error('Invalid no. of nodes ( Try Again with one node at a time )');

              else
                  return Graph.calheight('global');
          }
      },
        
// height will return the height of the single node passed to it upto its last grandchild       
        
        height:function () {
            if(!this['global']){

                if (Graph.thislen(this) !== 1)
                console.error('Invalid no. of nodes ( Try Again with one node at a time )');

            else
                return Graph.calheight(Graph.objname(this));
        }
        else
            console.error('This Operation is not permitted on Global Object or node ');

        },
        
// method for removal of children passed to the function from its parent objects upon which it is being called       
        
     removechildren:function () {
         if(!this['global']){
         for(var i=0;i<arguments.length;i++){
             
    if(!global[Array.prototype.slice.call(arguments)[i]])
 console.error('No any node of name' + Array.prototype.slice.call(arguments)[i] +' exists . Try Again after creating it');
 
    else {
       var j=0;
        for(var k in this)
            if (global[k])
                if (global[k].children.indexOf(Array.prototype.slice.call(arguments)[i])>=0) {
                    j = 1;

                    var z=[];

                    for(var l in global[k].children )
                    if(global[k].children[l] !== Array.prototype.slice.call(arguments)[i])
                    z.push(global[k].children[l]);

                    global[k].children=z;

                   if(global[k] !== 'global') {
                       z=[];

                       for (var l in global[k].dataobj.children) {
                           if (global[k].dataobj.children[l].text.name !== Array.prototype.slice.call(arguments)[i])
                               z.push(global[k].dataobj.children[l]);
                       }
                       global[k].dataobj.children = z;

                   }

                    if(global[Array.prototype.slice.call(arguments)[i]].dataobj)
                    Graph.clearnode(Array.prototype.slice.call(arguments)[i]);

                    Graph.clearchain(Array.prototype.slice.call(arguments)[i]);

                }
        if(j === 0)
console.error('No any child of name ' + Array.prototype.slice.call(arguments)[i] +' exists in any of the choosen parents');
        
    }         
             
         }
         }
             
         else
        console.error('This Operation is not permitted on Global Object or node ');     
         
     },

  // method for removal of node objects

        remove: function () {
            if(!this['global']) {
                for (var i in this)
                    if (global[i]) {

                        var z = [];
                        for (var j in global[global[i].parentname].children) {
                            if (global[global[i].parentname].children[j] !== global[i].namestring)
                                z.push(global[global[i].parentname].children[j]);
                        }

                        //console.log(global[i].namestring);
                        //console.log(z);
                        global[global[i].parentname].children = z;

                        if(global[i].parentname !== 'global') {
                            z = [];
                            for (var j in global[global[i].parentname].dataobj.children) {
                                if (global[global[i].parentname].dataobj.children[j].text.name !== global[i].namestring) {
                                    z.push(global[global[i].parentname].dataobj.children[j]);
                                }
                            }

                            global[global[i].parentname].dataobj.children = z;
                        }

                        if(global[global[i].namestring].dataobj){
                            Graph.clearnode(global[i].namestring);
                        }

                        Graph.clearchain(global[i].namestring);
                    }

            }
                    else
                console.error('This Operation is not permitted on Global Object or node ');

        },

// method for showing information of individual or a group of node objects

        showdata: function () {
            if(!this['global']) {
                for (var i in this)
                    if (global[i])
                        console.error(this[i]);
            }
            else
                console.error('This Operation is not permitted on Global Object or node ');
            },
        
// method for changing parent of selected nodes
        
        setparent : function () {
            if(!this['global']) {

                if (arguments.length > 1)
                    console.error('more than one parent to single child is not allowed');

                else if (!global[arguments[0]])
                    console.error(arguments[0] + ' Does not exist in node list . Try again after Creating it ');
                else {
                    for (var i in this)
                        if (global[i]) {
                            if (global[i].namestring !== arguments[0]) {
                                var z =[];
                                for( var x in global[global[i].parentname].children){
                                    if(global[global[i].parentname].children[x] !== global[i].namestring)
                                        z.push(global[global[i].parentname].children[x]);
                                }
                                global[global[i].parentname].children = z;
                                global[i].parentname = arguments[0];
                                global[arguments[0]].children.push(global[i].namestring);
                            }
                            else
                                console.error('for ' + global[i].namestring + ' this operation is invalid');
                        }
                }

                return this;
            }
            else
                console.error('This Operation is not permitted on Global Object or node ');
        },

// method for adding children to the selected nodes
        
        addchildren : function () {
            
                if (Graph.thislen(this) > 1) {
                    console.error('more than one parent to single child is not allowed');
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {

                        if (!global[Array.prototype.slice.call(arguments)[i]])
                            console.error(Array.prototype.slice.call(arguments)[i] + ' Does not exist in node list');

                        else if (this[Graph.objname(this)].namestring === Array.prototype.slice.call(arguments)[i])
                            console.error('for ' + Array.prototype.slice.call(arguments)[i] + ' this operation is invalid ');

                        else if (global[Array.prototype.slice.call(arguments)[i]]) {

                                if(global[global[Array.prototype.slice.call(arguments)[i]].parentname].children.indexOf(Array.prototype.slice.call(arguments)[i]) > -1) {

                                    var z = [];

                                    for(var y in global[global[Array.prototype.slice.call(arguments)[i]].parentname].children )
                                    if(Array.prototype.slice.call(arguments)[i] !== global[global[Array.prototype.slice.call(arguments)[i]].parentname].children[y])
                                        z.push(global[global[Array.prototype.slice.call(arguments)[i]].parentname].children[y]);

                                    global[global[Array.prototype.slice.call(arguments)[i]].parentname].children = z;
                                }

                            global[Array.prototype.slice.call(arguments)[i]].parentname = this[Graph.objname(this)].namestring;

                            this[Graph.objname(this)].children.push(Array.prototype.slice.call(arguments)[i]);

                            //if(Graph.objname(this) !== 'global')
                            //global['global'].children.pop(Array.prototype.slice.call(arguments)[i]);
                        }
                    }

                }

                return this;


        }
        
    };
    
 // this statement sets prototype of Graph.make function equal to prototype of Graph function
 // although prototype of Graph doesn't do any work in creating any objects its just a collection
    // of all the methods used with nodes object

    Graph.make.prototype = Graph.prototype;

// attaching our Graph function to window object passed to our IIFE function

    window.Graph = Graph;

// passing window object and jQuery function to our IIFE function

}(window));
