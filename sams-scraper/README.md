SAMS Scraper API
================

When in doubt, scrape the freaking HTML. This provides two methods:

```
var api = require('sams-scraper')(fetch_function);
```

So in the example case:

```
var api = require('../index')(require('isomorphic-fetch'));
```

```
api.search('pampers diapers', function(result) {
  console.log(result);
}, function(err) {
  console.log(err);
});
```

The result would be something like this:

```
[{ image: 'http://scene7.samsclub.com/is/image/samsclub/0003600043839_A?$img_size_233x233$',
    title: 'Huggies Little Snugglers Newborn Kit, N to 10 lbs. (128 ct.)',
    itemId: '513186',
    modelNum: '43850',
    stars: 3.5,
    reviews: 2,
    online: true,
    url: '/sams/huggies-nb-kit-128-count/prod17380209.ip?subscribe=true&xid=subscribe_search',
    freeShippig: true,
    price: 29.98 }, ...]
 ```

And:

```
api.get('/sams/huggies-nb-kit-128-count/prod17380209.ip?subscribe=true&xid=subscribe_search', function(result) {
  console.log(result);
}, function(err) {
  console.log(err);
});
```

The result is something like this:

```
{ description: '<p>When it comes to your newborn, only the best will do. These diapers have a&nbsp;GentleAbsorb* Liner with&nbsp;tiny, soft pillows that provide a cushiony layer of protection between your baby&#39;s skin and the mess. It draws more runny mess away than Pampers Swaddlers.&nbsp;<span style="font-size: 13px; line-height: 1.6em;">Our color-changing wetness indicator lets you know when your baby&#39;s diaper is ready to be changed.&nbsp;</span><span style="font-size: 13px; line-height: 1.6em;">Our gentle quilting and breathable outer cover help protect baby&#39;s newborn delicate skin.&nbsp;</span><span style="font-size: 13px; line-height: 1.6em;">It&#39;s perfectly shaped to protect healing belly-buttons.&nbsp;</span><span style="font-size: 13px; line-height: 1.6em;">Designed with a pocketed-back waistband to help keep the mess inside where it belongs.</span></p>\n\n<p><span style="font-size: 13px; line-height: 1.6em;">Sam&rsquo;s Club Exclusive Pack includes one-of-a-kind designer HUGGIES&reg; Baby Wipes Clutch &lsquo;N Clean.</span></p>\n',
  image: 'http://scene7.samsclub.com/is/image/samsclub/0003600043839_A?$img_size_380x380$' }
```

Obviously this API is going to break if there are even
minor modifications to the HTML on the SAMS site. That being
said, it's not all regexs, we do a lot of it by CSS class
lookups. So it's not 100% fragile, more like 98.7% fragile.
