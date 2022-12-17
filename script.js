"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";
  const newMov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  newMov.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value"> ${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function displayTotalBalance(acc) {
  const totalBal = acc.movements.reduce((accu, curr) => accu + curr, 0);
  acc.balance = totalBal;
  labelBalance.innerHTML = acc.balance;
}

function displayBalanceSummary(acc) {
  const deposited = acc.movements
    .filter((mov) => mov > 0)
    .reduce((accu, curr) => accu + curr, 0);
  labelSumIn.innerHTML = deposited;
  const witdhrawal = Math.abs(
    acc.movements
      .filter((mov) => mov < 0)
      .reduce((accu, curr) => accu + curr, 0)
  );
  labelSumOut.innerHTML = witdhrawal;

  let interest = acc.movements
    .map((mov) => (mov * 1.2) / 100)
    .filter((f) => f > 0)
    .reduce((accu, curr) => accu + curr, 0);
  interest = Math.trunc(interest);
  labelSumInterest.innerHTML = interest;
}
function updateUi(acc) {
  displayMovements(acc);
  displayBalanceSummary(acc);
  displayTotalBalance(acc);
}
function createUsername(accounts) {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
}
createUsername(accounts);

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  console.log("sor", sorted);
  sorted = !sorted;
});

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const inputUserNameValue = inputLoginUsername.value;

  const inputPasswordValue = inputLoginPin.value;

  currentAccount = accounts.find((acc) => acc.username === inputUserNameValue);

  if (currentAccount?.pin === Number(inputPasswordValue)) {
    const welcom = currentAccount.owner.split(" ")[0];
    labelWelcome.innerHTML = `Welcome to dashboard ${welcom}`;
    updateUi(currentAccount);
    containerApp.style.opacity = 1;
  } else {
    console.log("wrond credintials");
  }
});
inputTransferTo;
inputTransferAmount;
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAc = inputTransferTo.value;
  const transferAm = Number(inputTransferAmount.value);

  const transAccount = accounts.find((acc) => acc.username === transferAc);
  if (
    transAccount &&
    transferAm <= currentAccount.balance &&
    currentAccount.balance >= 0 &&
    transAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(transferAm * -1);
    transAccount.movements.push(transferAm);
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const requestLoanValue = Number(inputLoanAmount.value);
  if (
    requestLoanValue > 0 &&
    currentAccount.movements.some((item) => item >= requestLoanValue * 0.1)
  ) {
    currentAccount.movements.push(requestLoanValue);
    updateUi(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  console.log("hello");
  e.preventDefault();
  const inputName = inputCloseUsername.value;
  const inputPin = Number(inputClosePin.value);
  console.log("uname", inputName);
  console.log("uname", inputPin);
  if (
    inputName === currentAccount.username &&
    inputPin === currentAccount.pin
  ) {
    const closeIndex = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(closeIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.innerHTML = "Login to get started";
  }
});
