new Wotg.Plugins.Simple({
	title  : 'BattleCardView',
	version: '0.2.4'
}, function (plugin, events) {

	events.add('initialize', function () {
		console.log('BattleCardView initialized');
	});

  

  var victimUrl = "http://forum.worldoftanks.ru/index.php?/user/dn-" + Wotg.battle()[victim].name + "-/";


  function reqListener () {
    console.log(this.responseText);
    
    if(this.responseText){
      var response = this;
      showSomeAva(response, that, showDefaultAva);
    }
    
    /*plugin.replaceImages({
  		'battle-avatar-' + Wotg.battle().player.country.toLowerCase(): 'battle/card-pack-own-m.png'
  	});*/
  }
  
  function showSomeAva(response, that, showDefaultAva) {
      var imgSrc = getForumAva(response);
      if (
          imgSrc === null ||
          imgSrc === 'http://forum.worldoftanks.ru/public/style_images/wg/profile/default_large.png' ||
          imgSrc === 'http://cdn-frm-eu.wargaming.net/wot/ru/4.1/style_images/wg/profile/default_large.png'
      ) {
          showDefaultAva(that);
      } else atom.ImagePreloader.run({
          victimAva: imgSrc
      }, function(images) {
          showForumAva(images, that);
      });
  }

  function getForumAva(response) {
      var dom = new DOMParser().parseFromString(response.responseText, "text/html");
      var imgNode = dom.getElementById('profile_photo');
      return imgNode ? imgNode.src : null;
  }

  function showForumAva(images, that) {
      var imgAva = images.get('victimAva');
      // Корретктное масштабирование, с сохранением пропорций и центрированием по горизонтали
      var w2h = imgAva.width / imgAva.height;
      var avaWidth, avaHeight, avaShift = 0;
      if (w2h < 1) {
          avaHeight = 72;
          avaWidth = Math.floor(imgAva.width * avaHeight / imgAva.height);
          avaShift = Math.floor((72 - avaWidth) / 2);
      } else {
          avaWidth = 72;
          avaHeight = Math.floor(imgAva.height * avaWidth / imgAva.width);
      }
      that.objects[victim].ava = new App.Light.Image(that.layer, {
          zIndex: 0,
          shape: new Rectangle(avaLeft[victim] + avaShift, that.coord[victim].ava.y, avaWidth, avaHeight),
          image: imgAva
      });
  }
  
  
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("get", victimUrl, false);
  oReq.send();
  
  

});
