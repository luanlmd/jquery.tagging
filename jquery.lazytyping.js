jQuery.fn.lazytyping = function(options)
{
	var settings = $.extend({
		source : '?input=',
		wrapperStyle : { border : '1px solid grey', padding:'2px' },
		dataListStyle : { listStyle:'none', display:'inline', padding:0 },
		dataItemStyle : { border:'1px solid grey', borderRadius:'3px', display:'block', padding:'1px 4px 0 4px', float:'left', margin:'1px', fontSize:'0.8em', background:'#CCC', cursor:'pointer' },
		searchListStyle : { display:'none', position:'absolute', listStyle:'none', padding:'0', border:'1px solid #ccc' },
		searchItemStyle : { padding:'3px', background:'#ddd' },
		searchItemStyleSelected : { background:'#ccc' }	
	}, options);
			
	var loading = false;
		
	$(this).wrapAll($('<div class="lazytyping-wrapper" />').css(settings.wrapperStyle));
	var wrapper = $('.lazytyping-wrapper');

	wrapper.append($('<ul class="lazytyping-data" />').css(settings.dataListStyle));
	var data = wrapper.find('ul.lazytyping-data');

	wrapper.append($('<ul class="lazytyping-search" />').css(settings.searchListStyle));
	var search = wrapper.find('ul.lazytyping-search');
	search.find('li').live('click', function()
	{
		addItem($(this).data('value'));
	});

	var original = $(this);
	original.css({'visibility':'hidden', position:'absolute', left:'-9999px' });
	
	wrapper.append($('<input type="text" class="lazytyping-input" />'));
	var input = wrapper.find('.lazytyping-input');
	input.css({border:'none', outline:'none'});

	addItem = function(value)
	{
		data.append($('<li>'+value+'</li>').css(settings.dataItemStyle));
		search.hide();
		updateValue();
		input.val('');
	}

	if(input.val())
	{
		values = input.val().split(',');
		for (i in values)
		{
			addItem(values[i]);
		}
	}
	
	updateValue = function()
	{
		var value = '';
		data.find('li').each(function(){
			value += $(this).html() + ',';
		});
		original.val(value.substr(0,value.length-1));
		console.log(original.val());
	}
		
	data.find('li').live('click', function(){ $(this).remove(); updateValue(); });
	
	wrapper.on('click', function(){ input.focus() });
	
	input.on('keydown', function (e)
	{
		if (e.keyCode == 13) // ENTER - prevent form from being submited
		{
			e.preventDefault();
		}
		
		// this must run before erase the first input's char
		if (e.keyCode == 8 && !input.val()) // BACKSPACE and no input
		{
			data.find('li:last').remove();
			updateValue();
			return;
		}		
		
	});
	
	changeSelected = function(selected, next)
	{
		if (next.length == 0) { return; }
		selected.removeClass('lazytyping-selected')
		next.addClass('lazytyping-selected');
		selected.css(settings.searchItemStyle);
		next.css(settings.searchItemStyleSelected);
		return;
	}
	
	input.on('keyup', function(e)
	{
		if (e.keyCode == 38) // UP
		{
			selected = search.find('li.lazytyping-selected');
			prev = selected.prev();
			changeSelected(selected, prev);
			return;

		}
		if (e.keyCode == 40) // DOWN
		{
			selected = search.find('li.lazytyping-selected');
			next = selected.next();
			changeSelected(selected, next);
			return;
		}
	
		if (e.keyCode == 188) // ,
		{
			value = $.trim($(this).val().replace(',',''));
			if (value)
			{
				addItem(value);
				$(this).val('');
			}
			search.hide();
			return;
		}
		
		if (e.keyCode == 13) // ENTER
		{
			addItem(search.find('li.lazytyping-selected').data('value'));
			return;
		}
		
		$.ajax({url:settings.source + input.val(), success: function(data)
		{
			if (data)
			{
				search.show();
				search.html(data);
				search.css({left:input.position().left,top:input.position().top});
				search.find('li').css(settings.searchItemStyle);
				search.find('li:first').addClass('lazytyping-selected').css(settings.searchItemStyleSelected);
				return;
			}
			search.hide();
		}});
	});
};
