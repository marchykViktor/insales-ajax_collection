InSales.ajaxCollection = function(options){

  var url    = window.location.href,
      path   = window.location.pathname,
      param  = window.location.search,
      self   = this;

  //задаем параметры
  init = function(){
    options                  = options || {};
    self.collectionContainer = options.collectionContainer || '.js-ajax_collection-container';
    self.paginationContainer = options.paginationContainer || '.js-ajax_collection-pagination_container';
    self.paginationSelector  = options.paginationSelector || '.js-ajax_collection-pagination';
    self.pageSortSelector    = options.pageSortSelector || '.js-ajax_collection-page_sort';
    self.pageSizeSelector    = options.pageSizeSelector || '.js-ajax_collection-page_size';
    self.preloaderSelector   = options.preloaderSelector || '.js-ajax_collection-preloader';
    self.params              = getParams() || {};
    self.params.page     = self.params.page || 1;
    
    binding();
    
  };
  
  //вешаем обработчики
  var binding = function(){
    var $sort       = $(self.pageSortSelector),
        $pageSize   = $(self.pageSizeSelector),
        $pagination = self.paginationSelector;
    $sort.on('click', sortClick);
    $(document).on('click', self.paginationSelector, paginationClick);
    $pageSize.on('change', pageSizeClick);
  }
  
  //Работа с прелоадером
  self.preloader = {
    show: function(){
      $(self.preloaderSelector).fadeIn();
    },
    hide: function(){
      $(self.preloaderSelector).fadeOut();
    }
  }
  
  //обрабатываем сортировку
  var sortClick = function(event) {
    event.preventDefault();
    var dataAttr = $(this).data('ajax-sort');
    self.params.order = dataAttr;
    self.preloader.show();
    getProducts(self.params);
  }
  
  //обрабатываем пагинацию
  var paginationClick = function(event) {
    event.preventDefault();
    var dataAttr = $(this).data('pagination-number');
    if (dataAttr === 'none' || dataAttr === '…') {
      return false;
    } else if (dataAttr === 'prev') {
      --self.params.page;
    } else if (dataAttr === 'next') {
      ++self.params.page;
    } else {
      self.params.page = dataAttr;
    }
    self.preloader.show();
    getProducts(self.params);
  }
  
  //обрабатываем размер страницы 
  var pageSizeClick = function(event){
    event.preventDefault();
    var dataAttr = $(this).val();
    self.params.page_size = dataAttr;
    self.params.page = 1;
    self.preloader.show();
    getProducts(self.params, function(){
      $(self.pageSizeSelector + ' option[selected=""]')
        .attr('selected', false);
      $(self.pageSizeSelector + ' option[value="' + self.params.page_size + '"]')
        .attr('selected', '');
      });
  };
  
  // общаемся с сервером и обновляем продукты
  var getProducts = function(obj, callback) {
    $.ajax({
      url: path,
      type: 'get',
      dataType: 'html',
      data: obj
  }).done(function(html) {
      var data = $(html).find(self.collectionContainer).html(),
          paginationContainer = $(html).find(self.paginationContainer).html();
      $(self.collectionContainer).html(data);
      $(self.paginationContainer).html(paginationContainer);
      if (callback != undefined) callback();
      self.preloader.hide();
    })
  }
  
  // получаем набор текущих параметров
  var getParams = function() {
    if ( param > '' ) {
      var b = new Object();
      param = param.substring(1).split("&");
      for (var i = 0; i < param.length; i++) {
      c = param[i].split("=");
        b[c[0]] = c[1];
      }
      return b;
    } else {
      return false;
    }
  };

  init();
    
};