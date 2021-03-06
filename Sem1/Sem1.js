new Wotg.Plugins.Simple({
	title  : 'Sem1',
	version: '0.2.4'
}, function (plugin, events) {


    //новые картинки для индикации атаки и передвижения
    plugin.addImages({
		'sem1': 'semaphore/semafor5.png'
	});

    //картинка индикатора движения
    Wotg.Card.Markup.Battle.sprites.moveIndicator = [{
      "rect": [53, 42, 17, 30],  //36
      "shift": [0, 0]
    }];

    Wotg.Card.Markup.Battle.sprites.atkIndicator = [{
      "rect": [0, 39, 36, 39],      //red
      "shift": [0, 0]
    },
    {
      "rect": [0, 0, 36, 39],       //green
      "shift": [0, 0]
    },
    {
      "rect": [36, 0, 36, 39],     //grey
      "shift": [0, 0]
    }
    ];

    //добавляем индикатор движения на карту
    Wotg.Card.Markup.Battle.markup.children.push({
        "children": [],
        "id": "moveIndicator",
        "sprite": {
          "name": "moveIndicator",
          "texture": "bzz86:Sem1:sem1",
          "frame": 0
        },
        "rect": [37, 122, 17, 30]
      });

    //заменяем иконку ОМ
    plugin.markupChange(Wotg.Card.Markup.Battle)
    .change('Power', function(node){
         node.sprite = {
          "name": "atkIndicator",
          "texture": "bzz86:Sem1:sem1",
          "frame": 1
        }
    });



    /**
     * @namespace Wotg.Card.Views
     * @name Wotg.Card.Views.Battle
     * @extends Wotg.Card.View
     */
    plugin.refactor( 'Wotg.Card.Views.Battle', {

        atkIndicatorFrames : {
            opponent: 0,
            counter: 0,
            attack : 1,
            noAttack : 2,
            noCounter : 2
        },

        redraw: function () {
            var model = this.model;

            this.buffer.ctx.clearAll();
            this.lazyDraw(this.lazyArt);

            this.setText ('Title'       , Wotg.lang('cards.' + model.getProperty('idC') + '.short') );

            if (model.getProperty('increase')) {
                this.show('Increase');
                this.setValue('Increase',model.getProperty('increase'), true);
            } else {
                this.hide('Increase');
            }

            this.setValue('Power'       , model.getProperty('power'));
            this.setValue('Toughness'   , model.getProperty('toughness'));

            this.setFrame('NationFlag'  , this.flagFrames[model.getProperty('country')]);

            this.setFrame('Subtype'     , this.getSubtypeFrame(model.isOpponent));

            for (var i = 0; i <= 3; i++) {
                this.hide('Triggers.Trigger' + i);
            }
            if(model.getProperty('triggers')) {
                var triggers = model.getProperty('triggers'),
                    currentIndex = 0;
                for (var i = 0; i < triggers.length; i++) {
                    if (this.effectsFrames[triggers[i]] != undefined) {
                        this.showEffect(currentIndex, triggers[i]);
                        currentIndex++;
                    } else if (triggers[i].indexOf('burning') != -1){
                        this.showEffect(currentIndex, 'burning');
                        currentIndex++;
                    }
                }
            }
            if (model.isOpponent) {
                //контратака
                if (model.getProperty('cancounter')) {
                    this.setFrame('Power', this.atkIndicatorFrames['counter']);
                    this.dava.find('Power.Value').text.color = '#e54343';
                }else{
                    this.setFrame('Power', this.atkIndicatorFrames['noCounter']);
                    this.dava.find('Power.Value').text.color = 'rgba(191,206,191,1)';
                }
                //перемещение
                this.hide('moveIndicator');

                this.setFrame('Frames', 1);

            } else {
                //атака
                if (model.getProperty('untapped') && (model.effects.indexOf('t_cant_attack') < 0)) {
                    this.setFrame('Power', this.atkIndicatorFrames['attack']);
                    this.dava.find('Power.Value').text.color = 'rgba(110,207,72,1)';
                }else{
                    this.setFrame('Power', this.atkIndicatorFrames['noAttack']);
                    this.dava.find('Power.Value').text.color = 'rgba(191,206,191,1)';
                }
                //перемещение
                if( model.getProperty('movable') && (!model.getProperty('moved')) && (model.effects.indexOf('t_cant_move') < 0)){
                    this.show('moveIndicator');
                }else{
                    this.hide('moveIndicator');
                }

                this.setFrame('Frames', 0);
            }


            //скрываем стандартные значки
            this.hide('NoShoot');
            this.hide('NoMove');
            /*if (model.getProperty('untapped')) {
                this.hide('NoShoot');
            }  else {
                this.show('NoShoot');
            }
            if (!model.getProperty('moved')) {
                this.hide('NoMove');
            } else {
                this.show('NoMove');
            }*/

            this.hide('PremiumFrame');

            this.dava.redraw(this.buffer.ctx);

        }

    });


    //спрайт для штаба
    Wotg.Card.Markup.HqBattle.sprites.atkIndicator = [{
      "rect": [0, 39, 36, 39],      //red
      "shift": [0, 0]
    },
    {
      "rect": [0, 0, 36, 39],       //green
      "shift": [0, 0]
    },
    {
      "rect": [36, 0, 36, 39],     //grey
      "shift": [0, 0]
    }
    ];

    //заменяем иконку ОМ для штаба
    plugin.markupChange(Wotg.Card.Markup.HqBattle)
    .change('Power', function(node){
         node.sprite = {
          "name": "atkIndicator",
          "texture": "bzz86:Sem1:sem1",
          "frame": 1
        }
    });

    /**
     * @namespace Wotg.Card.Views
     * @name Wotg.Card.Views.HqBattle
     * @extends Wotg.Card.View
     */
    plugin.refactor( 'Wotg.Card.Views.HqBattle', {

        atkIndicatorFrames : {
            opponent : 0,
            attack : 1,
            noAttack : 2
        },

        redraw: function () {
            var model = this.model;

            this.buffer.ctx.clearAll();
            this.lazyDraw(this.lazyArt);

            this.setText ('Title'       , Wotg.lang('cards.' + model.getProperty('idC')+ '.short') );

            this.setValue('Increase'    , model.getProperty('increase'), true);
            this.setValue('Power'       , model.getProperty('power'));
            this.setValue('Toughness'   , model.getProperty('toughness'));

            //this.setFrame('NationFlag'  , this.flagFrames[proto.country]);
            this.hide('NationFlag');
            this.setFrame('Subtype'     , this.hqSubtypes[(model.isOpponent)?'enemy':'own'][model.getProperty('subtype')]);


            if (model.isOpponent) {
                this.setFrame('Power', this.atkIndicatorFrames['opponent']);
                this.dava.find('Power.Value').text.color = '#e54343';
            } else {
                if (model.getProperty('untapped') && (model.effects.indexOf('t_cant_attack') < 0)) {
                    this.setFrame('Power', this.atkIndicatorFrames['attack']);
                    this.dava.find('Power.Value').text.color = 'rgba(110,207,72,1)';
                }else{
                    this.setFrame('Power', this.atkIndicatorFrames['noAttack']);
                    this.dava.find('Power.Value').text.color = 'rgba(191,206,191,1)';
                }
            }

            this.dava.redraw(this.buffer.ctx);
        }

    });

});
