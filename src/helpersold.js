class Employee {
    constructor(empNumber, name, parent) {
        this.empNumber = empNumber
        this.name = name;
        this.parent = parent;
    }
    empNumber;
    name;
    parent;
    children;
}
var maxWidth = 30000;
// var htmlToImage = require('html-to-image');
// import * as htmlToImage from 'html-to-image';
function exportChart(){
    document.getElementsByTagName('button')[0].style.backgroundColor = 'red'
    var parentChain = structuredClone(graphInfo)
    parentChain.children = [];
    exportNode(parentChain,graphInfo.empNumber,graphInfo.children,graphInfo.children[0].empNumber,graphInfo.children[graphInfo.children.length-1].empNumber)
}

function exportNode(parentChain,empNumber, children, startChildEmpNumber, endChildEmpNumber){
    var parentChain = structuredClone(parentChain);
    var parent = parentChain;
    while(parent.children.length){
        parent = parent.children[0];
    }
    parent.children = children;
    var nodeHTML = '<ul id="expchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber+'">'+createNodeTemplate(parentChain)+ '</ul>';
    var treeHTML = createElementFromHTML('<div class="tf-tree" style="position: absolute; opacity: 0"></div>');
    treeHTML.innerHTML = nodeHTML;
    document.body.appendChild(treeHTML);
    var chart = document.getElementById('expchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber);
    if(chart.offsetWidth<maxWidth){ // if the node is exportable TODO::check height
        // htmlToImage.toPng(chart)
        //     .then(function (dataUrl) {
        //         download(dataUrl, 'my-node.png');
        //     });
        // htmlToImage.toJpeg(chart, {backgroundColor: 'white'})
        //     .then(function (dataUrl) {
        //       var link = document.createElement('a');
        //         link.download = 'orgchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber+'.jpeg';

        //       link.href = dataUrl;
        //       link.click();
        //     });
        setTimeout(()=>{
            domtoimage.toJpeg(chart, {bgcolor: 'white'})
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'orgchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber+'.jpeg';
                link.href = dataUrl;
                link.click();
                document.body.removeChild(treeHTML);
            });
        },2000)

    }
    else{
        parent.children = []; // to update parentChain
        document.body.removeChild(treeHTML);
        if(children.length ==1){
            // add direct child to parentChain
            var nextParentChildren = children[0].children
            children[0].children = [] // remove children of the direct child
            parentChain.children.push(children[0]) // add next parent to the parentChain
            exportNode(parentChain,children[0].empNumber, nextParentChildren, nextParentChildren[0].empNumber, nextParentChildren[nextParentChildren.length-1].empNumber)
        }
            else {
            var leftChildren = children.slice(0,children.length/2);
            var rightChildren = children.slice(children.length/2, children.length);
            exportNode(parentChain,empNumber,leftChildren, leftChildren[0].empNumber, leftChildren[leftChildren.length-1].empNumber)
            exportNode(parentChain,empNumber,rightChildren, rightChildren[0].empNumber, rightChildren[rightChildren.length-1].empNumber)
        }
    }
}

function getImageURL(empNumber){
    return 'https://orgchart-123.herokuapp.com/src/small.jpeg?'+empNumber;
}

function getNodeTemplate(empNumber, name){
    return '<div class="center" style="width: 150px; height: 220px; background-color: green; "><img  src="' +getImageURL(empNumber) +'"/><h4>'+name+'</h4></div>'
}

function createNodeTemplate(data){
    var str = '<li id="'+data.empNumber+'"><span class="tf-nc">'+getNodeTemplate(data.empNumber, data.name)+'</span>';
    if(data.children.length){
        str+='<ul>';
        data.children.forEach(child=>{
            str+=createNodeTemplate(child);
        })
        str+='</ul>';
    }
    str+='</li>';
    return str;
}
function createChartTemplate(data){
    document.getElementById('chart-container').querySelector('ul').innerHTML = createNodeTemplate(data);
}
window.onload = function() {
    // var graph = createNode(graphInfo, '')
    var graph = createChartTemplate(graphInfo)
};
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
function saveAs(uri, filename) {
    var link = document.createElement('a')
    if (typeof link.download === 'string') {
        link.href = uri
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } else {
        window.open(uri)
    }
}