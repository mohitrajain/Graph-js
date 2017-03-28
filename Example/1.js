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
