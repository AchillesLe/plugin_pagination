(function ( $ ) {
	$.fn.pagination_ul = function(search,options) {
		var defaults  = {
			onepage : 8
		};
		var settings = $.extend(defaults, options);
		var selector =  $(this);
		var selector_li =  selector.find('li');
		var search =  $(search);
		var total_li = selector_li.length;
		var pagination = '';
		init_display();

		function get_list_of_page(index,arr){
			let new_arr = [];
			let from = index==1 ? 0 : (index-1)*settings.onepage;
			let to = index == 1 ? settings.onepage : index*settings.onepage;
			$.each(arr,(i,e)=>{
				if( i >= from && i < to ){
					new_arr.push(e);
				}
			});
			return new_arr;
		}

		function create_pagination( total , current  ){
				let previous_class = "previous";
				let current_class = "current";
				let next_class = "next";
				let disabled_class = "disabled";
				let pagination = '<ul class="pagination js_pagination" id="pagination_ul">';
				if( total==0 ){
					pagination = '';
				}else{
					pagination +='<li ><a class="' + previous_class + ' ';
					pagination += current == 1 ? disabled_class : "" ;
					pagination += '" >前</a></li>';
							let total_page = Math.ceil(total/settings.onepage);
							for( let x = 1 ; x <= total_page ; x ++ ){
								pagination += '<li data-page_id="'+x+'"><a class="';
								pagination += current == x ? current_class :'';
								pagination += '"  >'+x+'</a></li>';
							}
					pagination +='<li ><a class="' + next_class + ' ';
					pagination += current == total_page ? disabled_class : "" ;
					pagination += '" >次</a></li>';
				}	
			selector.parent().find('ul#pagination_ul').remove();
			selector.after(pagination);
			this.pagination = $('ul#pagination_ul');
		}

		function init_display(){
			selector_li.each((i,e)=>{
				$(e).data('index',i);
				if( i < settings.onepage ){
					$(e).show();
				}else{
					$(e).hide();
				}
			});
			create_pagination(total_li,1);
		}

		function move_page(to_page){
			let keyword = search.length > 0 ? search.val().toUpperCase() : '';
			let total = 0;
			let total_list = [];
		
			selector_li.each((i,e)=>{
				let content = $(e).text().toUpperCase();
				let index = $(e).data('index');
				if( content.indexOf(keyword) != -1 ){
					total ++;
					total_list.push(index);
				}else{
					$(e).hide();
				}
			});
			let arr = get_list_of_page(to_page,total_list);
			$.each(total_list, (i,e)=>{
				if( !arr.includes(e) ){
					selector_li.eq(e).hide();
				}else{
					selector_li.eq(e).show();
				}
				
			});
		
			create_pagination(total,to_page);
		}

		function next_page(){
			let current_page = this.pagination.find('li a.current').parent('li').data('page_id');
			move_page(current_page+1);
		}

		function previous_page(){
			let current_page = this.pagination.find('li a.current').parent('li').data('page_id');
			move_page(current_page-1);
		}

		$(document).on('click','ul#pagination_ul li a:not(.next):not(.previous):not(.current)',function(){
			let x =  $(this).parent('li').data('page_id');
			move_page(x);
		});
		$(document).on('click','ul#pagination_ul li a.next',function(){
			next_page();
		});
		$(document).on('click','ul#pagination_ul li a.previous',function(){
			previous_page();
		});
		search.on('input',function(){
			let keyword = $(this).length > 0 ? $(this).val().toUpperCase() : '';
			let total = 0;
			let show = 0;
			if(keyword.length == 0){
				init_display();
			}else{
				$('.article_list li').each((i,e)=>{
					let content = $(e).text().toUpperCase();
					if( content.indexOf(keyword) != -1  ){
						if( show < settings.onepage ){
							$(e).show();
							show ++;
						}
						total ++;
					}else{
						$(e).hide();
					}
				});
				if(total==0){
					create_pagination(total,0);
				}else{
					create_pagination(total,1);
				}
			}
		});
	}
}(jQuery ));