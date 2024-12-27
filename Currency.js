const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_AeaDUoMVDi30NkChLi4sKJnC5UaRybtYIjfrEM5U";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amountInput = document.querySelector(".amount input");
  let amtValue = parseFloat(amountInput.value); // Parse input as a float
  if (isNaN(amtValue) || amtValue <= 0) {
    msg.innerText = "Please enter a valid amount";
    return;
  }
  try {
    let response = await fetch(`${BASE_URL}&base_currency=${fromCurr.value}`);
    if (!response.ok) {
      throw new Error(`Error fetching exchange rate: ${response.status}`);
    }
    let data = await response.json();

    let rate = data.data[toCurr.value]?.value;
    if (!rate) {
      throw new Error(`Exchange rate not available for ${toCurr.value}`);
    }
    let finalAmount = (amtValue * rate).toFixed(2);
    msg.innerText = `${amtValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "An error occurred while fetching the exchange rate.";
  }
});
