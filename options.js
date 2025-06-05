document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['enabled', 'ticketCount', 'minPrice', 'maxPrice', 'preferTickets'], (result) => {
        document.getElementById('enabled').checked = result.enabled ?? false;
        document.getElementById('ticketCount').value = result.ticketCount ?? 2;
        document.getElementById('minPrice').value = result.minPrice ?? 3000;
        document.getElementById('maxPrice').value = result.maxPrice ?? 6000;
        document.getElementById('preferTickets').value = (result.preferTickets ?? []).join(', ');
    });

    document.getElementById('save').addEventListener('click', () => {
        const enabled = document.getElementById('enabled').checked;
        const ticketCount = parseInt(document.getElementById('ticketCount').value, 10);
        const minPrice = parseInt(document.getElementById('minPrice').value, 10);
        const maxPrice = parseInt(document.getElementById('maxPrice').value, 10);
        const preferTickets = document.getElementById('preferTickets').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '');

        chrome.storage.sync.set({ ticketCount, minPrice, maxPrice, preferTickets, enabled }, () => {
            document.getElementById('status').textContent = '設定已儲存';
            setTimeout(() => document.getElementById('status').textContent = '', 2000);
        });
    });
});
