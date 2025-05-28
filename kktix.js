const ticketCount = 2;
const targetPrices = [
  'TWD$6,680',
  'TWD$5,580'
];

// 移除廣告區塊

const includeToRemove = document.querySelector(
  '[ng-include="\'registrations/event_info.html\'"]'
);

if (includeToRemove) {
  includeToRemove.remove();
}

document.querySelectorAll('[ng-controller="TicketCtrl"]').forEach((ele) => {
  const noTicketRow = ele.querySelector('[ng-if="!purchasableAndSelectable"]');

  if (noTicketRow) {
    ele.remove(); // 清除已售完區塊
    return;
  }

  const priceElement = ele.querySelector('[ng-if="ticket.price.cents > 0"]');

  if (priceElement && targetPrices.includes(priceElement.textContent.trim())) {
    ele.setAttribute('style', 'background: yellow;')
  }
});

if (document.querySelectorAll('[ng-controller="TicketCtrl"]').length === 0) {
  console.log('沒票了!!!');
}

document.querySelectorAll('[ng-controller="TicketCtrl"]').forEach((ele) => {
  ele.addEventListener('click', (e) => {
    const input = ele.querySelector('input[ng-model="ticketModel.quantity"]');
    const inputValue = input ? input.value : 0;
    const addBtn = ele.querySelector('[ng-click="quantityBtnClick(1)"]')

    if (addBtn) {
      for (let i = 0; i < ticketCount - Number(inputValue); i++) addBtn.click();  
    }
  });
})

function submit() {
  const agreeCheckbox = document.querySelector('#person_agree_terms');
  const nextButton = document.querySelector('button[ng-click="challenge()"]');

  if (agreeCheckbox) {
    agreeCheckbox.click();
  }

  if (nextButton && !nextButton.disabled) {
    nextButton.click();
  }
}

document.addEventListener('keyup', function (e) {
  if (e.key === ' ' || e.key === 'Spacebar') {
    submit();
  }
});
