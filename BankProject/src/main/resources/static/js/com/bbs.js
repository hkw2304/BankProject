function chgParentClass(sel, childName)
{
	var selIdx = sel.selectedIndex;
	if(sel.options[0].value=='')
	{
		 
		selIdx --;
	}
	
	var sel2 = jQuery("#" + childName);
	 
	if(sel2.length>0)
	{
		var selObj = sel2[0];
		jQuery(sel2).find("OPTION").remove();
		if(selIdx<0) return;
		var arr = category[ selIdx ];
		for( var i=0; i <arr.length ; i++)
		{
			jQuery(sel2).append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
		}	
	}
	
}
function on_after_save(boardId, articleId)
{
	if(!articleId || articleId == '')
	{
		bbs_list(boardId);
		return;
	}
		
	var html = "<form method='post' id='bbsForm_" + boardId  + "_temp'>";
	html += "<input type=hidden name='bbsMode' value='view' />";
	 


	var objs = jQuery("#bbsForm_" + boardId + " > input:hidden");
	for( var i=0; i < objs.length ; i++)
	{
		var name1 = objs[i].name;
		if(name1=='bbsMode') continue;
		html += "<input type='hidden' name='" + objs[i].name + "' value='" + objs[i].value + "' />";
	}
	html += "</form>";
	jQuery(html).insertAfter("#bbsForm_" + boardId);
	 
	jQuery("#bbsForm_" + boardId + "_temp")[0].submit();
 
}
function bbs_gotoView(obj, boardId, articleId, viewPage)
{
	 
	var frm=jQuery("#bbsForm_" + boardId)[0];
	
	frm.bbsMode.value="view";
	frm.target="";
	if(viewPage)
	{
		frm.action=viewPage;
	}
	else
	{
		frm.action="";
	}
	frm.ARTICLE_ID.value=articleId;
	
	try
	{
		if(obj)
		{
			frm.__PAGE_TITLE__.value= obj.innerText;
		}
		 
			
	}
	catch(e)
	{
		
	}
	
	frm.submit();
	
}
function bbs_download(boardId, articleId, attachId, obj)
{
	var attachType=jQuery("input:hidden[name=ATTACH_TYPE]").val();
	if(obj && attachType == "inline")
	{
		obj.href= bbsUrl + "?cmd=download&BOARD_ID=" +  boardId + "&ARTICLE_ID=" + articleId + "&ATTACH_ID=" + attachId  + "&ATTACH_TYPE=" + attachType ;
		obj.target="_blank";
		//obj.click();
		return true;
	} 
	else
	{
		bbs_download_top(boardId, articleId, attachId);
	}
	return false;
 
} 
 
function bbs_grid_search(boardId)
{
	param.SEARCH_FIELD = jQuery("#SEARCH_FIELD").val();
	param.KEYWORD = jQuery("#KEYWORD").val();
	param.BOARD_ID=boardId;
	grid_search1( 'list','jspeed.cms.service.bbs.BBSListAction',param);
}
function bbs_list(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="";
	if(location.href.indexOf("bbsMode")>0)
	{
		frm.action="Dream?withyou=" + frm.withyou.value;
	}
	else
	{
		frm.action="";
	}
	   
	if(frm.__PAGE_TITLE__){
		frm.__PAGE_TITLE__.value="";
	}
	
	frm.bbsMode.value="list";
	 
	frm.submit();
}
function bbs_write(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.bbsMode.value="write";
	frm.__PAGE_TITLE__.value="게시물 쓰기";
	frm.target="";
	frm.action="";
	frm.submit();
}
function bbs_goPage(boardId, pageId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.BOARD_PAGE_NO.value=pageId;
	frm.bbsMode.value="list";
	frm.submit();
}
function bbs_delete(boardId,articleId)
{
	if(confirm("삭제하시겠습니까?"))
	{
		var frm=jQuery("#bbsForm_" + boardId)[0];
		if(articleId)
		{
			frm.ARTICLE_ID.value=articleId ; 
		}
		frm.target="bbsHiddenFrame";
		frm.action= bbsUrl + "?cmd=delete";
		frm.submit();
	}
}
 
function bbs_save(boardId)
{
	 
	var frm=jQuery("#bbsForm_" + boardId)[0];
 
	var requiredObj = jQuery(frm).find("[class *= 'required']");
	
	if(frm.TITLE.value=='') 
	{
		alert('제목을 반드시 입력하세요.');
		frm.TITLE.focus();
		return ;
	}
	for( var i=0; i < requiredObj.length ; i++)
	{
		if(requiredObj[i].value == '' )
		{
			alert(requiredObj[i].title + '을/를 반드시 입력하세요.');
			return ;
		}
	}
	if($("#formelement51").is(":checked")){
		//alert($("#NOTI_DATE_FROM").val()+"__"+$("#NOTI_DATE_TO").val());
		if($("#NOTI_DATE_FROM").val()!=null&&$("#NOTI_DATE_FROM").val()!="" && $("#NOTI_DATE_TO").val()!=null&&$("#NOTI_DATE_TO").val()!=""){
			var toDay = new Date();
			var year = toDay.getFullYear(); 
			var month = numberLengthCheck(toDay.getMonth()+1);
			var date = numberLengthCheck(toDay.getDate()); 
			var hours = numberLengthCheck(toDay.getHours()); 
			var menutes = numberLengthCheck(toDay.getMinutes()); 
			var seconds = numberLengthCheck(toDay.getSeconds());
			var nowDate = parseInt(""+year+month+date);
			var notiDateForm = parseInt($("#NOTI_DATE_FROM").val());
			var notiDateTo = parseInt($("#NOTI_DATE_TO").val());
			
			//alert(notiDateForm+":"+nowDate+":"+notiDateTo);
			if(notiDateForm<=notiDateTo){
				if(nowDate<=notiDateForm){ //현재시간이 공지 유효일시작 이전이면 
					if(!$("#IS_TOP_ARTICLE").is(":checked")){    //공지여부 체크되야함
						alert("공지여부 체크를 하셔야 합니다.");
						return false;
					}
				}else if(nowDate<=notiDateTo){ //현재시간이 공지 유효일종료 이전이면
					if(!$("#IS_TOP_ARTICLE").is(":checked")){    //공지여부 체크되야함
						alert("공지여부 체크를 하셔야 합니다.");
						return false;
					}
				}else{
					if($("#IS_TOP_ARTICLE").is(":checked")){    //공지여부 체크안되야함
						alert("공지여부 체크를 해제 하셔야 합니다.");
						return false;
					}
				}
			}else{ 
				if(!$("#IS_TOP_ARTICLE").is(":checked")){    //공지여부 체크되야함
					alert("공지 유효일의 종료일이 시작일보다 커야 합니다.");
					return false;
				}
			}
		}
	}
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=save";
	 
	frm.submit();
	return true;
}

function numberLengthCheck(number){
	var result = ""+number;
	if(number<10){
		result = "0"+number;
	}
	return result;
}

function bbs_order(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.BOARD_PAGE_NO.value=1;
	frm.bbsMode.value="order";
	frm.__PAGE_TITLE__.value="순서변경";
	frm.target="";
	frm.action="";
	frm.submit();
}
function bbs_goPageOrder(boardId, pageId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.BOARD_PAGE_NO.value=pageId;
	frm.bbsMode.value="order";
	frm.__PAGE_TITLE__.value="순서변경";
	frm.target="";
	frm.action="";
	frm.submit();
}
function orderAdd(){
	var checkObjs = $("input:checkbox[id='bbsCheckBox']:checked");
	var isTopArticleObjs = $("[id='isTopArticle']");
	var topArticleSelectYN=false;
	for(var i=0; i<checkObjs.length; i++){
		var titleId = "bbsTitle_"+checkObjs[i].value;
		if(getOrderListIndexByValue(checkObjs[i].value)==-1){
			if(isTopArticleObjs[i].value!="T"){
				$("#ORDER_LIST").append("<option value='"+checkObjs[i].value+"'>"+$("#bbsTitle_"+checkObjs[i].value).text()+"</option>");
			}else{
				topArticleSelectYN=true;
			}
		}
	}
	if(topArticleSelectYN){
		alert("공지사항은 추가되지 않습니다.");
	}
}
function getOrderListIndexByValue(bbsId){
	var result = -1;
	for(var i=0; i<$("#ORDER_LIST option").size(); i++){
		if(bbsId ==$("#ORDER_LIST option:eq("+i+")").val()){
			result = i;
			break;
		}
	}
	return result;
}
function orderDelete(){
	var selectObjs = $("#ORDER_LIST option:selected");
	var orderListWidth = $("#ORDER_LIST").css("width");
	for(var i=0; i<selectObjs.length; i++){
		$("#ORDER_LIST option:[value='"+selectObjs[i].value+"']").remove();
	}
	$("#ORDER_LIST").css("width", parseInt(orderListWidth.replace("px", ""))+4);
}
function orderUp(){
	var selectObjs = $("#ORDER_LIST option:selected");
	var orderObjs = $("#ORDER_LIST option");
	var orderListWidth = $("#ORDER_LIST").css("width");
	if(selectObjs.length!=orderObjs.length){
		for(var i=0; i<selectObjs.length; i++){
			var objIndex=getOrderListIndexByValue(selectObjs[i].value);
			if(objIndex>0){
				$("#ORDER_LIST option:eq("+objIndex+")").remove();
				$("#ORDER_LIST option:eq("+(objIndex-1)+")").before("<option value='"+selectObjs[i].value+"'>"+selectObjs[i].text+"</option>");
				$("#ORDER_LIST option:eq("+(objIndex-1)+")").attr("selected", "selected");
			}else{
				break;
			}
		}
	}
	$("#ORDER_LIST").css("width", parseInt(orderListWidth.replace("px", ""))+4);
}
function orderDown(){
	var selectObjs = $("#ORDER_LIST option:selected");
	var orderObjs = $("#ORDER_LIST option");
	var orderListWidth = $("#ORDER_LIST").css("width");
	for(var i=selectObjs.length-1; i>=0; i--){
		var objIndex=getOrderListIndexByValue(selectObjs[i].value);
		if(objIndex<orderObjs.length-1){
			$("#ORDER_LIST option:eq("+objIndex+")").remove();
			$("#ORDER_LIST option:eq("+objIndex+")").after("<option value='"+selectObjs[i].value+"'>"+selectObjs[i].text+"</option>");
			$("#ORDER_LIST option:eq("+(objIndex+1)+")").attr("selected", "selected");
		}else{
			break;
		}
	}
	$("#ORDER_LIST").css("width", parseInt(orderListWidth.replace("px", ""))+4);
}
function orderSave(boardId){
	for(var i=0; i<$("#ORDER_LIST option").size(); i++){
		$("#ORDER_LIST option:eq("+i+")").attr("selected", "selected");
	}
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=order_save";
	frm.submit();
}
function listSizeChange(boardId){
	bbs_order(boardId);
}
function bbs_img_upload(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	var files = jQuery(frm).find("#BBS_IMG_FILE");
	frm.action=bbsUrl + "?cmd=img_upload";
	frm.submit();
	for( var i=0; i < files.length ; i++)
	{
		//files[i].disabled=false;
	}
}
function bbs_modify(boardId, articleId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	if(articleId)
	{
		frm.ARTICLE_ID.value=articleId ; 
	}
	frm.bbsMode.value="modify";
	frm.target="";
	frm.action="";
	frm.submit();
}
 
function onAfterSuccess(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.reset();
	bbs_list(boardId)
}
function bbs_reply(boardId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.bbsMode.value="reply";
	frm.target="";
	frm.action="";
	frm.submit();
}
function bbs_delAttach(obj, i)
{
	 obj.parentElement.innerHTML=""
	 jQuery("#BBS_ATTACH_FILE_" + i).removeAttr("disabled");  
}


var imageUploadCallBack=null; // 이미지 업로드 callback 함수 ;

function onAfterImgUpload(boardId, imgPath)
{
	// added by 90121111 이미지 업로드 콜백 함수 추가
	if(imageUploadCallBack != null){
		if(typeof imageUploadCallBack == 'function'){
			imageUploadCallBack(boardId, imgPath);
			return;
		}
	}
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.CONTENTS.value=frm.CONTENTS.value+"<img src='" + imgPath + "'>";
	 
	//CONTENTS__Frame.FCK.SetHTML(frm.CONTENTS.value)
}
function bbs_comment_save(boardId)
{
	
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=saveComment";
	frm.submit();
}
function bbs_comment_delete(boardId, commId)
{
	 
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=deleteComment&ARTICLE_COMM_ID=" + commId;
	frm.submit();
}
function bbs_comment_reply_save(boardId, commId)
{
	 
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=saveComment&bbsCommMode=reply&ARTICLE_COMM_ID=" + commId;
	frm.submit();
	jQuery("#comment_edit_area_" + commId).remove();
}
function bbs_comment_modify(boardId, commId)
{	 
	var contents = jQuery("#comment_content_" + commId).html();
	jQuery("#comment_content_" + commId).html(contents + '<div id=comment_edit_area_' + commId + '>' + jQuery("#comment_input_area").html() + '</div>')
	
	var btn = jQuery("#comment_edit_area_" + commId).find("*[onclick]");
	jQuery(btn).removeAttr("onclick")
	jQuery("#comment_edit_area_" + commId).find("#COMM_CONTENTS").val(contents);
	jQuery(btn).click(
			function (e)
			{
				
				bbs_comment_modify_save( boardId  ,  commId  );
				 
			}
			);
	 
	
}
function bbs_comment_modify_save(boardId, commId)
{
	var frm=jQuery("#bbsForm_" + boardId)[0];
	frm.target="bbsHiddenFrame";
	frm.action=bbsUrl + "?cmd=saveComment&ARTICLE_COMM_ID=" + commId;
	frm.submit();
	jQuery("#comment_edit_area_" + commId).remove();
}
function bbs_comment_reply(boardId, commId)
{
	 
	jQuery("#comment_content_" + commId).html(jQuery("#comment_content_" + commId).html() + '<div id=comment_edit_area_' + commId + '>' + jQuery("#comment_input_area").html() + '</div>')
	
	var btn = jQuery("#comment_edit_area_" + commId).find("*[onclick]");
	jQuery(btn).removeAttr("onclick")
 
	jQuery(btn).click(
			function (e)
			{
				
				bbs_comment_reply_save( boardId  ,  commId  );
				 
			}
			);
	 
}
function bbs_comment_list(boardId,articleId, pageNo, pageRow, targetArea)
{
	 var t = new Date();
	  t = t.getTime();
	  
	  var tempUrl = bbsUrl + "?cmd=comm_list&BOARD_ID=" + boardId + "&ARTICLE_ID=" + articleId + "&COMM_PAGE_NO=" + pageNo + "&t=" + t;
	  if(pageRow!=null){
		  tempUrl = bbsUrl + "?cmd=comm_list&BOARD_ID=" + boardId + "&ARTICLE_ID=" + articleId + "&COMM_PAGE_NO=" + pageNo + "&PAGE_ROW="+pageRow+"&t=" + t;
	  }
	  
	jQuery.ajax ( { type:'GET',
		url: tempUrl,
		dataType:'html',					
	 
	 
		 
		success : function ( html )
		{
			 
			if(!targetArea)
			{
				targetArea = "bbs_comment_list_" + boardId;
			}
			jQuery("#" + targetArea).html(html);
			 
		},
		error : function(xhr, textStatus)
		{
			alert("Error" + textStatus);
		}
		}
	)
}

function bbs_download_top(boardId, articleId, attachId)
{
	if(attachId==null||attachId==""){
		attachId=1;
	}
	top.location.href= bbsUrl + "?cmd=download&BOARD_ID=" +  boardId + "&ARTICLE_ID=" + articleId + "&ATTACH_ID=" + attachId ;
} 		 

$(document).ready(function() {
	try
	{
		var bbsMode = jQuery("input:hidden[name=bbsMode]").val();
		if(bbsMode=='modify')
		{
			var obj =jQuery("#CONTENTS")[0];
			obj.value = obj.value.replace(/\xA0/g, "&nbsp;");
		}
	}
	catch(e)
	{}
});