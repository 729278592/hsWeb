
var student = require("./student");
var teacher = require("./teacher");


function add(teName,stuName,i) {
    teName.forEach(function (item,index){
        teacher.add(item,index,i);
    });
    stuName.forEach(function (item,index){
        student.add(item,index,i);
    });
}

exports.add = add;