/*
 	This is just a simple editor with only insert to added and output.
 	It can used in IE9+ and other browers.
 	The latest update time 2017/09/09.
 	autor : @potato
 */
/*
 	用法:
 		var editor = new YezEditor(objId); 實例化YezEditor
 		
 		常用：
	 		方法
		 		editor.insertHTML(html) 插入文本(返回實例對象) 
		 		  參數：html(String)插入文本
		 		
		 		editor.insertEmoji(src,id,func) 插入表情 (返回實例對象) 
		 		 參數：src(String)表情路徑
		 		 	  id(String)表情id
		 		 	  func回調
		 		 
		 		editor.insertBlock(cont,id,color,func) 插入行塊  (返回實例對象)
		 		參數:  cont(String)插入內容,
		 			  id(String)插入內容的id,
		 			  color(String)插入內容的字體顏色,
		 			  func回調
		 			  
		 		editor.getContent(bol,func) 獲取編輯框的內容(返回實例對象)
		 		參數: bol (boolean) 是否把所有換行的標籤過濾成 <br>  默認為 false
		 			 func(res)  回調  參數為獲取到編輯框的內容
		 			 
		 		editor.editorHolder(string) 設置placeholder(返回實例對象)
		 				string(string) 參數為提示的內容
		 				
		 		*********************************************************
		 		editor.getYezContent(); 獲取Yez後台想要的內容(公司私有方法)
		 				無參數 ，返回獲取到的結果
		 		editor.getUserArr(); 獲取插入的用戶id數組
		 		editor.getLabelArr(); 獲取插入的標籤id數組
		 		*********************************************************
	 		屬性
	 			editor.obj 返回objID對象
	 		
	 		
 		不常用：
	 		方法
		 		editor.setRange() 獲取range屬性信息選擇失去焦點之前選擇的內容(存儲選擇的內容)   參數：無
		 		editor.getRange(ran) 選擇失去焦點之前選擇的內容   參數：range對象
	 		屬性
		 		editor.sel  返回selection對象
		 		editor.ran  返回range屬性信息
 */
function YezEditor(id){
	this.obj = $(id);
	this.sel;
	this.ran;
	this.editorBegin();
}
YezEditor.prototype = {
	editorBegin:function(){
		var self = this;
		self.obj.focus();
		self.setRange();
		self.obj.blur();
		window.scrollTo(0,0);
		self.defaultFunc();
		self.filter();
		self.obj.on('click keyup keypress',function(){
			if($(this).text().length == 0 && $(this).html().length != 0){
				if($(this).html().length == 4){
					$(this).find('br').last().remove();
				}else if($(this).html().length == 11 || $(this).html().length == 13){
					$(this).find('p').last().remove();
				}else if($(this).html().length == 15){
					$(this).find('div').last().remove();
				}
			}
			if($(this).is(':focus')) self.setRange();
		});
		self.obj.on('drop',function(event){
			event.preventDefault();
		});
	},
	insertHTML:function(html){
		if(this.ran == undefined){
			this.obj.focus();
			this.setRange();
		}
		var oFragment = this.ran.createContextualFragment(html);
		var oLastNode = oFragment.lastChild;
		this.ran.deleteContents();
		this.ran.insertNode(oFragment);
		this.ran.setStartAfter(oLastNode);
        this.sel.removeAllRanges();
    	this.sel.addRange(this.ran);
    	this.obj.focus();
	},
	insertEmoji:function(src,id,func){
		var newImg = '<img id="'+id+'" class="small-emoji-insert-'+id+' small-emoji-insert-item" src="//wap.macaoeasybuy.com'+src+'">';
		this.insertHTML(newImg);
		$('.small-emoji-insert-'+id).each(function(){
			$(this)[0].saveSrc = src;
		});
		newImg = null;
		if(func){
			func.call(this);
		}
		return this;
	},
	insertBlock:function(html,id,color,func){
		this.insertHTML('<br id="changeLinear"><span id="getWidthSpan1314">'+html+'</span>');
		var width = parseInt($('#getWidthSpan1314').css('width')) - html.length + 2;
		$('#getWidthSpan1314').remove();
		$('#changeLinear').remove();
		var labelBox = '<input class="'+id+'" data="'+id+'" type="text" disabled="disabled" value="'+html+'" style="width:'+width+'px;color:'+color+'">';
		this.insertHTML(labelBox);
		if(func){
			func.call(this);
		}
		return this;
	},
	getContent:function(bol,func){
		if(typeof bol == 'function'){
			var func = bol;
			var bol = false;
		}
		if(bol){
			this.obj.find('div').each(function(k){
				var obj = $(this);
				if( k==0 ){
					obj.before('<br>');
				}
				if(obj.html() == '<br>'){
					obj.before('<br>');
				}else{
					obj.before(obj.html() + '<br>');
				}
				obj.remove();
				obj = null;
			});
			this.obj.find('p').each(function(k){
				var obj = $(this);
				if(obj.html() == '<br>'){
					obj.before('<br>');
				}else{
					obj.before(obj.html() + '<br>');
				}
				obj.remove();
				obj = null;
			});
			this.obj.find('br').last().remove();
		}
		if(func){
			func.call(this,this.obj.html());
		}
		return this;
	},
	getYezContent:function(){
		var obj = this.obj;
		$('.small-emoji-insert-item').each(function(){
			console.log($(this)[0].src);
			console.log($(this)[0].saveSrc);
			$(this).attr('src',$(this)[0].saveSrc);
			$(this).removeAttr('class');
		});
		var oldHtml = obj.html();
		$('.replyUserTips1314').remove();
		var newres = '';
		var arra = []; //存id
		var arrb = []; //存name
		var arrc = []; //存account（僅限用戶）
		var arrt = []; //存Type
		var atPos = []; //@人真正的位置
		var labelPos = [];//標籤真正的位置
		var flagUser = 'e*a!s*y!B*u!y'; //用戶分割標記
		var flagLabel = 'e*a*s!y!B*u!y'; //標籤分割標記
		var userMiddleFlag = 'e!a*s*y!B*u!y'; //用戶中間標記
		var labelMiddleFlag = 'e*!a!s*y*B*u!y'; //標籤中間標記
		//按照自己想要的方式過濾標籤與label
		obj.find('input').each(function(){
			var dataId = $(this)[0].dataId;
			var dataName = $(this)[0].dataName;
			var myType = $(this)[0].myType;
			if(myType == 'user'){
				var account = $(this)[0].dataAccount;
				arrc.push(account);
			}
			arra.push(dataId);
			arrb.push(dataName);
			arrt.push(myType);
			if(myType == 'user'){
				$(this).before(flagUser+'|@'+userMiddleFlag+account+'|'+flagUser);
			}else if(myType == 'label'){
				$(this).before(flagLabel+'|'+labelMiddleFlag+dataName+'|'+flagLabel);
			}
			$(this).remove();
		});
		obj.find('img').each(function(){
			$(this).before('|');
			$(this).after('|');
		});
		this.getContent(true); // 粗略過濾標籤
		newres = obj.html();
		obj.html(oldHtml);
		obj.find('input').each(function(k){
			if(k == 0 && obj.find('.replyUserTips1314').length != 0){
				return;
			}
			$(this)[0].dataId = arra[k];
			$(this)[0].dataName = arrb[k];
			$(this)[0].myType = arrt[k];
			if(arrt[k] == 'user') $(this)[0].dataAccount = arrc[k];
		});
		//給編輯器一次聚焦與失焦 解決ie9有內容時placeholder會出現的問題
		obj.focus();
		this.getRange(editor.ran);
		obj.blur();
		//聚焦失焦完成
		/***********************************/
		newres = newres.replace(/http:\/\/mbuy.oss-cn-hongkong.aliyuncs.com\//g,'');
		var flagStr = newres.split(flagUser);
		var flagNum = 0;
		for(var i=0;i<flagStr.length;i++){
			if(/e!a\*s\*y!B\*u!y/.test(flagStr[i])){
				flagStr[i] = -1;
			}else{
				if(flagStr[i].match(/@/g) != null){
					flagStr[i] = flagStr[i].match(/@/g).length;
				}else{
					flagStr[i] = 0;
				}
			}
		}
		for(var i=0;i<flagStr.length;i++){
			if(flagStr[i] == -1){
				flagNum+=1;
				atPos.push(flagNum);
			}else{
				flagNum+=flagStr[i];
			}
		}
		var flagStr = newres.split(flagLabel);
		var flagNum = 0;
		for(var i=0;i<flagStr.length;i++){
			if(/e\*!a!s\*y\*B\*u!y/.test(flagStr[i])){
				flagStr[i] = -1;
			}else{
				if(flagStr[i].match(/#/g) != null){
					flagStr[i] = flagStr[i].match(/#/g).length;
				}else{
					flagStr[i] = 0;
				}
			}
		}
		for(var i=0;i<flagStr.length;i++){
			if(flagStr[i] == -1){
				flagNum+=1;
				labelPos.push(flagNum);
				flagNum+=1;
			}else{
				flagNum+=flagStr[i];
			}
		}
		newres = newres.replace(/e\*a!s\*y!B\*u!y/g,'');
		newres = newres.replace(/e\*a\*s!y!B\*u!y/g,'');
		newres = newres.replace(/e!a\*s\*y!B\*u!y/g,'');
		newres = newres.replace(/e\*!a!s\*y\*B\*u!y/g,'');
		/**************************************/
		return {
			newres:newres,
			atPos: atPos.length>0 ? atPos.join(',') : -1,
			labelPos:labelPos.length>0 ? labelPos.join(',') : -1
		};
	},
	getUserArr:function(){
		var obj = this.obj;
		var arr = [];
		obj.find('input').each(function(){
			if($(this)[0].myType == 'user'){
				arr.push($(this)[0].dataId);
			}
		});
		return arr;
	},
	getLabelArr:function(){
		var obj = this.obj;
		var arr = [];
		obj.find('input').each(function(){
			if($(this)[0].myType == 'label'){
				arr.push($(this)[0].dataId);
			}
		});
		return arr;
	},
	editorHolder:function(holder){
		this.obj.attr('placeholder',holder);
		return this;
	},
	getRange:function(savedSel){
		var self = this;
		if(!savedSel){
			if(self.ran){
				var savedSel = self.ran;
			}else{
				return;
			}
        }
		if(window.getSelection){
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSel);
        }
        else if(document.selection){
            savedSel.select();
        }
	},
	setRange:function(){
		this.sel = this.createRange();
		if(this.sel == null){
			return false
		}else{
			(window.getSelection) ? this.ran = this.sel.getRangeAt(0) : this.ran = this.sel.createRange();
		}
	},
	filter:function(){
		var self = this;
	    try {
	        document.execCommand("AutoUrlDetect", false, false);
	    } catch (e) {}
	    this.obj.on('paste', function(e) {
	        e.preventDefault();
	        var text = null;
	        if(window.clipboardData && clipboardData.setData) {
	            text = window.clipboardData.getData('text');
	        } else {
	            text = (e.originalEvent || e).clipboardData.getData('text/plain');
	        }
	        if (document.body.createTextRange) {    
	            if (document.selection) {
	                textRange = document.selection.createRange();
	            } else if (window.getSelection) {
	                sel = window.getSelection();
	                var range = sel.getRangeAt(0);
	                var tempEl = document.createElement("span");
	                tempEl.innerHTML = "&#FEFF;";
	                range.deleteContents();
	                range.insertNode(tempEl);
	                textRange = document.body.createTextRange();
	                textRange.moveToElementText(tempEl);
	                tempEl.parentNode.removeChild(tempEl);
	            }
	            textRange.text = text;
	            textRange.collapse(false);
	            textRange.select();
	        } else {
	            document.execCommand("insertText", false, text);
	        }
	    });
	},
	createRange:function(){
		if(window.getSelection){
			var sel = window.getSelection();
			if(sel.rangeCount>0){
				return sel;
			}
		}else if(document.selection){
			var sel = document.selection;  
			return sel.createRange();  
		}  
		return null;
	},
	defaultFunc:function(){
		if((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
		    Range.prototype.createContextualFragment = function(html) {
		        var frag = document.createDocumentFragment(),div = document.createElement("div");
		        frag.appendChild(div);
		        div.outerHTML = html;
		        return frag;
		    };
		}
	}
}
