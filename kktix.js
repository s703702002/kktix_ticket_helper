const ticketCount = 3;
const minPrice = 2000;
const maxPrice = 7000
// 如果沒有設定偏好的票種，會自動購買在價格區間內找到的第一種票
const preferTickets = [];

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

function checkIsMatchPrice(ticketRow) {
  const priceElement = ticketRow.querySelector('[ng-if="ticket.price.cents > 0"]');
  const price = parseInt(priceElement.textContent.trim().replace(/[^0-9]/g, ''), 10);

  if (price > maxPrice || price < minPrice) return false;
  return true;
}

function checkIsPreferTicket(ticketRow) {
  if (preferTickets.length === 0) return true;

  const ticketName = ticketRow.querySelector('.ticket-name')?.textContent?.trim();

  return preferTickets.includes(ticketName);
}

function tryingSetTicketCount(ticketRow) {
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

  for (let i = 0; i < currentCount; i++) minusBtn.click();

  return false;
}

// ====== main function

removeBanner();

const ticketRows = Array.from(document.querySelectorAll('[ng-controller="TicketCtrl"]')).filter((ticketRow) => {
  const noTicket = ticketRow.querySelector('[ng-if="!purchasableAndSelectable"]');

  if (noTicket) {
    ticketRow.remove(); // 清除已售完區塊
    return false;
  }

  if (checkIsMatchPrice(ticketRow)) {
    ticketRow.setAttribute('style', 'background: yellow;');
  }

  if (checkIsMatchPrice(ticketRow) && checkIsPreferTicket(ticketRow)) {
    ticketRow.setAttribute('data-auto-buy', '1');
  }

  return true;
});

if (ticketRows.length === 0) {
  if (confirm('沒票了，請重新整理')) {
    window.location.reload();
  }
}

for (const ticketRow of ticketRows) {
  const autoBuy = ticketRow.getAttribute('data-auto-buy') === '1';

  if (autoBuy) {
    if (tryingSetTicketCount(ticketRow)) {
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
