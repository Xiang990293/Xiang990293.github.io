//自定義模塊
function add(num1, num2){
    return num1 + num2;
}

//對外暴露
module.exports.add = add;

// //同上
// exports.add = add;
// //同上
// module.exports = {
//     add: add,
// }
// //同上
// module.exports = {
//     add,
// }