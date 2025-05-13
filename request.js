// Define the request payload, TO TEST ON CONSOLE ONLY

// Function to send the request
function sendRequest() {
    const data = {
        wilaya: "Algiers",             // Example value
        location: "36.7538, 3.0588",  // Example value
        activities: ["Nature", "History"], // Example activities
        budget: 400000,                  // Example budget
        minHotelStars: 3,              // Example
        maxHotelStars: 5,              // Example
        maxAttractions: 3,             // Example max attractions per day
        maxTravelHours: 8,             // Example max travel hours per day
        hasCar: true                   // Example
    };

    console.log("Sending request with data:", data);

    fetch('http://localhost:5000/api/itinerary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Call the function to send the request
sendRequest();
