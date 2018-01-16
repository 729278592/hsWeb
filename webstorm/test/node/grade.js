/**
 * Created by Hongbo_Wang on 2018/1/12.
 */
var klass = require("./klass");

function add(klasses) {
    klasses.forEach(function (item,index) {
        var tecName = item.teName;
        var student = item.student;
        klass.add(tecName,student,index);
    });
}
exports.add = add;