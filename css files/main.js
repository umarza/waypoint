const bookingForm = document.getElementById('bookingForm');

// Personal Details Form
const firstNameInput = document.getElementById('fName');
const lastNameInput = document.getElementById('lName');
const emailInput = document.getElementById('eMail');
const phoneNumberInput = document.getElementById('phoneNumber');
const countryInput = document.getElementById('Country');

// Adventure Details Form
const adventuresDropdown = document.getElementById('AdvdropDown');
const localAdultsInput = document.getElementById('localAdults');
const localChildrenInput = document.getElementById('localchildren');
const foreignAdultsInput = document.getElementById('foreignadults');
const foreignChildrenInput = document.getElementById('foreignchildren');
const diveAdultsCheckbox = document.getElementById('diveAdults');
const diveChildrenCheckbox = document.getElementById('diveChildren');
const bookAdventureButton = document.getElementById('book_adv_btn');

// Booking Details Form
const checkInDateInput = document.getElementById('checkIn');
const checkOutDateInput = document.getElementById('checkOut');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');
const childrenAbove5Input = document.getElementById('kidsAbove5');
const singleRoomInput = document.getElementById('singleRoom');
const doubleRoomInput = document.getElementById('doubleRoom');
const tripleRoomInput = document.getElementById('tripleRoom');
const wifiCheckbox = document.getElementById('wifi');
const poolCheckbox = document.getElementById('pool');
const golfCheckbox = document.getElementById('golf');
const extraBedCheckbox = document.getElementById('extrabed');
const roomPriceElement = document.getElementById('roomPrice');
const advPriceElement = document.getElementById('advPrice');
const bookTable = document.getElementById('booktable');
const advTable = document.getElementById('advbooktable');

// Other Form Elements
const promoCodeInput = document.getElementById('promocode');
const roomFavBtn = document.getElementById('add2favRoom');
const advFavBtn = document.getElementById('add2favAdv');
const checkLoyaltyButton = document.getElementById('checkLoyalty');
const bookAdvButton = document.getElementById('book_adv_btn');
const bookRoomButton = document.getElementById('bookNow');
const loyaltyCheckBtn = document.getElementById("checkLoyalty");
const loyaltyField = document.getElementById('loyaltyField');

// Add event listeners to relevant fields
checkInDateInput.addEventListener('change', () => {
    calculateDuration();
    calculateTotalPrice();
});
checkOutDateInput.addEventListener('change', () => {
    calculateDuration();
    calculateTotalPrice();
});
singleRoomInput.addEventListener('input', calculateTotalPrice);
doubleRoomInput.addEventListener('input', calculateTotalPrice);
tripleRoomInput.addEventListener('input', calculateTotalPrice);
childrenInput.addEventListener('input', calculateTotalPrice);
childrenAbove5Input.addEventListener('input', calculateTotalPrice);
extraBedCheckbox.addEventListener('change', calculateTotalPrice);
promoCodeInput.addEventListener('input', calculateTotalPrice);

localAdultsInput.addEventListener('input', calculateAdventureCost);
localChildrenInput.addEventListener('input', calculateAdventureCost);
foreignAdultsInput.addEventListener('input', calculateAdventureCost);
foreignChildrenInput.addEventListener('input', calculateAdventureCost);
diveAdultsCheckbox.addEventListener('change', calculateAdventureCost);
diveChildrenCheckbox.addEventListener('change', calculateAdventureCost);
bookAdventureButton.addEventListener('click', calculateAdventureCost);

bookRoomButton.addEventListener('click', () => {
    if (validateRoomBooking()){
        UpdateLoyaltyPoints();
        updateOverallBooking();
    }
});
bookAdvButton.addEventListener('click', () => {
    if(validateAdventureBooking()){
        updateAdvOverallBooking();
    }
});
roomFavBtn.addEventListener('click', saveRoomFav);
advFavBtn.addEventListener('click', saveAdvFav);
loyaltyCheckBtn.addEventListener("click", checkLoyaltyPoints);

// Function to calculate the duration of stay
function calculateDuration() {
    const checkInDate = new Date(checkInDateInput.value);
    const checkOutDate = new Date(checkOutDateInput.value);

    const timeDifference = checkOutDate - checkInDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

// Function to calculate total price
function calculateTotalPrice() {
    const stayDuration = calculateDuration();

    // Get the values from the form inputs
    const singleRoomQuantity = parseInt(singleRoomInput.value) || 0;
    const doubleRoomQuantity = parseInt(doubleRoomInput.value) || 0;
    const tripleRoomQuantity = parseInt(tripleRoomInput.value) || 0;
    const kidsAbove5Quantity = parseInt(childrenAbove5Input.value) || 0;
    const extraBedCheckboxChecked = extraBedCheckbox.checked;
    const promoCode = promoCodeInput.value.trim();

    // Pricing information
    const singleRoomPrice = 25000.00;
    const doubleRoomPrice = 35000.00;
    const tripleRoomPrice = 40000.00;
    const childrenMealPrice = 5000.00; // Extra for kids above 5 years
    const extraBedPrice = 8000.00;

    // Calculate total price
    let totalPrice = (singleRoomQuantity * singleRoomPrice) +
                     (doubleRoomQuantity * doubleRoomPrice) +
                     (tripleRoomQuantity * tripleRoomPrice);

    totalPrice += kidsAbove5Quantity * childrenMealPrice;

    if (extraBedCheckboxChecked) {
        totalPrice += extraBedPrice;
    }

    totalPrice *= stayDuration;

    // Apply discount if applicable
    if (promoCode === 'Promo123') {
        totalPrice *= 0.95;
    }

    roomPriceElement.textContent = `LKR ${totalPrice}.00`;
}

// Function to calculate adventure cost
function calculateAdventureCost() {
    const localAdultsCount = parseInt(localAdultsInput.value) || 0;
    const localKidsCount = parseInt(localChildrenInput.value) || 0;
    const foreignAdultsCount = parseInt(foreignAdultsInput.value) || 0;
    const foreignKidsCount = parseInt(foreignChildrenInput.value) || 0;
    const needGuideAdults = diveAdultsCheckbox.checked;
    const needGuideKids = diveChildrenCheckbox.checked;

    // Cost per participant for each adventure
    const divingLocalAdultCost = 5000.00;
    const divingLocalKidsCost = 2000.00;
    const divingForeignAdultCost = 10000.00;
    const divingForeignKidsCost = 5000.00;
    const guideCostAdult = 1000.00;
    const guideCostKids = 500.00;

    // Calculate total adventure cost
    let totalCost = 0;

    totalCost += localAdultsCount * divingLocalAdultCost;
    totalCost += localKidsCount * divingLocalKidsCost;
    totalCost += foreignAdultsCount * divingForeignAdultCost;
    totalCost += foreignKidsCount * divingForeignKidsCost;

    if (needGuideAdults) {
        totalCost += localAdultsCount * guideCostAdult;
    }

    if (needGuideKids) {
        totalCost += localKidsCount * guideCostKids;
    }

    advPriceElement.textContent = `LKR ${totalCost}.00`
}

function updateOverallBooking() {
    const bookingDetails = {
      name: `${firstNameInput.value} ${lastNameInput.value}`,
      checkInDate: checkInDateInput.value,
      checkOutDate: checkOutDateInput.value,
      singleRooms: singleRoomInput.value || 0,
      doubleRooms: doubleRoomInput.value || 0,
      tripleRooms: tripleRoomInput.value || 0,
      wifi: wifiCheckbox.checked ? 'Yes' : 'No',
      extraBed: extraBedCheckbox.checked ? 'Yes' : 'No',
      poolView: poolCheckbox.checked ? 'Yes' : 'No',
      totalCost: roomPriceElement.innerText, 
    };
  
    const newRow = bookTable.insertRow(-1); 
    for (const detail in bookingDetails) {
        const newCell = newRow.insertCell();
        newCell.textContent = bookingDetails[detail]
    };

    bookingForm.reset();
    roomPriceElement.textContent = 'LKR 00.00';
    bookTable.scrollIntoView({behavior : 'smooth', block : 'center'});
    alert('You have successfully placed your booking!');
}

function updateAdvOverallBooking() {

    const advDetails = {
        name: `${firstNameInput.value} ${lastNameInput.value}`,
        advType: adventuresDropdown.value,
        localAdults : localAdultsInput.value || 0,
        localKids: localChildrenInput.value || 0,
        foreignAdults: foreignAdultsInput.value || 0,
        foreignKids: foreignChildrenInput.value || 0,
        adultsGuide: diveAdultsCheckbox.checked ? 'Yes' : 'No',
        kidsGuide: diveChildrenCheckbox.checked ? 'Yes' : 'No',
        totalCost: advPriceElement.innerText,
    }

    const newRow = advTable.insertRow(-1); 
    for (const detail in advDetails) {
        const newCell = newRow.insertCell();
        newCell.textContent = advDetails[detail];
    }

    bookingForm.reset();    
    advPriceElement.textContent = 'LKR 00.00';
    advTable.scrollIntoView({behavior : 'smooth', block : 'center'});
    alert(`You have successfully booked ${adventuresDropdown.value}`)
}

function saveAdvFav(){
    const advBooking = {
        localAdults: localAdultsInput.value || 0,
        localChildren: localChildrenInput.value || 0,
        foreignAdults: foreignAdultsInput.value || 0,
        foreignChildren: foreignChildrenInput.value || 0,
        adultGuide: diveAdultsCheckbox.checked ? 'Yes' : 'No',
        kidGuide: diveChildrenCheckbox.checked ? 'Yes' : 'No',
       
    }
    alert("Your choices for adventure have been favourited!");
    localStorage.setItem('favouriteAdvBooking', JSON.stringify(advBooking));
};

function saveRoomFav(){
    const roomBooking = {
        checkInDate: checkInDateInput.value,
        checkOutDate: checkOutDateInput.value,
        singleRooms: singleRoomInput.value || 0,
        doubleRooms: doubleRoomInput.value || 0,
        tripleRooms: tripleRoomInput.value || 0,
        adults: adultsInput.value || 0,
        children: childrenInput.value || 0,
        mealsOver5: childrenAbove5Input.value || 0,
        wifi: wifiCheckbox.checked ? 'Yes' : 'No',
        extraBed: extraBedCheckbox.checked ? 'Yes' : 'No',
        poolView: poolCheckbox.checked ? 'Yes' : 'No',
        golf: golfCheckbox.checked ? 'Yes' : 'No',
    }
    alert("Your choices for rooms have been favourited!");
    localStorage.setItem('favouriteRoomBooking', JSON.stringify(roomBooking));
};

function UpdateLoyaltyPoints() {
    // Retrieve the number of rooms from the order
    const singleRoomQty = parseFloat(singleRoomInput.value) || 0;
    const doubleRoomQty = parseFloat(doubleRoomInput.value) || 0;
    const tripleRoomQty = parseFloat(tripleRoomInput.value) || 0;

    const totalRooms = singleRoomQty + doubleRoomQty + tripleRoomQty;
    let loyaltyPoints;

    // Check if the number of rooms is greater than 3
    if (totalRooms > 3) {
        loyaltyPoints = totalRooms * 20;

        // Store the loyalty points in local storage
        localStorage.setItem("loyaltyPoints", loyaltyPoints);
    }
        
}

function checkLoyaltyPoints() {
    // Retrieve loyalty points from local storage
    const storedLoyaltyPoints = localStorage.getItem("loyaltyPoints");

    // Display loyalty points to the user if available
    if (storedLoyaltyPoints) {
        loyaltyField.textContent = `${storedLoyaltyPoints} Points`;
    }
}

function validateRoomBooking() {
    // Personal Details
    const fname = firstNameInput.value.trim();
    const lname = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneNumberInput.value.trim();
    const country = countryInput.value.trim();

    // Booking Details
    const checkIn = checkInDateInput.value;
    const checkOut = checkOutDateInput.value;
    const noAdults = adultsInput.value;
    const singleRooms = singleRoomInput.value;
    const doubleRooms = doubleRoomInput.value;
    const tripleRooms = tripleRoomInput.value;

    // Validation logic
    if (!fname || !lname || !email || !phone || !country ||
        !checkIn || !checkOut || !noAdults || !(singleRooms || doubleRooms || tripleRooms)) {
        alert('Please fill in all required fields for Room Booking.');
        return false;
    }

    return true;
}

function validateAdventureBooking() {
    // Personal Details
    const fname = firstNameInput.value.trim();
    const lname = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneNumberInput.value.trim();
    const country = countryInput.value.trim();

    // Adventure Booking
    const localAdults = localAdultsInput.value;
    const localChildren = localChildrenInput.value;
    const foreignAdults = foreignAdultsInput.value;
    const foreignChildren = foreignChildrenInput.value;
    const advType = adventuresDropdown.value;

    // Validation logic
    if (!fname || !lname || !email || !phone || !country ||
        !(localAdults || localChildren || foreignAdults || foreignChildren) || advType === 'none') {
        alert('Please fill in all required fields for Adventure Booking.');
        return false;
    }

    return true;
}