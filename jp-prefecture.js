/*!
 * jp-prefecture
 * Utility library dealing with prefectures and regions in Japan.
 * @version 0.0.8
 * @license MIT
 * @author tsuyoshiwada
 * @url https://github.com/tsuyoshiwada/jp-prefecture
 */;(function(){
  "use strict";

  var VERSION = "0.0.8",
      jp,
      root = this,
      undefined,
      previousJpPrefecture = root.jpPrefecture,

      Type = {
        REGION: "region",
        PREF  : "pref"
      },

      // 区分は八地方区分を採用
      regions = [
        {id:1, name:"北海道", kana:"ホッカイドウ", en:"hokkaido", neighbor:[2]},
        {id:2, name:"東北",   kana:"トウホク",     en:"tohoku",   neighbor:[1]},
        {id:3, name:"関東",   kana:"カントウ",     en:"kanto",    neighbor:[2, 4]},
        {id:4, name:"中部",   kana:"チュウブ",     en:"chubu",    neighbor:[2, 3, 5]},
        {id:5, name:"近畿",   kana:"キンキ",       en:"kinki",    neighbor:[4, 6, 7]},
        {id:6, name:"中国",   kana:"チュウゴク",   en:"chugoku",  neighbor:[5, 7, 8]},
        {id:7, name:"四国",   kana:"シコク",       en:"shikoku",  neighbor:[5, 6, 8]},
        {id:8, name:"九州",   kana:"キュウシュウ", en:"kyusyu",   neighbor:[6, 7]}
      ],

      // 参照: http://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E5%9C%B0%E5%9F%9F
      // `neigbor`には海上隣接も含みます
      prefectures = [
        {id:1,  region:1, name:"北海道",   short:"北海道", kana:"ホッカイドウ", en:"hokkaido",  neighbor:[2]},
        {id:2,  region:2, name:"青森県",   short:"青森",   kana:"アオモリ",     en:"aomori",    neighbor:[1, 3, 5]},
        {id:3,  region:2, name:"岩手県",   short:"岩手",   kana:"イワテ",       en:"iwate",     neighbor:[2, 4, 5]},
        {id:4,  region:2, name:"宮城県",   short:"宮城",   kana:"ミヤギ",       en:"miyagi",    neighbor:[3, 5, 6, 7]},
        {id:5,  region:2, name:"秋田県",   short:"秋田",   kana:"アキタ",       en:"akita",     neighbor:[2, 3, 4, 6]},
        {id:6,  region:2, name:"山形県",   short:"山形",   kana:"ヤマガタ",     en:"yamagata",  neighbor:[4, 5, 7, 15]},
        {id:7,  region:2, name:"福島県",   short:"福島",   kana:"フクシマ",     en:"fukushima", neighbor:[4, 6, 8, 9, 10, 15]},
        {id:8,  region:3, name:"茨城県",   short:"茨城",   kana:"イバラキ",     en:"ibaraki",   neighbor:[7, 9, 11, 12]},
        {id:9,  region:3, name:"栃木県",   short:"栃木",   kana:"トチギ",       en:"tochigi",   neighbor:[8, 7, 10, 11]},
        {id:10, region:3, name:"群馬県",   short:"群馬",   kana:"グンマ",       en:"gunma",     neighbor:[7, 9, 11, 15, 20]},
        {id:11, region:3, name:"埼玉県",   short:"埼玉",   kana:"サイタマ",     en:"saitama",   neighbor:[8, 9, 10, 12, 13, 19, 20]},
        {id:12, region:3, name:"千葉県",   short:"千葉",   kana:"チバ",         en:"chiba",     neighbor:[8, 11, 13, 14]},
        {id:13, region:3, name:"東京都",   short:"東京",   kana:"トウキョウ",   en:"tokyo",     neighbor:[11, 12, 14, 19]},
        {id:14, region:3, name:"神奈川県", short:"神奈川", kana:"カナガワ",     en:"kanagawa",  neighbor:[12, 13, 19, 22]},
        {id:15, region:4, name:"新潟県",   short:"新潟",   kana:"ニイガタ",     en:"niigata",   neighbor:[6, 7, 10, 16, 20]},
        {id:16, region:4, name:"富山県",   short:"富山",   kana:"トヤマ",       en:"toyama",    neighbor:[15, 17, 20, 21]},
        {id:17, region:4, name:"石川県",   short:"石川",   kana:"イシカワ",     en:"ishikawa",  neighbor:[16, 18, 21]},
        {id:18, region:4, name:"福井県",   short:"福井",   kana:"フクイ",       en:"fukui",     neighbor:[17, 21, 25, 26]},
        {id:19, region:4, name:"山梨県",   short:"山梨",   kana:"ヤマナシ",     en:"yamanashi", neighbor:[11, 13, 14, 20, 22]},
        {id:20, region:4, name:"長野県",   short:"長野",   kana:"ナガノ",       en:"nagano",    neighbor:[10, 11, 15, 16, 19, 21, 22, 23]},
        {id:21, region:4, name:"岐阜県",   short:"岐阜",   kana:"ギフ",         en:"gifu",      neighbor:[16, 17, 18, 20, 23, 24, 25]},
        {id:22, region:4, name:"静岡県",   short:"静岡",   kana:"シズオカ",     en:"shizuoka",  neighbor:[14, 19, 20, 23]},
        {id:23, region:4, name:"愛知県",   short:"愛知",   kana:"アイチ",       en:"aichi",     neighbor:[20, 21, 22, 24]},
        {id:24, region:5, name:"三重県",   short:"三重",   kana:"ミエ",         en:"mie",       neighbor:[21, 23, 25, 26, 29, 30]},
        {id:25, region:5, name:"滋賀県",   short:"滋賀",   kana:"シガ",         en:"shiga",     neighbor:[18, 21, 24, 26]},
        {id:26, region:5, name:"京都府",   short:"京都",   kana:"キョウト",     en:"kyoto",     neighbor:[18, 24, 25, 27, 28, 29]},
        {id:27, region:5, name:"大阪府",   short:"大阪",   kana:"オオサカ",     en:"osaka",     neighbor:[26, 28, 29, 30]},
        {id:28, region:5, name:"兵庫県",   short:"兵庫",   kana:"ヒョウゴ",     en:"hyogo",     neighbor:[26, 27, 30, 31, 33, 36, 37]},
        {id:29, region:5, name:"奈良県",   short:"奈良",   kana:"ナラ",         en:"nara",      neighbor:[24, 26, 27, 30]},
        {id:30, region:5, name:"和歌山県", short:"和歌山", kana:"ワカヤマ",     en:"wakayama",  neighbor:[24, 27, 28, 29, 36]},
        {id:31, region:6, name:"鳥取県",   short:"鳥取",   kana:"トットリ",     en:"tottori",   neighbor:[28, 32, 33, 34]},
        {id:32, region:6, name:"島根県",   short:"島根",   kana:"シマネ",       en:"shimane",   neighbor:[31, 34, 35]},
        {id:33, region:6, name:"岡山県",   short:"岡山",   kana:"オカヤマ",     en:"okayama",   neighbor:[28, 31, 34, 37]},
        {id:34, region:6, name:"広島県",   short:"広島",   kana:"ヒロシマ",     en:"hiroshima", neighbor:[31, 32, 33, 35, 37, 38]},
        {id:35, region:6, name:"山口県",   short:"山口",   kana:"ヤマグチ",     en:"yamaguchi", neighbor:[32, 34, 38, 40, 44]},
        {id:36, region:7, name:"徳島県",   short:"徳島",   kana:"トクシマ",     en:"tokushima", neighbor:[28, 30, 37, 38, 39]},
        {id:37, region:7, name:"香川県",   short:"香川",   kana:"カガワ",       en:"kagawa",    neighbor:[28, 33, 34, 36, 38]},
        {id:38, region:7, name:"愛媛県",   short:"愛媛",   kana:"エヒメ",       en:"ehime",     neighbor:[33, 34, 35, 36, 37, 39, 44]},
        {id:39, region:7, name:"高知県",   short:"高知",   kana:"コウチ",       en:"kochi",     neighbor:[36, 38]},
        {id:40, region:8, name:"福岡県",   short:"福岡",   kana:"フクオカ",     en:"fukuoka",   neighbor:[35, 41, 42, 43, 44]},
        {id:41, region:8, name:"佐賀県",   short:"佐賀",   kana:"サガ",         en:"saga",      neighbor:[40, 42]},
        {id:42, region:8, name:"長崎県",   short:"長崎",   kana:"ナガサキ",     en:"nagasaki",  neighbor:[41, 43]},
        {id:43, region:8, name:"熊本県",   short:"熊本",   kana:"クマモト",     en:"kumamoto",  neighbor:[40, 41, 42, 44, 45, 46]},
        {id:44, region:8, name:"大分県",   short:"大分",   kana:"オオイタ",     en:"oita",      neighbor:[35, 38, 40, 43, 45]},
        {id:45, region:8, name:"宮崎県",   short:"宮城",   kana:"ミヤザキ",     en:"miyazaki",  neighbor:[43, 44, 46]},
        {id:46, region:8, name:"鹿児島県", short:"鹿児島", kana:"カゴシマ",     en:"kagoshima", neighbor:[43, 45, 47]},
        {id:47, region:8, name:"沖縄県",   short:"沖縄",   kana:"オキナワ",     en:"okinawa",   neighbor:[46]}
      ];


  // jpPrefecture base object.
  function jpPrefecture(){
    return this;
  }

  // Alias
  jp = jpPrefecture;

  // Current Version
  jp.VERSION = VERSION;

  // setting module
  if( typeof exports !== "undefined" ){
    if( typeof module !== "undefined" && module.exports ){
      exports = module.exports = jpPrefecture;
    }
    exports.jpPrefecture = jpPrefecture;
  }else{
    root.jpPrefecture = jpPrefecture;
  }

  if( typeof define === "function" && define.amd ){
    define("jp-prefecture", [], function(){
      return jpPrefecture;
    });
  }


  // 指定したタイプから配列を返す
  function getList(type){
    if( type === Type.REGION ) return clone(regions);
    else if( type === Type.PREF ) return clone(prefectures);
    return undefined;
  }


  /**
   * 同じ名前のライブラリとの衝突を避ける
   * @return jpPrefecture
   */
  jp.noConflict = function(){
    root.jpPrefecture = previousJpPrefecture;
    return this;
  };


  /**
   * 全ての地域、または都道府県を取得
   * @param string
   * @param string | array
   * @return array
   */
  jp.getAll = function(type, select){
    var list = getList(type);
    if( list === undefined || select === undefined ) return list;
    return pluck(getList(type), select);
  };


  /**
   * 全ての地域を取得
   * @param string | array
   * @return array
   */
  jp.getAllRegion = function(select){
    return jp.getAll(Type.REGION, select);
  };


  /**
   * 全ての都道府県を取得
   * @param string | array
   * @return array
   */
  jp.getAllPref = function(select){
    return jp.getAll(Type.PREF, select);
  };


  /**
   * 地域または都道府県を取得
   * @param string
   * @param object | mixed
   * @param string | array
   * @return object | mixed
   */
  jp.find = function(type, value, select){
    var list = getList(type), result;
    if( isObject(value) ){
      result = findWhere(list, value);
    }else{
      result = find(list, function(obj){
        return contains(obj, value);
      });
    }
    if( result === undefined ) return undefined;
    return select === undefined ? result : pluck(result, select);
  };


  /**
   * 地域を取得
   * @param object | mixed
   * @param string | array
   * @return object | mixed
   */
  jp.regionFind = function(value, select){
    return jp.find(Type.REGION, value, select);
  };


  /**
   * 都道府県を取得
   * @param object | mixed
   * @param string | array
   * @return object | mixed
   */
  jp.prefFind = function(value, select){
    return jp.find(Type.PREF, value, select);
  };


  /**
   * 地域または都道府県を、指定したキーと値から取得
   * @param string
   * @param string
   * @param string | integer
   * @param string | array
   * @return object | mixed
   */
  jp.findBy = function(type, key, value, select){
    var obj = {};
    obj[key] = value;
    return jp.find(type, obj, select);
  };


  /**
   * 地域または都道府県をIDから取得
   * @param string
   * @param mixed
   * @param string | array
   * @return object | mixed
   */
  jp.regionFindBy = function(key, value, select){
    return jp.findBy(Type.REGION, key, value, select);
  };


  /**
   * 地域または都道府県をIDから取得
   * @param string
   * @param mixed
   * @param string | array
   * @return object | mixed
   */
  jp.prefFindBy = function(key, value, select){
    return jp.findBy(Type.PREF, key, value, select);
  };


  /**
   * 都道府県から該当する地域を取得
   * @param mixed
   * @param string | array
   * @return obj | mixed
   */
  jp.regionFindByPref = function(value, select){
    var pref = jp.prefFind(value);
    if( pref === undefined ) return undefined;
    return jp.regionFindBy("id", pref.region, select);
  };


  /**
   * 地域から該当する都道府県一覧を取得
   * @param mixed
   * @param string | array
   * @return array
   */
  jp.prefFindByRegion = function(value, select){
    var region = jp.regionFind(value), results;
    if( region === undefined ) return undefined;
    results = filter(prefectures, function(d, i){
      if( d.region === region.id ) return d;
    });
    return select === undefined ? results : pluck(results, select)
  };


  /**
   * 指定した条件に当てはまる地域または都道府県を取得
   * @param string
   * @param object
   * @param string | array
   * @return array
   */
  jp.where = function(type, attrs, select){
    var results = where(getList(type), attrs);
    return select === undefined ? results : pluck(results, select);
  };


  /**
   * 指定した条件に当てはまる地域を取得
   * @param object
   * @param string | array
   * @return array
   */
  jp.regionWhere = function(attrs, select){
    return jp.where(Type.REGION, attrs, select);
  };


  /**
   * 指定した条件に当てはまる都道府県を取得
   * @param object
   * @param string | array
   * @return array
   */
  jp.prefWhere = function(attrs, select){
    return jp.where(Type.PREF, attrs, select);
  };


  /**
   * 地域または都道府県の指定した値から別のキーへ変換
   * @param string
   * @param mixed
   * @param string
   * @return mixed
   */
  jp.convert = function(type, value, key){
    if( isArray(key) ){
      key = values(key);
      key = key[0];
    }
    return jp.find(type, value, key);
  };


  /**
   * 地域の指定した値から別のキーへ変換
   * @param mixed
   * @param string
   * @return mixed
   */
  jp.regionConvert = function(value, key){
    return jp.convert(Type.REGION, value, key);
  };


  /**
   * 都道府県の指定した値から別のキーへ変換
   * @param mixed
   * @param string
   * @return mixed
   */
  jp.prefConvert = function(value, key){
    return jp.convert(Type.PREF, value, key);
  };


  /**
   * 指定した地域、または都道府県に隣接しているものを取得
   * @param string
   * @param mixed
   * @param string | array
   * @return array
   */
  jp.getNeighbors = function(type, value, select){
    var result = jp.find(type, value);
    if( result === undefined ) return undefined;
    return map(result.neighbor, function(id){
      return jp.findBy(type, "id", id, select);
    });
  };


  /**
   * 指定した地域に隣接した地域を取得
   * @param mixed
   * @param string | array
   * @return array
   */
  jp.getRegionNeighbors = function(value, select){
    return jp.getNeighbors(Type.REGION, value, select);
  };


  /**
   * 指定した地域に隣接した地域を取得
   * @param mixed
   * @param string | array
   * @return array
   */
  jp.getPrefNeighbors = function(value, select){
    return jp.getNeighbors(Type.PREF, value, select);
  };


  /**
   * 指定した2つの地域または都道府県が隣接しているか判定
   * @param string
   * @param mixed
   * @param mixed
   * @return boolean
   */
  jp.isNeighbor = function(type, val1, val2){
    var obj1 = jp.find(type, val1),
        obj2 = jp.find(type, val2);
    if( obj1 === undefined || obj2 === undefined ) return false;
    return contains(obj1.neighbor, obj2.id);
  };


  /**
   * 指定した2つの地域が隣接しているか判定
   * @param mixed
   * @param mixed
   * @return boolean
   */
  jp.isRegionNeighbor = function(val1, val2){
    return jp.isNeighbor(Type.REGION, val1, val2);
  };


  /**
   * 指定した2つの都道府県が隣接しているか判定
   * @param mixed
   * @param mixed
   * @return boolean
   */
  jp.isPrefNeighbor = function(val1, val2){
    return jp.isNeighbor(Type.PREF, val1, val2);
  };


  /**
   * 指定した地域または都道府県の隣接数を取得
   * @param string
   * @param mixed
   * @return integer
   */
  jp.neighborSize = function(type, value){
    var result = jp.find(type, value);
    return result !== undefined ? result.neighbor.length : 0;
  };


  /**
   * 指定した地域の隣接数を取得
   * @param mixed
   * @return integer
   */
  jp.regionNeighborSize = function(value){
    return jp.neighborSize(Type.REGION, value);
  };


  /**
   * 指定した都道府県の隣接数を取得
   * @param mixed
   * @return integer
   */
  jp.prefNeighborSize = function(value){
    return jp.neighborSize(Type.PREF, value);
  };


  /**
   * 地域に対応する都道府県が入った状態の一覧を多次元配列で取得
   * @return array
   */
  jp.getAllRegionInPref = function(){
    var results = [];
    each(jp.getAllRegion(), function(region){
      results.push({
        region: region,
        prefectures: jp.prefWhere({region: region.id})
      });
    });
    return results;
  };




  /**
   * -------------------------------------------------------------
   * Decision Helpers
   * -------------------------------------------------------------
   */
  function isArray(val){
    return Object.prototype.toString.call(val) === "[object Array]";
  }

  function isObject(obj){
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj && !isArray(obj);
  }

  function is(type, obj){
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  }


  /**
   * -------------------------------------------------------------
   * Collection Helpers
   * -------------------------------------------------------------
   */
  function clone(obj){
    var _isArray = isArray(obj),
        _isObject = isObject(obj);
    if( !_isArray && !_isObject ) return undefined;
    var result = _isArray ? [] : {}, key, val;
    for( key in obj ){
      val = obj[key];
      if( isArray(val) || isObject(val) ) val = clone(val);
      result[key] = val;
    }
    return result;
  }

  function each(obj, iterate, context){
    if( obj === null ) return obj;
    context = context || obj;
    if( isObject(obj) ){
      for( var key in obj ){
        if( iterate.call(context, obj[key], key) === false ) break;
      }
    }else if( isArray(obj) ){
      var i, length = obj.length;
      for( i = 0; i < length; i++ ){
        if( iterate.call(context, obj[i], i) === false ) break;
      }
    }
    return obj;
  }

  function map(obj, iterate, context){
    if( obj === null ) return [];
    var results = [], val;
    each(obj, function(d, i){
      val = iterate.call(context, d, i);
      if( val !== null ){
        results[i] = val;
      }
    });
    return results;
  }

  function find(obj, predicate){
    var result;
    each(obj, function(d, i){
      if( predicate(d, i) ){
        result = d;
        return false;
      }
    });
    return result;
  }

  function some(obj, predicate){
    if( obj === null ) return false;
    var k = !isArray(obj) && keys(obj),
        l = ( k || obj ).length,
        i, current;
    for( i = 0; i < l; i++ ){
      current = k ? k[i] : i;
      if( predicate(obj[current], current, obj) ) return true;
    }
    return false;
  }

  function contains(obj, value, from){
    if( obj === null ) return false;
    if( !isArray(obj) ) obj = values(obj);
    return indexOf(obj, value, from) >= 0;
  }

  function matches(attrs){
    var p = pairs(attrs), l = p.length, i, pair, key;
    return function(obj){
      if( p.length === 0 ) return false;
      if( obj === null ) return !l;
      obj = new Object(obj);
      for( i = 0; i < l; i++ ){
        pair = p[i];
        key = pair[0];
        if( pair[1] !== obj[key] || !(key in obj) ) return false;
      }
      return true;
    };
  }

  function where(obj, attrs){
    return filter(obj, matches(attrs));
  }

  function findWhere(obj, attrs){
    return find(obj, matches(attrs));
  }

  function filter(obj, predicate){
    var results = [];
    if( obj === null ) return results;
    each(obj, function(d, i){
      if( predicate(d, i) ) results.push(d);
    });
    return results;
  }

  function pluck(obj, key){
    var results = [], _isArray, o;

    if( obj === null ) return results;
    _isArray = isArray(obj);
    obj = _isArray ? obj : [obj];

    if( is("String", key) ){
      results = map(obj, function(d){
        return d === null ? undefined : d[key];
      });
    }else if( isArray(key) ){
      results = map(obj, function(d){
        o = {};
        each(key, function(k){
          o[k] = d[k];
        });
        return o;
      });
    }
    return _isArray ? results : results[0];
  }

  function indexOf(array, value, from){
    var i = 0, l = array && array.length;
    from = isNaN(from) ? 0 : from;
    for( i = from; i < l; i++ ) if( array[i] === value ) return i;
    return -1;
  }

  function pairs(obj){
    var k = keys(obj), l = k.length, p = Array(l), i;
    for( i = 0; i < l; i++ ){
      p[i] = [ k[i], obj[k[i]] ];
    }
    return p;
  }

  function keys(obj){
    var k = [];
    if( isObject(obj) || isArray(obj) ){
      each(obj, function(d, i){
        k.push(i);
      });
    }
    return k;
  }

  function values(obj){
    var k = keys(obj),
        l = k.length,
        v = Array(l),
        i;
    for( i = 0; i < l; i++ ){
      v[i] = obj[k[i]];
    }
    return v;
  }

}.call(this));