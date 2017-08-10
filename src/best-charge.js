let loadAllItems = require('./items.js');
let loadPromotions = require('./promotions.js');



module.exports = function bestCharge(selectedItems) {

  let itemsInfo = createItemsInfo(selectedItems);
  let itemsPrices = calculateItemsPrice(itemsInfo);
  let summaryPrice = calculateSummaryPrice(itemsPrices);
  let promotionPrice = calculatePromotion(itemsPrices, summaryPrice);
  let itemsString = allForPrint(itemsPrices,summaryPrice,promotionPrice);
  console.log(itemsString);
  return itemsString;
  /*TODO*/
  ;
}

function allForPrint(itemsPrices, summaryPrice, promotionPrice) {
  let str = '============= 订餐明细 =============\n';
  for (let item of itemsPrices) {
    str += item.name + ' x ' + item.count + ' = ' + item.totalPrice +'元\n';
  }
  str += '-----------------------------------\n';

  if(promotionPrice.discount > 0){
    str += '使用优惠:\n' + promotionPrice.type;
    str += typeMakeSure(promotionPrice);
    str += '，省' + promotionPrice.discount + '元\n-----------------------------------\n';
  }

  str += '总计：' + (summaryPrice - promotionPrice.discount) + '元\n===================================';
  return str;
}
function typeMakeSure(promotionPrice) {
  let str = '';
  if(promotionPrice.type === '指定菜品半价'){
    let array = promotionPrice.name;
    str += '(' + array[0];
    for (let i = 1; i< array.length; i++) {
      str += '，' + array[i];
    }
    str += ')';
  }
  return str;
}

function calculatePromotion(itemsPrices, summaryPrice) {
  let promotions = loadPromotions();
  let promotion1 = promotionOne(promotions[0], summaryPrice);
  let promotion2 = promotionTwo(promotions[1], itemsPrices);
  if (promotion1.discount >= promotion2.discount) {
    return promotion1;
  } else {
    return promotion2;
  }
}

function promotionOne(promotion, summaryPrice) {
  let discount = 0;
  if (summaryPrice >= 30) {
    discount = parseInt(summaryPrice / 30) * 6;
  }
  promotion.discount = discount;
  return promotion;
}

function promotionTwo(promotion, itemsPrices) {
  let discount = 0;
  let array = [];
  for (let item of itemsPrices) {
    if(findHalfPrice(item.id, promotion.items)) {
      discount += (item.price/2) * item.count;
      array.push(item.name);
    }
  }
  promotion.discount = discount;
  promotion.name = array;
  return promotion;
}

function findHalfPrice(id, itemsId) {
  for(let item of itemsId) {
    if(item === id) {
      return true;
    }
  }
  return false;
}


function calculateSummaryPrice(itemsPrices) {
  let summaryPrice = 0;
  for (let item of itemsPrices) {
    summaryPrice += item.totalPrice;
  }
  return summaryPrice;
}


function calculateItemsPrice(itemsInfo) {
  let itemsPrices = [];
  let itemsAll = loadAllItems();
  for (let item of itemsInfo) {
    let add = addCharacter(itemsAll, item);
    if (add) {
      itemsPrices.push(add);
    }
  }
  return itemsPrices;
}

function addCharacter(itemsAll, obj) {
  for (let item of itemsAll) {
    if (obj.id === item.id) {
      obj.name = item.name;
      obj.price = item.price;
      obj.totalPrice = obj.count * obj.price;
      return obj;
    }
  }
  return null;
}


function createItemsInfo(selectedItems) {
  let itemsInfo = sumItems(selectedItems);
  return itemsInfo;
}

function sumItems(selectedItems) {
  let itemsInfo = [];
  for (let item of selectedItems) {
    let {id, count} = splitItems(item);
    itemsInfo.push({id: id, count: count});
  }
  return itemsInfo;
}
function splitItems(ch) {
  let array = ch.split(" x ");
  return {id: array[0], count: array[1]};
}
