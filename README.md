# Graph-js
A simple library to create a tree on the fly and can dynamically modify the tree .

It uses Treant.js to draw the branches of the tree and other stuff.
It is just an extension to treant js in which modification of tree is dynamic ( no need to take care for new objects for each modification ) .

here is a sample script 

```
Graph('A','B','C','D','E','F','G');
Graph('A').addchildren('B','C','D');
Graph('B').addchildren('F','E','G');
Graph('H').setparent('F');
Graph('L').setparent('H');
//Graph().maxheight();
Graph('A').setnode({
    text:{ name:"Mohit" }
});
Graph().plot({
    container:"#OrganiseChart-simple"});
Graph().adata();

```

<img src="https://raw.githubusercontent.com/mohitrajain/Graph-js/master/graphjs.png"></img>
