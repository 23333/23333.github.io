/*修改内容: 网络学堂首页日历增加作业ddl提醒*/


$('[style$="0px;"]').attr("style","position:relative");

var a=null;
var semester="2013-2014-3";
$.get(
	"/b/myCourse/courseList/loadCourse4Student/"+semester,
	function(courseListMap){a=courseListMap.resultList;getHw(a);}//a:courses
);
function getHw(a)
{
	for (i in a) 
	{ 
		//console.log("i"+i);
		if (isNaN(i)) return;
		var courseId=a[i].course_id;//string,'2013-2014-3-44100343-0';
		//get homework
		var h=null;
		
		$.get(
		"/b/myCourse/homework/list4Student/"+courseId+'/0',
		function(resp){h=resp.resultList;addHw(h);}//h:homework of a course
		)
		//console.log(i+'i');
	}
}

function addHw(h)
{
//console.log(h);
	for (j in h)
	{
		if (isNaN(j)) return;
		//new Date(h[j].courseHomeworkInfo.beginDate).format("yyyy-MM-dd hh:mm")
		//new Date(h[j].courseHomeworkInfo.endDate).format("yyyy-MM-dd hh:mm")
		//console.log(i+"j"+j);
		var beginMonth=new Date(h[j].courseHomeworkInfo.beginDate).getMonth()+1;
		var beginDay=new Date(h[j].courseHomeworkInfo.beginDate).getDate();
		var endMonth=new Date(h[j].courseHomeworkInfo.endDate).getMonth()+1;
		var endDay=new Date(h[j].courseHomeworkInfo.endDate).getDate();
		var hwName=h[j].courseHomeworkInfo.title;
		var courseId=h[j].courseHomeworkInfo.courseId;
		var homewkId=h[j].courseHomeworkInfo.homewkId;
		//console.log(endDay+hwName);
		//$('.fc-widget-content:not(.fc-other-month)')
		
		var s=$('.fc-header-title')[0].children[0].innerHTML;
		var month=s.substring(5,s.lastIndexOf('月'));
		//date=s.substring(0,s.lastIndexOf(' '))
		$('.fc-widget-content:not(.fc-other-month)').each(
			function (date0){
				var date=+date0+1;
				//this.children[0].innerHTML+=date;
				if (endDay==date&&endMonth==month) this.children[0].innerHTML+='<a href="/f/student/homework/hw_detail/'+courseId+'/'+homewkId+'">'+hwName+'</a>';
			}
		);
	//fc-other-month:不在当前月份内
	//当前年月:<span class="fc-header-title"><h2>2014年7月</h2></span>
	
	//<div class="fc-day-number">4 初八</div>
	}
	
	//console.log("i"+i);
}

$('.fc-border-separate').mousedown(function del()
{
	$('.fc-cell-overlay').remove();
});

