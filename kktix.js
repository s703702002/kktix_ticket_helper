const ticketCount = 2;
/** 把最低到最高票價區間的票加上黃色背景色  */
const minPrice = 4000; // 最低票價
const maxPrice = 7000; // 最高票價
// 如果有設定偏好的票種，並且符合價格區間，會照順序直接購買
const preferTickets = [
  '黃2C',
  '黃2D',
  '黃2B',
  '黃2A',
  '黃2E',
  '黃3F',
  '黃3E',
  '黃3D',
  '黃3G',
  '黃3C',
  '黃3H',
  '黃3B',
  '黃3I',
  '黃3A',
  '黃3J',
];

// ====== utilities

function removeBanner() {
  // 移除廣告區塊
  const includeToRemove = document.querySelector(
    '[ng-include="\'registrations/event_info.html\'"]'
  );
  if (includeToRemove) {
    includeToRemove.remove();
  }
}

function submit() {
  const agreeCheckbox = document.querySelector('#person_agree_terms');
  const nextButton = document.querySelector('button[ng-click="challenge()"]');

  if (agreeCheckbox) {
    agreeCheckbox.click();
  }

  if (nextButton) {
    nextButton.click();
  }
}

function checkIsInPriceRange(ticketRow) {
  const priceElement = ticketRow.querySelector('[ng-if="ticket.price.cents > 0"]');
  const price = parseFloat(priceElement.childNodes[0].textContent.trim().replace(/[^0-9.]/g, ''));

  if (price > maxPrice || price < minPrice) return false;
  return true;
}

function tryingSetTicketCount(ticketRow) {
  try {
    const input = ticketRow.querySelector('[ng-model="ticketModel.quantity"]');
    const addBtn = ticketRow.querySelector('[ng-click="quantityBtnClick(1)"]');
    const minusBtn = ticketRow.querySelector('[ng-click="quantityBtnClick(-1)"]');

    for (let i = parseInt(input.value, 10); i < ticketCount; i++) {
      addBtn.click();
    }

    const currentCount = parseInt(input.value, 10);

    if (currentCount === ticketCount) {
      return true;
    }

    console.log('設定票數失敗，歸零票數');

    for (let i = 0; i < currentCount; i++) minusBtn.click();

    return false;
  } catch {
    return false
  }
}

// ====== main function

removeBanner();

const ticketRows = Array.from(document.querySelectorAll('[ng-controller="TicketCtrl"]')).filter((ticketRow) => {
  const noTicket = ticketRow.querySelector('[ng-if="!purchasableAndSelectable"]');

  if (noTicket) {
    ticketRow.remove(); // 清除已售完區塊
    return false;
  }

  if (checkIsInPriceRange(ticketRow)) {
    ticketRow.setAttribute('style', 'background: yellow;');
    ticketRow.setAttribute('data-in-price-range', 'true');
  }

  return true;
});

if (ticketRows.length === 0) {
  if (confirm('沒票了，請重新整理')) {
    window.location.reload();
  }
}

for (const preferTicket of preferTickets) {
  const matchTicket = ticketRows.find((ele) => {
    return ele.querySelector('.ticket-name')?.textContent?.trim() === preferTicket
      && ele.getAttribute('data-in-price-range') === 'true'
  });

  if (matchTicket) {
    console.log(`找到符合的票 "${preferTicket}"，開始嘗試購買...`);

    if (tryingSetTicketCount(matchTicket)) {
      submit();
      break;
    }
  }
}

document.addEventListener('keyup', function (e) {
  if (e.key === ' ' || e.key === 'Spacebar') {
    submit();
  }
});
