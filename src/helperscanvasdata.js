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
var graph = [];
var maxWidth = 30000;
var charts = [];
// var templateStart = '<div class="center" style="width: 150px; height: 220px; background-color: green; ">
// var templateEnd = '<img id="img-'+empNumber+'" src=""/><h4>'+name+'</h4></div>'
// var htmlToImage = require('html-to-image');
// import * as htmlToImage from 'html-to-image';
function exportChart(){
    // document.getElementsByTagName('button')[0].style.backgroundColor = 'red'
    // var xx = structuredClone(graph)
    // console.log(xx)

    var parentChain = structuredClone(graph)
    parentChain.children = [];
    exportNode(parentChain,graph.empNumber,graph.children,graph.children[0].empNumber,graph.children[graph.children.length-1].empNumber)
    // charts.forEach((chart,index)=>{
        // domtoimage.toJpeg(chart, {bgcolor: 'white'})
        //     .then(function (dataUrl) {
        //         var link = document.createElement('a');
        //         link.download = 'orgchart-'+index+'.jpeg';
        //         link.href = dataUrl;
        //         link.click();
        //         document.body.removeChild(treeHTML);
        //     });
        // html2canvas(chart).then(canvas => {
        //     saveAs(canvas.toDataURL(), 'orgchart-'+index+'.png')
        //     // document.body.removeChild(parentChain);
        // });
    // })
}

function exportNode(parentChain,empNumber, children, startChildEmpNumber, endChildEmpNumber){
    var parentChain = structuredClone(parentChain);
    var parent = parentChain;
    while(parent.children.length){
        parent = parent.children[0];
    }
    parent.children = children;
    var nodeHTML = '<ul id="expchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber+'">'+createNodeTemplate(parentChain,true)+ '</ul>';
    var treeHTML = createElementFromHTML('<div class="tf-tree" style="position: absolute; opacity: 0"></div>');
    treeHTML.innerHTML = nodeHTML;
    document.body.appendChild(treeHTML);
    var chart = document.getElementById('expchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber);
    if(chart.offsetWidth<maxWidth){ // if the node is exportable TODO::check height
        console.log(empNumber,startChildEmpNumber,endChildEmpNumber,chart.offsetWidth)
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
        // charts.push(chart)
        // setTimeout(()=>{
            domtoimage.toJpeg(chart, {bgcolor: 'white'})
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'orgchart-'+empNumber+'-s-'+startChildEmpNumber+'-e-'+endChildEmpNumber+'.jpeg';
                link.href = dataUrl;
                link.click();
                document.body.removeChild(treeHTML);
            });
        // },5000)

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
    return 'https://orgchart-123.herokuapp.com/src/small-min.jpeg';//?'+empNumber;
    // return './src/small.jpeg';
}

function createNodeTemplate(data, isExport){
    var str = '<li id="'+data.empNumber+'"><span class="tf-nc">'+getNodeTemplate(data,isExport)+'</span>';
    if(data.children.length){
        str+='<ul>';
        data.children.forEach(child=>{
            str+=createNodeTemplate(child,isExport);
        })
        str+='</ul>';
    }
    str+='</li>';
    return str;
}
function getNodeTemplate(data,isExport){
    // return '<div class="center" style="width: 150px; height: 220px; background-color: green; "><img  src="' +getImageURL(empNumber)+'"/><h4>'+name+'</h4></div>'
    // return '<div class="center" style="width: 150px; height: 220px; background-color: green; "><h4>'+data.name+'</h4><h6>'+data.jobTitle+'</h6><h6>'+data.empNumber+'</h6><h6>'+data.location+'</h6><h6>'+data.subunit+'</h6></div>';
    // return '<div class="center" style="width: 150px; height: 220px; background-color: green; "><img width="50" height="50" class="emp-image" id="img-'+data.empNumber+'" src="'+(isExport? data.image: '' )+'"/><h4>'+data.name+'</h4><h6>'+data.jobTitle+'</h6><h6>'+data.empNumber+'</h6><h6>'+data.location+'</h6><h6>'+data.subunit+'</h6></div>';
    return '<div class="center" style="width: 150px; height: 220px; background-color: green; "><img id="img-'+data.empNumber+'" src="'+(isExport? data.image: '' )+'"/><h4>'+data.name+'</h4></div>';
}

function createChartTemplate(data){
    document.getElementById('chart-container').querySelector('ul').innerHTML = createNodeTemplate(data,false);
}
window.onload = function() {
    // var graph = createNode(graphInfo, '')
    graph = structuredClone(graphInfo)
    updateGraphData(graph, [])
    
    var x = createChartTemplate(graphInfo)
    // console.log(getDataURL(getImageURL('yyyy')))
    // toDataURL();
};

function updateGraphData(data,imageData){
    var img = new Image();
    img.crossOrigin="anonymous"
    img.src = getImageURL(data.empNumber);
    img.onload = function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas)
        let ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0); 
        // const compressedDataURL = canvas.toDataURL('image/jpeg',0.1);
        const compressedDataURL = canvas.toDataURL();
        document.getElementById("img-"+data.empNumber).src = compressedDataURL;
        data.image = compressedDataURL
        document.body.removeChild(canvas)
        console.log(data.empNumber+ ' updated')
    }
    // var dataURL = 'data:image/jpeg;base64,'+imageData.find((image)=>{return image.id == data.empNumber}).image
    // document.getElementById("img-"+data.empNumber).src = dataURL;
    // data.image = dataURL
    if(data.children.length){
        data.children.forEach(child=>{
            updateGraphData(child,imageData);
        })
    }
}


function getDataURL (url){
    var img = new Image();
    img.crossOrigin="anonymous"
    img.src = url;
    img.onload = function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas)
        // let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0); 
         const dataURL = canvas.toDataURL();
        document.body.removeChild(canvas)
        return dataURL;
    }
}

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
