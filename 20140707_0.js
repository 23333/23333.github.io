/*修改内容: 课堂--进入某一课程的课程首页，上方作业一栏指向链接的修改*/
s0=$('[id^=homeworkTitle]')[0];
s1=$('[id^=homeworkTitle]')[1];

var s='result';
var t='detail';
s0.setAttribute('href',s0.href.replace(s,t));
s1.setAttribute('href',s1.href.replace(s,t));
