let db;
const request = indexdDB.open('expense_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_tx', {autoIncrement: true});

};
request.onsuccess = function(event){
    db = event.target.result;

    if(navigator.onLine){
         uploadTx();
 }
};
request.onerror = function(event) {
    console.log(event.target.errorCode);

};

function saveRecord(record) {
    const transaction = db.transaction(['new_tx'], 'readwrite');
    const txObjectStore = transaction.objectStore('new_tx');
    txObjectStore.add(record);
}
handleExpenseSubmit()
.catch(err => {
    console.log(err);
    saveRecord(FormData);
});

function uploadTx() {
    const transaction = db.transaction(['new_tx'], 'readwrite');
    const txObjectStore = transaction.objectStore('newTransaction');
    const getAll = txObjectStore.getAll();
}

getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(serverResponse =>{
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            const transaction = db.transaction(['new_tx']);
            const txObjectStore = transaction.objectStore('new_tx');
            txObjectStore.clear();
            alert('All saved transaction has been submitted!');
        })
        .catch(err => {
            console.log(err);
        });
    }
};
// listen to app coming back online
window.addEventListener('online', uploadTx)