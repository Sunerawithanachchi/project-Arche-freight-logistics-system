const baseUrl = "http://localhost:3000/shipments";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function runLifecycleTests() {
  console.log(
    "Starting Day 5 - Ticket 1: Lifecycle & State Transition Tests...\n",
  );

  try {
    // 1. Create a fresh shipment to test with
    console.log("Step 1: Creating fresh shipment...");
    const createRes = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: "London",
        destination: "Berlin",
        status: "BOOKED",
      }),
    });

    if (!createRes.ok) throw new Error("Failed to create test shipment");

    const shipment = await createRes.json();
    const id = shipment.id;
    console.log(` Created Shipment ID: ${id} (Status: BOOKED)\n`);

    // 2. Illegal Jump: BOOKED -> DELIVERED (Should be 409)
    console.log("Step 2: Testing Illegal Jump (BOOKED -> DELIVERED)...");
    const jumpRes = await fetch(`${baseUrl}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    const jumpData = await jumpRes.json();
    console.log(`Result: Status ${jumpRes.status} (Expected 409)`);
    assert(
      jumpRes.status === 409,
      `Expected 409 for illegal transition, got ${jumpRes.status}`,
    );
    console.log("Step 2 Passed: Illegal transition correctly blocked");
    console.log(`Response:`, jumpData, "\n");

    // 3. Valid Move: BOOKED -> IN_TRANSIT (Should be 200)
    console.log("Step 3: Testing Valid Move (BOOKED -> IN_TRANSIT)...");
    const validRes = await fetch(`${baseUrl}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "IN_TRANSIT" }),
    });
    const validData = await validRes.json();
    console.log(`Result: Status ${validRes.status} (Expected 200)`);
    console.log(`Response:`, validData, "\n");

    // 4. Regression: IN_TRANSIT -> BOOKED (Should be 409)
    console.log("Step 4: Testing Regression (IN_TRANSIT -> BOOKED)...");
    const regRes = await fetch(`${baseUrl}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "BOOKED" }),
    });
    const regData = await regRes.json();
    console.log(`Result: Status ${regRes.status} (Expected 409)`);
    console.log(`Response:`, regData, "\n");
  } catch (err) {
    console.error("Test Failed:", err.message);
  }
}

runLifecycleTests();
