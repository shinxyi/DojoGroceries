var cheerio = require('cheerio');

function _get(_fetch, url, success, failure) {
  _fetch('http://www.samsclub.com/' + url).then(function(data) {
    return data.text();
  }).then(function(text) {
    var $ = cheerio.load(text);
    var item = {};
    $('meta').each(function(i, el) {
      if($(el).attr('name') === 'description') {
        item.description = $(el).attr('content');
      }
    });
    $('#plImageHolder img').each(function(i, el) {
      item.image = $(el).attr('src');
    });
    success(item);
  }).catch(function(error) {
    failure(error);
  });
}

function _search(_fetch, term, success, failure) {
  var url = 'http://www.samsclub.com/sams/search/searchResults.jsp?searchCategoryId=all&searchTerm=' + escape(term);
  let data = null;
  _fetch(url).then(function(tdata) {
	data = tdata;
	return tdata.text()
  }).then(function(text) {
    var $ = cheerio.load(text);
    var items = [];

	if(data.url != url) {
		console.log("WE GOT REDIRECTED");
		product = {};
		$('#plImageHolder img').each(function(j, el) {
			product.image = $(el).attr('src');
		});
		$('.prodTitle h1 span').each(function(j, el) {
			product.title = $(el).text().trim('\n ');
		});
		$('.itemId span').each(function(j, el) {
			product.itemid = $(el).text().trim('\n ');
		});
		$('.pricingInfo .hidden').each(function(j, el) {
			product.price = $(el).text().trim('\n ');
		});
		$('.modelNum').each(function(j, el) {
			product.modelNum = $(el).text().trim('\n ');
		});
		$('.long-desc').each(function(j, el) {
			product.description = $(el).text().trim('\n ');
		});
		product.category = [];
		$('.breadcrumb-child a').each(function(j, el) {
			product.category.push($(el).text().trim('\n '));
		});
		product.url = data.url
		success(product)
		return;
	}

    $('.products .sc-product-card').each(function(i, item) {
	  console.log('i: ', i, 'item:', item);
      var product = {};
      $('.cardProdImg', item).each(function(j, el) {
        product.image = $(el).attr('data-src');
      });
      $('.sc-text-body', item).each(function(j, el) {
        product.title = $(el).text().replace(/\n/, '').replace(/^\s+/, '').replace(/\s+$/, '');
      });
      $('.hubbleTrackRecord', item).each(function(j, el) {
        product.itemId = $(el).attr('data-product-id').slice(4)
      });
      $('.list-view-modelnumber', item).each(function(j, el) {
		t = $(el).text().replace("Model #: ", "");
        if(t.length == 0) {
			t = null;
		}
		product.modelNum = t
      });
      $('.sc-rating', item).each(function(j, el) {
		//console.log("ITEM: ", item);
        //product.reviews = parseInt(reviews);
      });
	  /*
      $('.flag_bestSeller', item).each(function(j, el) {
        product.bestSeller = true;
      });
      $('.shelfchlOnline', item).each(function(j, el) {
        product.online = true;
      });
	  */
      $('a.cardProdLink', item).each(function(j, el) {
        product.url = $(el).attr('href');
      });
	  /*
      $('.flag_notitle_green', item).each(function(j, el) {
        product.freeShippig = $(el).text() === 'Free shipping';
      });
	  */
	  $('.sc-price .sc-dollars', item).each(function(j, el) {
		product.price = parseInt($(el).text());
	  })
	  $('.sc-price .sc-cents', item).each(function(j, el) {
		product.price += parseInt($(el).text())/100;
	  })
      items.push(product);
    });
    success(items);
  }).catch(function(error) {
    failure(error);
  });
}

module.exports = function(fetch) {
  return {
    search: function(term, success, failure) { return _search(fetch, term, success, failure) },
    get: function(url, success, failure) { return _get(fetch, url, success, failure); }
  };
};

