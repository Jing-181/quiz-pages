/* ===== 饮酒人格测试 - 核心逻辑 ===== */
;(function () {
  'use strict';

  // ── 维度定义 ─────────────────────────────────────────────
  const DIM_LABELS = ['品酒修养', '社交酒量', '微醺控制', '氛围追求', '尝鲜冒险', '独酌倾向', '豪放程度'];
  const DIM_COLORS = ['#8B2252', '#C8956C', '#B5C4B1', '#C4B7CB', '#C9A96E', '#6B8E9B', '#D4A0A0'];

  // ── 10 个人格类型 ────────────────────────────────────────
  const PERSONAS = [
    {
      id: 'sommelier', enName: 'SOMMELIER', name: '品酒大师', emoji: '\uD83C\uDF77', color: '#8B2252',
      brief: '闻一闻就知道年份和产区，舌头就是我的色谱仪。',
      desc: '你是酒桌上的权威。别人还在看酒标的时候，你已经通过色泽和香气判断出了这款酒的葡萄品种和产区。你的书架上摆满了葡萄酒专业书籍，手机里存着每一款喝过的酒的品鉴笔记。你能说出波尔多左岸和右岸的区别，知道黑皮诺最适合的醒酒时间。朋友买酒前一定会来问你，而你给出的建议从未失手。对你来说，喝酒不是消遣，是一门学问。',
      peaks: ['品酒修养 MAX', '氛围追求 HIGH', '微醺控制 HIGH'],
      attributes: [1.0, 0.0, 0.5, 0.8, 0.3, -0.2, -0.8]
    },
    {
      id: 'pub_philosopher', enName: 'PUB PHILOSOPHER', name: '酒馆哲学家', emoji: '\uD83D\uDCD6', color: '#6B8E9B',
      brief: '三杯下肚开始聊人生，微醺是最好的思考状态。',
      desc: '你是那种喝到微醺就开始输出人生哲理的人。你的最佳状态永远是第二杯之后、第四杯之前。在这个区间里，你能从一杯啤酒聊到宇宙的起源，从一首歌聊到存在的意义。你喝酒不是为了买醉，而是为了打开思维的边界。你最爱的场景是深夜的清吧，昏暗的灯光下和三两好友聊到天亮。酒是媒介，思考才是目的。',
      peaks: ['独酌倾向 HIGH', '微醺控制 HIGH', '氛围追求 MAX'],
      attributes: [0.3, -0.2, 0.8, 1.0, -0.3, 0.8, -0.5]
    },
    {
      id: 'party_animal', enName: 'PARTY ANIMAL', name: '派对酒神', emoji: '\uD83C\uDF89', color: '#D4A0A0',
      brief: '有酒的地方就是我的主场，干杯是唯一的语言。',
      desc: '你是每场聚会的灵魂人物。你的出场总是自带一瓶酒，而你的离开总是被人抬出去的。你喝酒从来不看酒标，只看杯子是不是满的。你的朋友圈里充满了碰杯和干杯的照片，评论区永远在问"昨晚到底喝了多少"。你认识酒吧里所有的调酒师，每个夜店保安都认识你。你的人生信条是：今朝有酒今朝醉，明天的事明天再说。',
      peaks: ['社交酒量 MAX', '豪放程度 MAX', '微醺控制 LOW'],
      attributes: [-0.3, 1.0, -1.0, 0.3, 0.0, -1.0, 1.0]
    },
    {
      id: 'home_sipper', enName: 'HOME SIPPER', name: '窝家独酌', emoji: '\uD83D\uDECB\uFE0F', color: '#C8956C',
      brief: '一个人一杯酒一部电影，这就是完美夜晚。',
      desc: '你对喝酒的理解是私密的、安静的、属于自己的。你最爱的饮酒场景是家里的沙发，一部好电影，一杯好酒，不需要任何人。你会在网上认真研究酒款评价才下单，收到酒后像拆礼物一样开心。你的酒柜不大但每瓶都是精挑细选。你不排斥社交饮酒，但内心深处，最享受的还是一个人安静地品一杯。',
      peaks: ['独酌倾向 MAX', '品酒修养 HIGH', '氛围追求 HIGH'],
      attributes: [0.5, -0.8, 0.5, 0.8, 0.0, 1.0, -0.5]
    },
    {
      id: 'cocktail_artist', enName: 'MIXOLOGIST', name: '调酒艺术家', emoji: '\uD83C\uDF78', color: '#C4B7CB',
      brief: '鸡尾酒是液体艺术，每一杯都是我的作品。',
      desc: '你对鸡尾酒有着近乎偏执的热爱。你的家里有一个专业调酒台，摇酒壶、量酒器、滤冰器一应俱全。你能背出经典鸡尾酒的配方，也喜欢自己创造新的搭配。你对每一款基酒的风味特征了如指掌，知道什么柑橘配什么金酒。你的朋友圈里全是精心调制的鸡尾酒照片，配色和构图堪比专业摄影。对你来说，调酒是一种创作。',
      peaks: ['品酒修养 MAX', '氛围追求 MAX', '尝鲜冒险 HIGH'],
      attributes: [1.0, 0.3, 0.3, 1.0, 0.8, -0.3, -0.5]
    },
    {
      id: 'beer_buddy', enName: 'BEER BUDDY', name: '啤酒搭子', emoji: '\uD83C\uDF7A', color: '#C9A96E',
      brief: '什么精酿IPA世涛，能一起喝的就是好酒。',
      desc: '你是朋友圈里最靠谱的酒搭子。你不会一个人喝闷酒，但只要有人约，你随叫随到。你对酒没有太多讲究，啤酒是你最忠实的朋友——便宜、好喝、容易买到。但你也在慢慢进化，从工业啤酒到精酿，从拉格到IPA，你的味蕾正在被打开。你最在意的不是喝什么，而是和谁一起喝。酒是借口，相聚才是意义。',
      peaks: ['社交酒量 MAX', '豪放程度 HIGH', '独酌倾向 LOW'],
      attributes: [-0.5, 1.0, 0.0, -0.3, 0.0, -0.8, 0.5]
    },
    {
      id: 'wine_romantic', enName: 'WINE ROMANTIC', name: '浪漫品酒人', emoji: '\uD83C\uDF39', color: '#B5495B',
      brief: '红酒配烛光，微醺配情话，仪式感不能少。',
      desc: '你把每一次饮酒都变成了一场仪式。你会为一杯酒搭配合适的杯子、合适的温度、合适的灯光甚至合适的音乐。你最爱红酒，因为红酒自带浪漫属性。你的约会必备清单里一定有一瓶好酒。你拍照时一定要把酒杯和背景搭配好，滤镜选最暖的那一个。你相信微醺时的自己最有魅力，而一杯好酒就是最好的社交润滑剂。',
      peaks: ['氛围追求 MAX', '品酒修养 HIGH', '社交酒量 HIGH'],
      attributes: [0.5, 0.5, 0.3, 1.0, 0.0, 0.0, -0.3]
    },
    {
      id: 'adventure_drinker', enName: 'DRINKPLORER', name: '酒界探险家', emoji: '\uD83E\uDDED', color: '#B5C4B1',
      brief: '没喝过的酒就是我的下一个目标。',
      desc: '你的酒柜是一个联合国——日本清酒、墨西哥龙舌兰、法国干邑、中国白酒、韩国烧酒应有尽有。你每到一个新地方，第一件事就是找当地特色酒。你愿意为了一瓶没喝过的酒驱车一小时，也愿意在网上海淘小众酒款。你的喝酒笔记比旅行日记还详细。你的人生目标之一是喝遍全世界的酒。',
      peaks: ['尝鲜冒险 MAX', '品酒修养 HIGH', '豪放程度 MEDIUM'],
      attributes: [0.8, -0.3, 0.0, 0.3, 1.0, 0.3, 0.3]
    },
    {
      id: 'casual_sipper', enName: 'CASUAL SIPPER', name: '随缘小酌', emoji: '\u2601\uFE0F', color: '#A89090',
      brief: '喝酒嘛开心就好，不讲究那么多。',
      desc: '你对酒的态度非常随性。有人递什么就喝什么，开心了多喝两杯，不想喝就喝果汁。你分不清各种酒的区别，也不太想分清。你喝酒的频率完全取决于心情和社交场合，不会主动买酒但也不会拒绝。你觉得那些品酒术语太复杂了，"好喝"和"不好喝"就是你全部的评价体系。你的酒量是个谜——有时候一杯就倒，有时候千杯不醉。',
      peaks: ['微醺控制 HIGH', '独酌倾向 MEDIUM', '豪放程度 LOW'],
      attributes: [-0.8, 0.0, 0.5, -0.5, -0.5, 0.3, -0.3]
    },
    {
      id: 'spirits_connoisseur', enName: 'SPIRITS MASTER', name: '烈酒鉴赏家', emoji: '\uD83E\uDD43', color: '#5C1A33',
      brief: '威士忌纯饮不加冰，白酒品鉴一口入魂。',
      desc: '你是烈酒世界的行家。你的酒柜里没有啤酒和果酒，只有威士忌、白兰地、伏特加、金酒和白酒。你喝威士忌从不加冰，因为冰块会"锁住"风味。你能品出一款白酒的窖藏年份，也能分辨单一麦芽和调和威士忌的区别。你喝酒的方式是品，不是饮——一小口含在嘴里，感受它在舌尖的变化。你欣赏烈酒的直率和力量。',
      peaks: ['品酒修养 MAX', '独酌倾向 HIGH', '豪放程度 MEDIUM'],
      attributes: [1.0, -0.5, 0.5, 0.3, 0.5, 0.5, 0.0]
    }
  ];

  // ── 15 道题目 ────────────────────────────────────────────
  const ALL_Q = [
    {
      mod: '模块一\u00B7饮酒偏好', text: '你最喜欢的饮酒场景是？', hint: '独处还是热闹？',
      opts: [
        { t: '家里沙发上，一个人安静地品一杯', s: [0.5, -1.0, 0.5, 0.3, 0.0, 1.0, -0.5] },
        { t: '热闹的酒吧，和朋友们举杯畅饮', s: [-0.3, 1.0, -0.5, 0.3, 0.0, -1.0, 0.5] },
        { t: '烛光晚餐，配上好酒和好气氛', s: [0.3, 0.5, 0.3, 1.0, 0.0, 0.0, -0.3] },
        { t: '户外露营，星空下围坐喝酒聊天', s: [0.0, 0.5, 0.0, 0.5, 0.5, 0.0, 0.3] }
      ]
    },
    {
      mod: '模块一\u00B7饮酒偏好', text: '如果今晚只能喝一种酒，你会选？', hint: '你的灵魂酒款是？',
      opts: [
        { t: '一杯精心挑选的红酒，慢慢品味', s: [0.8, -0.3, 0.5, 0.5, 0.0, 0.3, -0.5] },
        { t: '冰镇啤酒，大口喝才过瘾', s: [-0.5, 0.8, -0.3, -0.3, -0.3, -0.5, 0.8] },
        { t: '一杯经典鸡尾酒，仪式感拉满', s: [0.5, 0.3, 0.3, 1.0, 0.5, -0.3, -0.3] },
        { t: '威士忌纯饮，感受烈酒的灵魂', s: [1.0, -0.5, 0.5, 0.0, 0.3, 0.5, 0.0] }
      ]
    },
    {
      mod: '模块一\u00B7饮酒偏好', text: '朋友聚会时，你通常扮演什么角色？', hint: '酒桌上的你是哪种人？',
      opts: [
        { t: '组局的人，没有我这场局组不起来', s: [0.0, 1.0, -0.3, 0.3, 0.0, -0.5, 0.5] },
        { t: '气氛担当，喝到微醺就开始讲故事', s: [-0.3, 0.5, 0.0, 0.5, -0.3, 0.0, 0.3] },
        { t: '安静喝酒的那位，偶尔插两句金句', s: [0.3, -0.5, 0.5, 0.0, 0.0, 0.8, -0.5] },
        { t: '到处串桌社交的蝴蝶，每桌都要敬一杯', s: [-0.3, 1.0, -0.5, 0.5, 0.3, -0.8, 0.5] }
      ]
    },
    {
      mod: '模块二\u00B7饮酒习惯', text: '你对"喝酒"这件事的态度是？', hint: '你是哪种喝酒哲学？',
      opts: [
        { t: '喝酒是一门艺术，值得认真对待', s: [1.0, -0.3, 0.5, 0.8, 0.3, 0.0, -0.8] },
        { t: '喝酒就是为了开心，不用那么认真', s: [-0.8, 0.3, 0.0, -0.5, -0.3, 0.0, 0.0] },
        { t: '酒是社交工具，有它在气氛就不一样', s: [0.0, 0.8, -0.3, 0.5, 0.0, -0.5, 0.3] },
        { t: '喝酒是一种探索，每种酒都是新世界', s: [0.5, -0.3, 0.0, 0.0, 1.0, 0.3, 0.0] }
      ]
    },
    {
      mod: '模块二\u00B7饮酒习惯', text: '你去酒吧/酒馆最关注的是？', hint: '什么最重要？',
      opts: [
        { t: '酒单！有没有特色酒款和隐藏菜单', s: [0.8, 0.0, 0.3, 0.3, 1.0, -0.3, -0.3] },
        { t: '氛围！灯光音乐装修必须是我的菜', s: [0.0, 0.3, 0.0, 1.0, 0.0, 0.0, 0.0] },
        { t: '人多不多！热闹才是王道', s: [-0.3, 1.0, -0.5, 0.3, 0.0, -1.0, 0.8] },
        { t: '有没有安静角落，能坐下来好好说话', s: [0.3, -0.3, 0.5, 0.5, 0.0, 0.8, -0.5] }
      ]
    },
    {
      mod: '模块二\u00B7饮酒习惯', text: '你喝酒时的"最佳搭档"是？', hint: '酒和什么最配？',
      opts: [
        { t: '一部好电影或一本好书', s: [0.3, -0.8, 0.5, 0.3, 0.0, 1.0, -0.3] },
        { t: '三五好友，越聊越嗨', s: [-0.3, 1.0, 0.0, 0.3, 0.0, -0.5, 0.3] },
        { t: '好吃的下酒菜，花生毛豆是灵魂', s: [-0.3, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5] },
        { t: '音乐！没有背景音乐的酒是没有灵魂的', s: [0.0, 0.0, 0.0, 1.0, 0.3, 0.3, 0.0] }
      ]
    },
    {
      mod: '模块三\u00B7品酒知识', text: '在酒桌上，你最常做的事是？', hint: '你的酒桌行为模式？',
      opts: [
        { t: '给所有人讲这款酒的故事和产地', s: [1.0, 0.3, 0.0, 0.3, 0.5, -0.3, -0.5] },
        { t: '主动给大家倒酒，照顾每个人的杯子', s: [0.0, 0.8, 0.5, 0.3, 0.0, -0.3, 0.0] },
        { t: '默默品酒，偶尔评价一句"这杯不错"', s: [0.5, -0.5, 0.8, 0.0, 0.0, 0.5, -0.5] },
        { t: '提议干杯！"来来来，走一个！"', s: [-0.5, 1.0, -0.8, 0.3, -0.3, -0.5, 1.0] }
      ]
    },
    {
      mod: '模块三\u00B7品酒知识', text: '你买酒时最看重什么？', hint: '什么因素决定你的购买？',
      opts: [
        { t: '产区、年份、评分——专业参数最重要', s: [1.0, -0.5, 0.3, 0.0, 0.5, 0.0, -0.5] },
        { t: '包装好看！颜值即正义', s: [-0.5, 0.3, 0.0, 0.8, 0.0, 0.0, 0.0] },
        { t: '朋友推荐或网上好评，跟着买不会错', s: [-0.3, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3] },
        { t: '没喝过的！新的就是好的', s: [0.0, -0.3, 0.0, 0.0, 1.0, 0.0, 0.3] }
      ]
    },
    {
      mod: '模块三\u00B7品酒知识', text: '如果有人请你品鉴一款酒，你会？', hint: '你的品酒方式？',
      opts: [
        { t: '标准品鉴流程：观色、闻香、品味、回味', s: [1.0, -0.5, 0.8, 0.3, 0.3, 0.3, -0.8] },
        { t: '一口闷！"好喝！再来一杯！"', s: [-1.0, 0.5, -1.0, 0.0, -0.5, -0.3, 1.0] },
        { t: '小口慢饮，感受一下但说不出什么专业术语', s: [0.0, 0.0, 0.5, 0.3, 0.0, 0.3, -0.3] },
        { t: '先拍照发朋友圈，然后再喝', s: [-0.3, 0.8, -0.3, 0.8, 0.0, -0.5, 0.0] }
      ]
    },
    {
      mod: '模块四\u00B7社交与场景', text: '你的"微醺状态"通常是什么样的？', hint: '微醺时的你？',
      opts: [
        { t: '话变多了，开始给每个人讲人生道理', s: [0.0, 0.5, 0.0, 0.3, -0.3, 0.0, 0.3] },
        { t: '脸红红的，安静地坐在角落傻笑', s: [-0.3, -0.5, 0.8, 0.0, 0.0, 0.5, -0.5] },
        { t: '变身社交达人，和谁都能聊起来', s: [-0.3, 1.0, -0.5, 0.5, 0.0, -0.8, 0.5] },
        { t: '开始认真品酒，觉得这时候味觉最敏锐', s: [0.8, -0.5, 0.5, 0.3, 0.3, 0.5, -0.5] }
      ]
    },
    {
      mod: '模块四\u00B7社交与场景', text: '你喝酒的频率大概是？', hint: '你多久喝一次？',
      opts: [
        { t: '几乎每天，晚餐配一杯是日常', s: [0.5, -0.3, 0.5, 0.3, 0.0, 0.5, -0.3] },
        { t: '每周1-2次，和朋友约酒是固定节目', s: [0.0, 0.8, 0.3, 0.0, 0.0, -0.5, 0.3] },
        { t: '看心情，想喝就喝不喝也不馋', s: [-0.3, 0.0, 0.5, -0.3, -0.3, 0.3, -0.3] },
        { t: '有局才喝，自己基本不会主动喝', s: [-0.5, 0.5, 0.0, -0.3, -0.3, -0.5, 0.0] }
      ]
    },
    {
      mod: '模块四\u00B7社交与场景', text: '在酒桌上遇到不认识的酒，你会？', hint: '面对未知酒款？',
      opts: [
        { t: '兴奋！终于可以尝尝新东西了', s: [0.3, 0.0, 0.0, 0.0, 1.0, 0.0, 0.3] },
        { t: '先闻一闻看一看，分析一下再喝', s: [1.0, -0.3, 0.5, 0.0, 0.3, 0.3, -0.5] },
        { t: '问一圈这是什么酒，了解一下再喝', s: [0.0, 0.3, 0.3, 0.0, 0.3, 0.0, 0.0] },
        { t: '不问，直接喝！管它是什么', s: [-0.5, 0.5, -0.3, 0.0, -0.3, -0.3, 0.8] }
      ]
    },
    {
      mod: '模块五\u00B7态度与哲学', text: '你对"断片"（喝醉失忆）这件事怎么看？', hint: '你对喝醉的态度？',
      opts: [
        { t: '绝对不行！喝酒要有品位，不能失态', s: [0.5, -0.3, 1.0, 0.0, 0.0, 0.0, -1.0] },
        { t: '偶尔一次没关系，人生嘛总要疯狂几回', s: [0.0, 0.5, -0.5, 0.3, 0.3, -0.3, 0.5] },
        { t: '断片说明昨晚一定很开心！', s: [-0.5, 0.8, -1.0, 0.0, 0.0, -0.5, 1.0] },
        { t: '没断过片，我喝酒很有分寸的', s: [0.3, -0.3, 0.8, 0.0, 0.0, 0.3, -0.5] }
      ]
    },
    {
      mod: '模块五\u00B7态度与哲学', text: '如果用一句话形容你的饮酒哲学，是？', hint: '最后一题前的灵魂拷问～',
      opts: [
        { t: '"酒逢知己千杯少，品酒品的是人生"', s: [0.3, 0.5, 0.3, 0.5, 0.0, 0.0, 0.0] },
        { t: '"好酒不贵，贵酒不好，自己觉得好才是好"', s: [-0.5, 0.0, 0.5, -0.3, -0.3, 0.3, -0.3] },
        { t: '"人生苦短，及时行乐，干杯！"', s: [-0.3, 0.8, -0.8, 0.3, 0.0, -0.5, 1.0] },
        { t: '"每一杯酒都是一次与酿酒师的对话"', s: [1.0, -0.5, 0.5, 0.5, 0.5, 0.3, -0.5] }
      ]
    },
    {
      mod: '模块五\u00B7态度与哲学', text: '如果让你开一家酒馆，它会是什么样的？', hint: '终极梦想酒馆～',
      opts: [
        { t: '藏酒丰富的专业酒窖，只招待懂酒的人', s: [1.0, -0.8, 0.5, 0.5, 0.5, 0.5, -0.5] },
        { t: '热闹的精酿啤酒吧，有驻唱和桌游', s: [-0.5, 1.0, -0.3, 0.5, 0.0, -1.0, 0.5] },
        { t: '温馨的清吧，爵士乐和昏暗灯光', s: [0.3, -0.3, 0.5, 1.0, 0.0, 0.5, -0.3] },
        { t: '全球美酒集合店，每个角落都是不同国家的酒', s: [0.5, 0.0, 0.0, 0.3, 1.0, 0.0, 0.0] }
      ]
    }
  ];

  // ── 加载页数据 ───────────────────────────────────────────
  const LM = ['正在分析你的饮酒DNA', '正在鉴定品酒修养', '正在计算微醺指数', '正在扫描酒量基因', '正在评估豪放程度'];
  const LF = ['\uD83C\uDF77', '\uD83E\uDD43', '\uD83C\uDF78', '\uD83C\uDF7A', '\uD83E\uDDED'];

  // ── 里程碑数据 ───────────────────────────────────────────
  const MILESTONES = [
    { at: 0.25, text: '\uD83C\uDF7B 干杯！继续～' },
    { at: 0.50, text: '\uD83C\uDF77 微醺中...状态正好！' },
    { at: 0.75, text: '\uD83E\uDD42 快到终点了，最后一杯！' }
  ];

  // ── 巅峰属性标签渐变色 ──────────────────────────────────
  const tagColors = [
    'linear-gradient(135deg, #8B2252, #B5495B)',
    'linear-gradient(135deg, #C8956C, #DEB887)',
    'linear-gradient(135deg, #C9A96E, #E8D5A3)',
    'linear-gradient(135deg, #C4B7CB, #D4C0D8)',
    'linear-gradient(135deg, #B5C4B1, #C8D5C4)',
    'linear-gradient(135deg, #6B8E9B, #8BA8B3)',
    'linear-gradient(135deg, #D4A0A0, #E0B8B8)'
  ];

  // ── 气泡粒子颜色 ────────────────────────────────────────
  const BUBBLE_COLORS = ['#8B2252', '#C8956C', '#C9A96E', '#D4A0A0', '#C4B7CB', '#B5C4B1'];

  // ── 状态管理 ─────────────────────────────────────────────
  let questions = [], step = 0, history = [], tmpScore = null, canUndo = false, lTmr = null;

  // ── 屏幕切换 ─────────────────────────────────────────────
  function show(id) {
    document.querySelectorAll('.sc').forEach(function (el) {
      el.classList.toggle('hidden', el.id !== id);
    });
  }

  // ── Fisher-Yates 洗牌 ────────────────────────────────────
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ── 开始测试 ─────────────────────────────────────────────
  function startQuiz() {
    SFX.init();
    SFX.confirm();
    SFX.startBGM();
    questions = shuffle(ALL_Q);
    step = 0;
    history = [];
    tmpScore = null;
    canUndo = false;
    show('sQuiz');
    renderQ();
  }

  // ── 渲染题目 ─────────────────────────────────────────────
  function renderQ() {
    var q = questions[step];
    var n = step + 1;
    var tot = questions.length;
    var isLast = step === tot - 1;

    // 进度条
    var progressBar = document.querySelector('.q-progress-bar');
    if (progressBar) progressBar.style.width = (n / tot * 100) + '%';

    // 模块名
    var modEl = document.querySelector('.q-mod');
    if (modEl) modEl.textContent = q.mod;

    // 问题文本
    var textEl = document.querySelector('.q-text');
    if (textEl) textEl.textContent = q.text;

    // 提示
    var hintEl = document.querySelector('.q-hint');
    if (hintEl) {
      hintEl.textContent = q.hint || '';
      hintEl.style.opacity = '0';
      hintEl.style.transform = 'translateY(8px)';
      setTimeout(function () {
        hintEl.style.opacity = '1';
        hintEl.style.transform = 'translateY(0)';
      }, 300);
    }

    // 选项
    tmpScore = null;
    var optsEl = document.querySelector('.q-opts');
    if (optsEl) {
      optsEl.innerHTML = '';
      var LBL = ['A', 'B', 'C', 'D'];
      q.opts.forEach(function (opt, i) {
        var d = document.createElement('div');
        d.className = 'opt';
        d.textContent = LBL[i] + '. ' + opt.t;
        d.addEventListener('click', function () {
          SFX.click();
          spawnBubble(d);
          optsEl.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
          d.classList.add('sel');
          tmpScore = opt.s;
          var btnNext = document.querySelector('.btn-next');
          if (btnNext) btnNext.disabled = false;
        });
        optsEl.appendChild(d);
        // Staggered fadeSlideUp animation
        setTimeout(function () { d.classList.add('show'); }, 80 + i * 80);
      });
    }

    // 导航按钮
    var btnBack = document.querySelector('.btn-back');
    if (btnBack) btnBack.style.display = (step > 0 && canUndo) ? '' : 'none';

    var btnNext = document.querySelector('.btn-next');
    if (btnNext) {
      btnNext.disabled = true;
      btnNext.textContent = isLast ? '揭晓结果' : '下一题';
    }
  }

  // ── 下一题 ───────────────────────────────────────────────
  function goNext() {
    if (!tmpScore) return;
    SFX.confirm();
    history.push(tmpScore);
    canUndo = true;

    // 检查里程碑
    var pct = (step + 1) / questions.length;
    for (var i = 0; i < MILESTONES.length; i++) {
      if (Math.abs(pct - MILESTONES[i].at) < 0.01) {
        showMilestone(MILESTONES[i].text);
        break;
      }
    }

    if (step < questions.length - 1) {
      step++;
      renderQ();
    } else {
      runLoad();
    }
  }

  // ── 里程碑庆祝 ───────────────────────────────────────────
  function showMilestone(text) {
    var el = document.createElement('div');
    el.className = 'milestone';
    el.textContent = text;
    var quizBody = document.querySelector('.q-body');
    if (quizBody) quizBody.appendChild(el);
    setTimeout(function () { el.remove(); }, 1600);
  }

  // ── 回退 ─────────────────────────────────────────────────
  function goBack() {
    if (step > 0 && canUndo) {
      SFX.click();
      history.pop();
      step--;
      canUndo = false;
      renderQ();
    }
  }

  // ── 加载页 ───────────────────────────────────────────────
  function runLoad() {
    show('sLoad');
    var mi = 0;
    var mE = document.querySelector('.load-text');
    var fE = document.querySelector('.load-emoji');

    var bump = function () {
      if (mE) mE.style.opacity = '0';
      setTimeout(function () {
        mi = (mi + 1) % LM.length;
        if (mE) mE.textContent = LM[mi];
        if (fE) fE.textContent = LF[mi % LF.length];
        if (mE) mE.style.opacity = '1';
      }, 200);
    };

    lTmr = setInterval(bump, 1200);
    setTimeout(function () {
      clearInterval(lTmr);
      calcResult();
    }, 2800);
  }

  // ── 计算结果 ─────────────────────────────────────────────
  function calcResult() {
    var tot = [0, 0, 0, 0, 0, 0, 0];
    history.forEach(function (s) {
      s.forEach(function (v, i) { tot[i] += v; });
    });

    // 归一化
    var norm = tot.map(function (v) {
      var clamped = Math.max(-12, Math.min(12, v));
      return clamped / 12;
    });

    // 曼哈顿距离排序
    var sc = PERSONAS.map(function (p) {
      var m = 0;
      norm.forEach(function (v, i) { m += Math.abs(v - p.attributes[i]); });
      return { id: p.id, m: m, persona: p };
    });
    sc.sort(function (a, b) { return a.m - b.m; });

    // 欧几里得距离 tiebreak
    var minM = sc[0].m;
    var cands = sc.filter(function (p) { return p.m === minM; });
    if (cands.length > 1) {
      cands = cands.map(function (p) {
        var e = 0;
        norm.forEach(function (v, i) { e += Math.pow(v - p.persona.attributes[i], 2); });
        return { id: p.id, m: p.m, e: Math.sqrt(e), persona: p.persona };
      });
      cands.sort(function (a, b) { return a.e - b.e; });
    }

    var winner = cands[0].persona;
    renderResult(winner, norm);
    SFX.reveal();
    show('sResult');

    var rScr = document.querySelector('.rScr');
    if (rScr) rScr.scrollTop = 0;

    // 水彩飞溅特效
    setTimeout(function () { burstWatercolor(); }, 400);
  }

  // ── 渲染结果 ─────────────────────────────────────────────
  function renderResult(r, norm) {
    // Hero 背景渐变
    var rHero = document.querySelector('.rHero');
    if (rHero) {
      rHero.style.background = 'linear-gradient(180deg, ' + r.color + '15 0%, transparent 100%)';
    }

    // 基本信息
    var rEmoji = document.querySelector('.rEmoji');
    if (rEmoji) rEmoji.textContent = r.emoji;

    var rEn = document.querySelector('.rEn');
    if (rEn) rEn.textContent = r.enName;

    var rNm = document.querySelector('.rNm');
    if (rNm) rNm.textContent = r.name;

    var rBf = document.querySelector('.rBf');
    if (rBf) rBf.textContent = r.brief;

    // 深度解析
    var rDes = document.querySelector('.rDes');
    if (rDes) rDes.textContent = r.desc;

    // 巅峰属性标签
    var rPk = document.querySelector('.pTags');
    if (rPk) {
      rPk.innerHTML = r.peaks.map(function (p, i) {
        return '<span class="pTag" style="background:' + tagColors[i % tagColors.length] + '">' + p + '</span>';
      }).join('');
    }

    // 7 维度条形图
    var rDm = document.querySelector('.dBars');
    if (rDm) {
      rDm.innerHTML = DIM_LABELS.map(function (lbl, i) {
        var pct = Math.round((norm[i] + 1) / 2 * 100);
        return '<div class="dRow">' +
          '<span class="dLbl">' + lbl + '</span>' +
          '<div class="dTrk"><div class="dFil" style="width:0%;background:' + DIM_COLORS[i] + '" data-p="' + pct + '"></div></div>' +
          '<span class="dVal">' + pct + '</span>' +
          '</div>';
      }).join('');
    }

    // 延迟触发条形图动画
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll('.dFil[data-p]').forEach(function (el) {
          el.style.width = el.getAttribute('data-p') + '%';
        });
      });
    });
  }

  // ── 重置测试 ─────────────────────────────────────────────
  function resetQuiz() {
    SFX.confirm();
    step = 0;
    history = [];
    tmpScore = null;
    canUndo = false;
    questions = [];
    show('sStart');
  }

  // ── 酒滴气泡粒子 ────────────────────────────────────────
  function spawnBubble(el) {
    var rect = el.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    for (var i = 0; i < 4; i++) {
      var d = document.createElement('div');
      d.className = 'bubble';
      var size = 8 + Math.random() * 14;
      d.style.width = size + 'px';
      d.style.height = size + 'px';
      d.style.background = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      d.style.opacity = '0.5';

      // 随机圆形或水滴形 border-radius
      if (Math.random() > 0.5) {
        d.style.borderRadius = '50%';
      } else {
        d.style.borderRadius = (30 + Math.random() * 40) + '% ' + (30 + Math.random() * 40) + '% ' + (30 + Math.random() * 40) + '% ' + (30 + Math.random() * 40) + '%';
      }

      var dx = (Math.random() - 0.5) * 60;
      var dy = -(20 + Math.random() * 50);
      var rot = (Math.random() - 0.5) * 120;

      d.style.setProperty('--dx', dx + 'px');
      d.style.setProperty('--dy', dy + 'px');
      d.style.setProperty('--rot', rot + 'deg');
      d.style.left = (cx + (Math.random() - 0.5) * 30) + 'px';
      d.style.top = cy + 'px';

      document.body.appendChild(d);
      setTimeout(function () { d.remove(); }, 900);
    }
  }

  // ── 水彩飞溅特效 ─────────────────────────────────────────
  function burstWatercolor() {
    var colors = ['#8B2252', '#C8956C', '#C9A96E', '#D4A0A0', '#C4B7CB', '#B5C4B1', '#B5495B'];
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;

    for (var i = 0; i < 25; i++) {
      var el = document.createElement('div');
      el.className = 'wc-splash';
      var size = 20 + Math.random() * 40;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = '0.6';

      // 不规则色块 border-radius
      el.style.borderRadius =
        (30 + Math.random() * 40) + '% ' +
        (30 + Math.random() * 40) + '% ' +
        (30 + Math.random() * 40) + '% ' +
        (30 + Math.random() * 40) + '%';

      var angle = (Math.PI * 2 / 25) * i + (Math.random() - 0.5) * 0.4;
      var dist = 60 + Math.random() * 140;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 40;
      var rot = (Math.random() - 0.5) * 540;

      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--dy', dy + 'px');
      el.style.setProperty('--rot', rot + 'deg');
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';

      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 1300);
    }
  }

  // ── 背景气泡 ─────────────────────────────────────────────
  function createBgBubbles() {
    var app = document.getElementById('app');
    if (!app) return;
    var count = 6 + Math.floor(Math.random() * 3);
    for (var i = 0; i < count; i++) {
      var b = document.createElement('div');
      b.className = 'bg-bubble';
      var size = 12 + Math.random() * 24;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.background = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      b.style.left = (Math.random() * 100) + '%';
      b.style.bottom = '-' + size + 'px';
      b.style.animationDuration = (8 + Math.random() * 12) + 's';
      b.style.animationDelay = (Math.random() * 10) + 's';
      app.appendChild(b);
    }
  }

  // ── DOM Ready ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    createBgBubbles();

    // 绑定按钮事件
    var btnStart = document.querySelector('.btn-start');
    if (btnStart) btnStart.addEventListener('click', startQuiz);

    var btnNext = document.querySelector('.btn-next');
    if (btnNext) btnNext.addEventListener('click', goNext);

    var btnBack = document.querySelector('.btn-back');
    if (btnBack) btnBack.addEventListener('click', goBack);

    var btnRetry = document.querySelector('.btn-retry');
    if (btnRetry) btnRetry.addEventListener('click', resetQuiz);
  });

})();
