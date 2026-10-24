
const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const errorMessage = document.getElementById("error");
const results = document.getElementById("results");
const resetBtn = document.getElementById("resetBtn");
const celsiusOutput = document.getElementById("celsius");
const fahrenheitOutput = document.getElementById("fahrenheit");
const kelvinOutput = document.getElementById("kelvin");
const ABSOLUTE_ZERO_C = -273.15;
// Convert a value to two decimal places.
function formatTemperature(value) {
    if (Math.abs(value) < 0.0000001) {
        value = 0;
    }
    return value.toFixed(2);
}
// Convert the selected input unit to Celsius.
function toCelsius(value, unit) {
    if (unit === "C") {
        return value;
    }
    if (unit === "F") {
        return (value - 32) * 5 / 9;
    }

    return value - 273.15;
}
// Check the input and return an error message if invalid.
function validateInput() {
    const rawValue = temperatureInput.value.trim();
    const unit = unitSelect.value;

    if (rawValue === "") {
        return "Please enter a temperature.";
    }
    // Accept ordinary decimals, signed values and scientific notation.
    const numberPattern =
        /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

    if (!numberPattern.test(rawValue)) {
        return "Invalid input! Please enter a numeric value.";
    }
    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
        return "Please enter a valid, finite temperature.";
    }
    const celsius = toCelsius(value, unit);

    if (celsius < ABSOLUTE_ZERO_C) {
        return "Temperature cannot be below absolute zero (-273.15 °C).";
    }
    return "";
}
// Update validation while the user types.
function handleInputChange() {
    results.hidden = true;
    const error = validateInput();
    errorMessage.textContent = error;
    temperatureInput.classList.toggle("invalid", Boolean(error));
    unitSelect.classList.toggle("invalid", Boolean(error));
}
temperatureInput.addEventListener("input", handleInputChange);
unitSelect.addEventListener("change", handleInputChange);
// Convert when the user clicks the Convert button.
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const error = validateInput();
    errorMessage.textContent = error;
    temperatureInput.classList.toggle("invalid", Boolean(error));
    unitSelect.classList.toggle("invalid", Boolean(error));
    if (error) {
        results.hidden = true;
        return;
    }
    const value = Number(temperatureInput.value.trim());
    const unit = unitSelect.value;
    let celsius = toCelsius(value, unit);
    // Avoid tiny floating-point errors at absolute zero.
    if (celsius < ABSOLUTE_ZERO_C + 0.0000001) {
        celsius = ABSOLUTE_ZERO_C;
    }
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;
    celsiusOutput.textContent =
        formatTemperature(celsius) + " °C";
    fahrenheitOutput.textContent =
        formatTemperature(fahrenheit) + " °F";
    kelvinOutput.textContent =
        formatTemperature(kelvin) + " K";
    results.hidden = false;
});
// Reset all fields, messages and results.
resetBtn.addEventListener("click", function () {
    form.reset();
    errorMessage.textContent = "";
    temperatureInput.classList.remove("invalid");
    unitSelect.classList.remove("invalid");
    results.hidden = true;
    temperatureInput.focus();
});
