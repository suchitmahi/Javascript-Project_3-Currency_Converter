const BASE_URL = "https://open.er-api.com/v6/latest"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for(let select of dropdowns){
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD"){
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
    img.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amountInput = document.querySelector(".amount input");
    let amtVal = Number(amountInput.value);

    if (amtVal < 1 || isNaN(amtVal)) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const from = fromCurr.value; // ✅ STRING like "USD"
    const to = toCurr.value;     // ✅ STRING like "INR"

    const URL = `${BASE_URL}/${from}`;
    console.log("FETCHING 👉", URL);

    const response = await fetch(URL);
    const data = await response.json();

    if (data.result !== "success") {
        throw new Error("API failed");
    }

    const rate = data.rates[to]; // ✅ correct
    const finalAmount = (amtVal * rate).toFixed(2);

    document.querySelector(".msg").innerText =
        `${amtVal} ${from} = ${finalAmount} ${to}`;
});