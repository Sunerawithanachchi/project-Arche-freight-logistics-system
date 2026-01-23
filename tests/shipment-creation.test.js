async function runTests() {
    console.log("🚀 Starting Ticket 3 Verification...\n");

    const tests = [
        {
            name: "Happy Path: Valid Shipment",
            body: { origin: "Hamburg", destination: "Madrid", status: "BOOKED" }
        },
        {
            name: "Sad Path: Invalid Status",
            body: { origin: "Hamburg", destination: "Madrid", status: "FLYING" }
        },
        {
            name: "Sad Path: Missing Fields",
            body: { origin: "Hamburg" }
        }
    ];

    for (const t of tests) {
        console.log(`Testing: ${t.name}...`);
        try {
            const res = await fetch('http://localhost:3000/shipments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t.body)
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log(`Response:`, data, "\n");
        } catch (err) {
            console.error(`Error connecting to server: ${err.message}`);
        }
    }
}

runTests();